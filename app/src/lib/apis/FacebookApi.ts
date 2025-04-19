import axios from "axios";

export class FacebookApi {
  private constructor() {}
  
  public static async handleFacebookLogin(code: string, redirectUri: string) {

    const api = axios.create({
        baseURL: `https://graph.facebook.com/v22.0`,
        headers: { "Content-Type": "application/json" }
    });

    const response = await api.get("/oauth/access_token", {
        params: {
            client_id: process.env.FACEBOOK_APP_ID,
            redirect_uri: redirectUri,
            client_secret: process.env.FACEBOOK_APP_SECRET,
            code: code
        }
    });

    return response.data;
  }
}
