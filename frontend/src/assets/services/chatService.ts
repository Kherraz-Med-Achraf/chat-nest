import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores/auth';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    const auth = useAuthStore();
    socket = io(import.meta.env.VITE_NEST_API_URL as string, {
      path: '/ws',
      auth: { token: auth.token },
    });
  }
  return socket;
}
