<template>
  <div class="chat-container">
    <router-link to="/profil" class="profile-button">
      <button>Profil</button>
    </router-link>
    <aside class="users-list">
      <h2>Utilisateurs En ligne</h2>
      <ul>
        <li
            v-for="(user, index) in chat.online.filter((u) => u.id !== auth.user?.id)"
            :key="index + user.id"
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
          :style="{
            color: msg.sender.colorText,
            backgroundColor: msg.sender.colorBg,
          }"
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
import { onMounted } from "vue";
import { useChatStore } from "@/stores/chat";
import { useAuthStore } from "@/stores/auth";

const chat = useChatStore();
const auth = useAuthStore();

onMounted(async () => {
  await auth.fetchUser();
  chat.connect();
});
</script>

<style scoped lang="scss">
.chat-container {
  display: flex;
  height: 100vh;
  background: #f5f5f5;
  font-family: Arial, sans-serif;
}
/* Users list */
.users-list {
  width: 280px;
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  padding: 1.5rem;
  overflow-y: auto;
  border-right: 1px solid #e1e5e9;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);

  h2 {
    margin-bottom: 1rem;
    font-size: 1.1rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #495057;
    border-bottom: 2px solid #667eea;
    padding-bottom: 0.5rem;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    padding: 0.875rem 1rem;
    margin-bottom: 0.5rem;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid transparent;
    font-weight: 500;
    color: #495057;
    position: relative;

    &:hover {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      transform: translateX(4px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      border-color: rgba(102, 126, 234, 0.2);
    }

    &.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-weight: 600;
      transform: translateX(6px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);

      &::before {
        content: '';
        position: absolute;
        left: -8px;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 70%;
        background: #667eea;
        border-radius: 2px;
      }
    }

    &:active {
      transform: translateX(2px);
      transition: transform 0.1s ease;
    }
  }
}

/* Chat window */
.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.messages {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.message {
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e5e9;
  position: relative;

  strong {
    font-size: 0.875rem;
    margin-bottom: 0.25rem;
    display: block;
  }

  span {
    line-height: 1.4;
    word-wrap: break-word;
  }

  small {
    font-size: 0.75rem;
    margin-top: 0.25rem;
    display: block;
    text-align: right;
  }
}

.message.sent {
  align-self: flex-end;
  color: white;

  strong,
  span {
    color: white;
  }

  small {
    color: rgba(255, 255, 255, 0.8);
  }
}

.message:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
}

.input-area {
  display: flex;
  padding: 0.5rem;
  background: #e0e0e0;
}

.input-area input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.input-area button {
  margin-left: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: #4caf50;
  color: #fff;
  cursor: pointer;
}

.profile-button {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  z-index: 10;

  button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
      background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 10px rgba(102, 126, 234, 0.4);
    }
  }
}
</style>
