import type {
  CleanedUser,
  LoginRequestBody,
  RegistrationRequestBody,
} from "../interfaces/AuthInterfaces";
import { User } from "../entities/User.js";
import jwt, { type JwtPayload, type VerifyErrors } from "jsonwebtoken";
import { em } from "../db/config/DB.js";
import { TokenExpiration } from "../enums/enums.js";
import bcrypt from "bcryptjs";
import { OrganizationMember } from "../entities/OrganizationMember.js";
import type { Organization } from "../entities/Organization.js";

export class AuthenticationUtil {
  public static readonly ACCESS_SECRET = process.env
    .ACCESS_TOKEN_SECRET as string;

  public static readonly REFRESH_SECRET = process.env
    .REFRESH_TOKEN_SECRET as string;

  public static async register(body: RegistrationRequestBody) {
    const existingUser: User | null = await em.findOne(User, {
      email: body.email,
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const newUser: User = new User();

    newUser.firstName = body.firstName;
    newUser.lastName = body.lastName;
    newUser.email = body.email;
    newUser.password = body.password; //hashed before creating via @BeforeCreate

    await em.persist(newUser).flush();

    return this.buildTokens(newUser);
  }

  public static verifyRefreshToken(refreshToken: string) {
    return new Promise<string | null | false>((resolve, reject) => {
      jwt.verify(
        refreshToken,
        this.REFRESH_SECRET,
        async (
          err: VerifyErrors | null,
          user: JwtPayload | string | undefined,
        ) => {
          if (err) {
            reject(err);
          }

          if (user === undefined) {
            resolve(null);
            return;
          }

          const newAccessToken = this.signAccessToken(user as CleanedUser);

          resolve(newAccessToken);
        },
      );
    });
  }

  public static async login(body: LoginRequestBody) {
    const existingUser: User | null = await em.findOne(User, {
      email: body.email,
    });

    if (!existingUser) {
      throw new Error(`User does not exist with email ${body.email}`);
    }

    if (!(await this.comparePasswords(body.password, existingUser.password))) {
      throw new Error(`Passwords don't match for user ${body.email}`);
    }

    return this.buildTokens(existingUser);
  }

  public static async getUserOrganizations(
    user: User,
  ): Promise<Organization[]> {
    const organizations = await em.find(
      OrganizationMember,
      { user },
      { populate: ["organization"] },
    );

    return organizations.map((orgMember) => orgMember.organization);
  }

  public static async convertPersistedToUser(user: User): Promise<CleanedUser> {
    return {
      uuid: user.uuid,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: await this.getUserRoleInOrganization(user),
    };
  }

  public static signAccessToken(cleanedUser: CleanedUser) {
    return jwt.sign(cleanedUser, this.ACCESS_SECRET, {
      expiresIn: TokenExpiration.ACCESS,
    });
  }

  public static singRefreshToken(cleanedUser: CleanedUser) {
    return jwt.sign(cleanedUser, this.REFRESH_SECRET);
  }

  private static async comparePasswords(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  private static async buildTokens(user: User) {
    const cleanedUser = {
      uuid: user.uuid,
      email: user.email,
      roles: await this.getUserRoleInOrganization(user),
    } as CleanedUser;

    const accessToken: string = this.signAccessToken(cleanedUser);
    const refreshToken: string = this.singRefreshToken(cleanedUser);

    return { accessToken, refreshToken };
  }

  public static async getUserRoleInOrganization(user: User) {
    const organizations: Organization[] = await this.getUserOrganizations(user);

    return await Promise.all(
      organizations.map(async (organization: Organization) => {
        const role = await this.getUserOrganizationMemberships(
          user,
          organization,
        );
        return {
          role,
          organizationUuid: organization.uuid,
        };
      }),
    );
  }

  private static async getUserOrganizationMemberships(
    user: User,
    organization: Organization,
  ) {
    const organizationMember = await em.findOne(OrganizationMember, {
      user,
      organization,
    });

    return organizationMember?.role;
  }

  public static async fetchUserWithTokenInfo(
    token: string,
  ): Promise<User | null> {
    const userInToken: User | null | false =
      await AuthenticationUtil.verifyTokenAndFetchUser(token);
    if (
      userInToken === null ||
      !userInToken ||
      !userInToken.uuid ||
      !userInToken.uuid
    ) {
      return null;
    }
    return userInToken;
  }

  public static verifyTokenAndFetchUser(
    token: string,
  ): Promise<User | null | false> {
    return new Promise<User | null | false>((resolve, reject) => {
      jwt.verify(
        token,
        this.ACCESS_SECRET,
        (
          err: VerifyErrors | null,
          decoded: JwtPayload | string | undefined,
        ) => {
          if (err) {
            reject(err);
          }

          if (decoded === undefined) {
            resolve(null);
            return;
          }

          const user = decoded as JwtPayload;

          if (!user.uuid) {
            resolve(false);
            return;
          }

          em.findOne(User, {
            uuid: user.uuid,
          })
            .then((persistedUser: User | null) => {
              resolve(persistedUser);
            })
            .catch((e: Error) => {
              reject(e);
            });
        },
      );
    });
  }
}
