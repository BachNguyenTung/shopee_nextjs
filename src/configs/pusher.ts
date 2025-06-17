import Pusher from 'pusher';
import PusherClient from 'pusher-js';

// Server-side Pusher instance
export const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

let pusherClient: PusherClient | null = null;

// Client-side Pusher instance (only initialized in browser)
export function getPusherClient(): PusherClient {
  if (typeof window === 'undefined') return null as any;

  if (!pusherClient) {
    pusherClient = new PusherClient(
      process.env.NEXT_PUBLIC_PUSHER_KEY!,
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        forceTLS: true,
        enabledTransports: ['ws', 'wss'],
      }
    );
  }

  return pusherClient;
}

// Helper to check if we're in a browser environment
export const isBrowser = typeof window !== 'undefined';