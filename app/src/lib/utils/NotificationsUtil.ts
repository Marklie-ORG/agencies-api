import { Database, Log, Organization } from "markly-ts-core";

const logger: Log = Log.getInstance().extend("notifications-util");
const database = await Database.getInstance();

export class NotificationsUtil {
  public static async sendReportIsReadyEmails(
    organizationUuid: string,
    message: string,
  ): Promise<void> {
    const organization = await database.em.findOne(
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
