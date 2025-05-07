import { PubSub, Topic, Subscription } from "@google-cloud/pubsub";
import { Log } from "marklie-ts-core";

const logger: Log = Log.getInstance().extend("pub-sub");

export class PubSubWrapper {
  private static pubsub = new PubSub({
    projectId: "saas-452909",
  });

  static async publishMessage(
    topicName: string,
    message: any,
  ): Promise<string> {
    const dataBuffer = Buffer.from(JSON.stringify(message));
    const topic: Topic = PubSubWrapper.pubsub.topic(topicName);

    try {
      const messageId = await topic.publishMessage({
        data: dataBuffer,
      });
      logger.info(`Published message ${messageId} to topic ${topicName}`);
      return messageId;
    } catch (error: any) {
      logger.error(
        `Error publishing message to topic ${topicName}: ${error.message}`,
      );
      throw error;
    }
  }

  static subscribe(
    subscriptionName: string,
    onMessage: (data: any) => Promise<void> | void,
    onError?: (error: Error) => void,
  ): Subscription {
    const subscription: Subscription =
      PubSubWrapper.pubsub.subscription(subscriptionName);

    subscription.on("message", async (message) => {
      try {
        const data = JSON.parse(message.data.toString());
        await onMessage(data);
        message.ack();
      } catch (error) {
        logger.error(`Error processing message: ${error}`);
        if (onError) {
          onError(error as Error);
        }
      }
    });

    subscription.on("error", (error) => {
      logger.error(`Subscription error on ${subscriptionName}: ${error}`);
      if (onError) {
        onError(error);
      }
    });

    return subscription;
  }
}
