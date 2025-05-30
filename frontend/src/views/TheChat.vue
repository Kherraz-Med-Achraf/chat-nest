<template>
  <div class="chat-container">
    <aside class="users-list">
      <h2>En ligne</h2>
      <ul>
        <li
          v-for="user in chat.online"
          :key="user.id"
          @click="chat.startChat(user)"
          :class="{ active: chat.selectedUser?.id === user.id }"
        >
          {{ user.username }}
        </li>
      </ul>
    </aside>

    <section v-if="chat.currentRoom" class="chat-window">
      <div class="messages">
        <div
          v-for="msg in chat.history[chat.currentRoom]"
          :key="msg.id"
          class="message"
          :style="{ color: msg.sender.colorText, backgroundColor: msg.sender.colorBg }"
        >
          <strong>{{ msg.sender.username }}:</strong>
          <span>{{ msg.content }}</span>
          <small>{{ new Date(msg.createdAt).toLocaleTimeString() }}</small>
        </div>
      </div>

      <div class="input-area">
        <input
          v-model="chat.newMessage"
          @keyup.enter="chat.sendMessage"
          placeholder="Écrire un message..."
        />
        <button @click="chat.sendMessage">Envoyer</button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useChatStore } from '@/stores/chat';
import { useAuthStore } from '@/stores/auth';

const chat = useChatStore();
const auth = useAuthStore();

onMounted(async () => {
  await auth.fetchUser(); 
  chat.connect();
});
</script>

<style scoped>
.chat-container {
  display: flex;
  height: 100%;
}
.users-list {
  width: 200px;
  border-right: 1px solid #ddd;
  padding: 1rem;
}
.users-list ul {
  list-style: none;
  padding: 0;
}
.users-list li {
  padding: 0.5rem;
  cursor: pointer;
}
.users-list li.active {
  background: #f0f0f0;
  font-weight: bold;
}

.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}
.messages {
  flex: 1;
  overflow-y: auto;
}
.message {
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
}
.input-area {
  display: flex;
  gap: 0.5rem;
}
input {
  flex: 1;
  padding: 0.5rem;
}
button {
  padding: 0.5rem 1rem;
}
</style>
