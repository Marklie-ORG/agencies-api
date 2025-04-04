import { em } from "../db/config/DB.js";
import { Organization } from "../entities/Organization.js";
import { Log } from "./Logger.js";

const logger: Log = Log.getInstance().extend("notifications-util");

export class NotificationsUtil {
  public static async sendReportIsReadyEmails(
    organizationUuid: string,
    message: string,
  ): Promise<void> {
    const organization = await em.findOne(
      Organization,
      { uuid: organizationUuid },
      {
        populate: ["members.user"],
      },
    );

    if (!organization) {
      logger.error(`Organization with UUID ${organizationUuid} not found.`);
      return;
    }

    const members = organization.members.getItems();

    for (const member of members) {
      const user = member.user;
      try {
        console.log(`Sending email to ${user.email}: ${message}`);
      } catch (err) {
        logger.error(`Failed to notify user ${user.email}:`, err);
      }
    }
  }
}
