import { HttpClient } from "./utils/http";
import { SessionsModule } from "./modules/sessions";
import { MessagesModule } from "./modules/messages";

export class WhatsAppAPI {
  private http: HttpClient;
  private isPollingMap: Map<string, boolean>;
  private eventListeners: Map<string, (data: any) => void>;
  public sessions: SessionsModule;
  public messages: MessagesModule;

  constructor(apiKey: string, baseUrl: string = "http://localhost:3000") {
    this.http = new HttpClient(apiKey, baseUrl);
    this.isPollingMap = new Map();
    this.eventListeners = new Map();
    this.sessions = new SessionsModule(this.http);
    this.messages = new MessagesModule(this.http);
  }

  on(session: string, event: string, callback: (data: any) => void) {
    const key = `${session}:${event}`;

    if (this.eventListeners.has(key)) {
      console.warn(`Слушатель для ${key} уже существует`);
      return;
    }

    this.eventListeners.set(key, callback);
    this.longPoll(session, event, callback);
  }

  off(session: string, event: string) {
    const key = `${session}:${event}`;
    this.eventListeners.delete(key);
    this.stopLongPoll(session, event);
  }

  private async longPoll(
    session: string,
    event: string,
    callback: (data: any) => void
  ) {
    const key = `${session}:${event}`;

    if (this.isPollingMap.get(key)) return;

    this.isPollingMap.set(key, true);
    const url = `/api/sessions/${session}/long-poll?event=${event}`;

    const poll = async () => {
      if (!this.isPollingMap.get(key)) return;

      try {
        const data = await this.http.get(url);

        if (data?.error === "Request timed out") {
          poll();
          return;
        }

        callback(data);
      } catch (error) {
        console.error("Ошибка в Long Polling:", error);
      }

      if (this.isPollingMap.get(key)) {
        poll();
      }
    };

    poll();
  }

  private stopLongPoll(session: string, event: string) {
    const key = `${session}:${event}`;
    this.isPollingMap.set(key, false);
  }
}
