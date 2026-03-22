import { SERVER_URL } from '@/config/server';

export function getSignalingServer(): string {
  return process.env.SIGNALING_SERVER ?? SERVER_URL;
}
