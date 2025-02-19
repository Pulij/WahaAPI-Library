import { HttpClient } from "../utils/http";

export class SessionsModule {
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  async listSessions() {
    return await this.http.get("/api/sessions");
  }

  async createSession() {
    return await this.http.post("/api/sessions");
  }

  async getSession(sessionId: string) {
    return await this.http.get(`/api/sessions/${sessionId}`);
  }

  async deleteSession(sessionId: string) {
    return await this.http.delete(`/api/sessions/${sessionId}`);
  }

  async startSession(sessionId: string) {
    return await this.http.post(`/api/sessions/${sessionId}/start`);
  }

  async stopSession(sessionId: string) {
    return await this.http.post(`/api/sessions/${sessionId}/stop`);
  }
}
