import { HttpClient } from "src/utils/http";

export class MessagesModule {
  private http: HttpClient;
  constructor(http: HttpClient) {
    this.http = http;
  }

  async sendMessage(
    session: string,
    jid: string,
    content: any,
    options: any = {}
  ) {
    const payload = {
      chatId: jid,
      reply_to: options.reply_to,
      text: content.text,
      session,
    };

    await this.http.post("/api/sendText", payload);
  }
}
