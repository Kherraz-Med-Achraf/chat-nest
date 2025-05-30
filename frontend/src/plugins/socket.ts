import { io, type Socket } from "socket.io-client";
import { useAuthStore } from "@/stores/auth";

let socket: Socket | null = null;

export function getSocket(): Socket {
  const auth = useAuthStore();

  if (socket && socket.io.opts.auth["token"] !== auth.token) {
    socket.disconnect();
    socket = null;
  }

  if (!socket) {
    socket = io(import.meta.env.VITE_NEST_API_URL as string, {
      path: "/ws",
      auth: { token: auth.token },
    });

    
    socket.on("connect_error", (err) => {
      console.error("WS connect_error", err.message);
    });
  }

  return socket;
}
