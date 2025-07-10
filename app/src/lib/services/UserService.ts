import {
  AuthenticationUtil,
  Database,
  Organization,
  PubSubWrapper,
  User,
} from "marklie-ts-core";
import { ChangeEmailToken } from "marklie-ts-core/dist/lib/entities/ChangeEmailToken.js";
import { PasswordRecoveryToken } from "marklie-ts-core/dist/lib/entities/PasswordRecoveryToken.js";
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

  async changePassword(
    password: string,
    newPassword: string,
    user: User,
  ): Promise<void> {
    const { accessToken, refreshToken } = await AuthenticationUtil.login({
      email: user.email,
      password: password,
    });

    if (!accessToken || !refreshToken) {
      throw new Error("Invalid password");
    }

    user.password = newPassword;

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

    const emailChangeToken = AuthenticationUtil.signEmailChangeToken(
      user,
      newEmail,
    );

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
    const { userUuid, isExpired, newEmail } =
      await AuthenticationUtil.verifyEmailChangeToken(token);

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

  async sendPasswordRecoveryEmail(email: string): Promise<void> {
    if (!email) {
      throw new Error("Email cannot be empty");
    }

    const user = await database.em.findOne(User, { email });

    if (!user) {
      throw new Error("User not found");
    }

    const passwordRecoveryToken =
      AuthenticationUtil.signPasswordRecoveryToken(user);

    const token = database.em.create(PasswordRecoveryToken, {
      token: passwordRecoveryToken,
      user: user,
    });
    await database.em.persistAndFlush(token);

    const payload = {
      token: passwordRecoveryToken,
      email: email,
    };

    const topic = "notification-send-password-recovery-email";

    await PubSubWrapper.publishMessage(topic, payload);
  }

  async verifyPasswordRecovery(
    token: string,
    newPassword: string,
  ): Promise<void> {
    const { userUuid, isExpired, toRecoverPassword, passwordRecoveryToken } =
      await AuthenticationUtil.verifyPasswordRecoveryToken(token);

    if (isExpired) {
      throw new Error("Token expired");
    }

    if (!toRecoverPassword) {
      throw new Error("Token is not for password recovery");
    }

    const user = await database.em.findOne(User, { uuid: userUuid });
    if (!user) {
      throw new Error("User not found");
    }

    const existingToken = await database.em.findOne(PasswordRecoveryToken, {
      token: passwordRecoveryToken,
    });
    if (existingToken.isUsed) {
      throw new Error("Token already used");
    }

    user.password = newPassword;

    await database.em.persistAndFlush(user);

    existingToken.isUsed = true;

    await database.em.persistAndFlush(existingToken);
  }
}
