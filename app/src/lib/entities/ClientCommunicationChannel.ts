import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.js";
import { OrganizationClient } from "./OrganizationClient.js";

@Entity({
  discriminatorColumn: "type",
  discriminatorMap: {
    communicationChannel: "CommunicationChannel",
    email: "EmailChannel",
    slack: "SlackChannel",
    whatsapp: "WhatsAppChannel",
  },
})
export abstract class CommunicationChannel extends BaseEntity {
  @Property()
  active: boolean = true;

  @ManyToOne(() => OrganizationClient)
  client!: OrganizationClient;

  abstract send(report: unknown): Promise<void>;
}

@Entity({ discriminatorValue: "email" })
export class EmailChannel extends CommunicationChannel {
  @Property()
  emailAddress!: string;

  async send(report: unknown): Promise<void> {
    console.log(`Sending email to ${this.emailAddress}: ${report}`);
  }
}

@Entity({ discriminatorValue: "slack" })
export class SlackChannel extends CommunicationChannel {
  @Property()
  webhookUrl!: string;

  async send(report: unknown): Promise<void> {
    console.log(`Posting to Slack webhook ${this.webhookUrl}: ${report}`);
  }
}

@Entity({ discriminatorValue: "whatsapp" })
export class WhatsAppChannel extends CommunicationChannel {
  @Property()
  phoneNumber!: string;

  async send(report: unknown): Promise<void> {
    console.log(`Sending WhatsApp message to ${this.phoneNumber}: ${report}`);
  }
}
