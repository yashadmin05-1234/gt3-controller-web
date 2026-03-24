export interface CreateSessionResponse {
  token: string;
  sessionId: string;
  name?: string;
  expiresAt: number;
  agentCommand: string;
  agentDownloadUrl: string;
}
