import { SERVER_URL } from '@/config/server';

export function getSignalingServer(): string {
  return process.env.NEXT_PUBLIC_SIGNALING_SERVER ?? SERVER_URL;
}
