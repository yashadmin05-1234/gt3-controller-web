import { v4 as uuidv4 } from 'uuid';

const TTL_SECONDS = parseInt(process.env.SESSION_TOKEN_TTL_SECONDS ?? '3600', 10);

export function generateToken(): string {
  return uuidv4().replace(/-/g, '');
}

export function tokenExpiry(): number {
  return Date.now() + TTL_SECONDS * 1000;
}

export function isTokenExpired(expiresAt: number): boolean {
  return Date.now() > expiresAt;
}
