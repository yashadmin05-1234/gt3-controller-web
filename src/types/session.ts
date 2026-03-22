export interface CreateSessionResponse {
  token: string;
  sessionId: string;
  expiresAt: number;
  agentCommand: string;
  agentDownloadUrl: string;
}
