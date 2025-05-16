import { AuthenticationUtil, Database, Organization, PubSubWrapper, User } from "marklie-ts-core";
import { ChangeEmailToken } from "marklie-ts-core/dist/lib/entities/ChangeEmailToken.js";

const database = await Database.getInstance();

export class UserService {

  async setActiveOrganization(
    activeOrganizationUuid: string,
    user: User,
  ): Promise<void> {
    user.activeOrganization = database.em.getReference(
      Organization,
      activeOrganizationUuid,
    );
    await database.em.persistAndFlush(user);
  }

  async setName(
    firstName: string,
    lastName: string,
    user: User,
  ): Promise<void> {
    user.firstName = firstName;
    user.lastName = lastName;
    await database.em.persistAndFlush(user);
  }

  async sendChangeEmailEmail(
    newEmail: string,
    password: string,
    user: User,
  ): Promise<void> {

    const { accessToken, refreshToken } = await AuthenticationUtil.login({
      email: user.email,
      password: password,
    });

    if (!accessToken || !refreshToken) {
      throw new Error("Invalid password");
    }

    if (user.email === newEmail) {
      throw new Error("New email cannot be the same as the current email");
    }
    
    const emailChangeToken = AuthenticationUtil.signEmailChangeToken(user, newEmail);
    
    const token = database.em.create(ChangeEmailToken, {
      token: emailChangeToken,
      user: user,
    });
    await database.em.persistAndFlush(token);
    
    const payload = {
      email: newEmail,
      token: token,
    };

    const topic = "notification-send-change-email-sub";

    await PubSubWrapper.publishMessage(topic, payload);

  }

  async verifyEmailChange(token: string): Promise<void> {

    const { userUuid, isExpired, newEmail } = await AuthenticationUtil.verifyEmailChangeToken(token);

    if (isExpired) {
      throw new Error("Token expired");
    }

    const user = await database.em.findOne(User, { uuid: userUuid });
    if (!user) {
      throw new Error("User not found");
    }

    user.email = newEmail;
    await database.em.persistAndFlush(user);

  }

}