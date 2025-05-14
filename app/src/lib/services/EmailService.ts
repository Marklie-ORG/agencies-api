import { PubSubWrapper } from "marklie-ts-core";

export class EmailService {

    public static async sendEmail(newEmail: string, token: string) {
        try {
    
            const payload = {
                email: newEmail,
                token: token,
            };
        
            const topic = "notification-send-change-email-sub";
        
            await PubSubWrapper.publishMessage(topic, payload);
        
            return { success: true };
            
        } catch (e) {
            return { success: false };
        }
    }

}
