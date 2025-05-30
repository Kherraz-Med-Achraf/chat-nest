import { defineStore } from "pinia";
import { ref, reactive, watch } from "vue";
import { getSocket } from "@/plugins/socket";
import type { User, Message } from "@/types";
import { useAuthStore } from "@/stores/auth";

export const useChatStore = defineStore("chat", () => {
  const online = ref<User[]>([]);
  const history = reactive<Record<string, Message[]>>({});
  const currentRoom = ref<string | null>(null);
  const selectedUser = ref<User | null>(null);
  const newMessage = ref("");
  

  function connect() {
    console.log("Connecting to chat...");
    const socket = getSocket();

    socket.on("users.online", (users) => {
      const me = useAuthStore().user;
      online.value = users.filter((u) => u.id !== me?.id);
      console.log("Online users:", online.value);
    });

    socket.on("chat.open", ({ room, with: user }) => {
      selectedUser.value = user;
      if (!history[room]) history[room] = [];
      currentRoom.value = room;
      console.log(`Chat opened with ${user.username} in room ${room}`);
    });

    socket.on("chat.history", ({ room, history: msgs }) => {
      history[room] = msgs;
      currentRoom.value = room;
      console.log(`Chat history loaded for room ${room}`);
    });

    socket.on("chat.message", (msg) => {
      const room =
        currentRoom.value ||
        `${Math.min(msg.sender.id, msg.receiver.id)}-${Math.max(msg.sender.id, msg.receiver.id)}`;
      if (!history[room]) history[room] = [];
    
      history[room].push(msg);
      console.log(`New message in room ${room}:`, msg);
    });
  }

  function startChat(user: User) {
    selectedUser.value = user;
    const socket = getSocket();
    socket.emit("chat.start", { targetId: user.id });
    
  }

  function sendMessage() {
    if (!currentRoom.value || !selectedUser.value || !newMessage.value.trim())
      return;
    const socket = getSocket();
    socket.emit("chat.message", {
      room: currentRoom.value,
      to: selectedUser.value.id,
      content: newMessage.value,
    });
    newMessage.value = "";
  }

  return {
    online,
    history,
    currentRoom,
    selectedUser,
    newMessage,
    connect,
    startChat,
    sendMessage,
  };
});
