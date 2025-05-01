import axios, { type AxiosInstance } from "axios";

export class SlackApi {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
        baseURL: `https://slack.com/api`,
        headers: { "Content-Type": "application/json" }
    });
  }
  
  public async handleSlackLogin(code: string, redirectUri: string) {

    const response = await this.api.get("/oauth.v2.access", {
        params: {
            client_id: process.env.SLACK_CLIENT_ID,
            redirect_uri: redirectUri,
            client_secret: process.env.SLACK_CLIENT_SECRET,
            code: code
        }
    });

    return response.data;
  }

  public async getConversationsList(accessToken: string) {
    
    const response = await this.api.get("/conversations.list", 
      {
        params: {
          types: "public_channel,private_channel,mpim"
        },
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    return response.data;
  }

  public async sendMessage(accessToken: string, channel: string, text: string, report_file_id?: string) {
    const response = await this.api.post("/chat.postMessage", 
      {
        channel: channel,
        text: text,
        blocks: [
          {
            type: "markdown",
            text: text,
            block_id: "text"
          },
          report_file_id ? {
            type: "file",
            block_id: "report",
            file_id: report_file_id,
            source: "remote"
          } : null
        ].filter(Boolean)
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    return response.data;
  }

  public async getUsersList(accessToken: string) {

    const response = await this.api.get<UsersList>("/users.list", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return response.data;

  }

  public async joinChannel(accessToken: string, channelId: string) {

    const response = await this.api.post("/conversations.join", 
      {
        channel: channelId
      }, 
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    return response.data;
  }

  public async getTeamInfo(accessToken: string) {
    
    const response = await this.api.get("/team.info", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return response.data;

  }

  public async getUploadUrl(accessToken: string, filename: string, length: number) {

    const response = await this.api.get<{ok: boolean, upload_url: string, file_id: string}>("/files.getUploadURLExternal", {
      params: {
        filename: filename,
        length: length
      },
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return response.data;
  }

  public async uploadFile(accessToken: string, url: string, pdfBuffer: Buffer) {

    const response = await axios.post(url, pdfBuffer,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/pdf',
          'Content-Length': pdfBuffer.length.toString()
        }
      }
    );

    return response.data;
  }

  public async completeUpload(accessToken: string, files: {id: string, title: string}[]) {

    const response = await this.api.post("/files.completeUploadExternal", 
      {
        files: files
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    return response.data;
  }

}

interface UsersList {
  members: Member[];
}

interface Member {
  id: string;
  profile: Profile;
}

interface Profile {
  real_name: string;
  image_48: string;
}