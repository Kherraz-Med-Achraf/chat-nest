<template>
  <div class="login">
    <div class="login-top">
      <h1 class="logo">Whisper</h1>
      <h2>Veuillez entrer vos identifiants pour vous connecter.</h2>
    </div>
    <div class="login-container">
      <form @submit.prevent="onSubmit">
        <div class="form-group">
          <label>Pseudo</label>
          <input
            v-model="pseudo"
            @blur="pseudo = pseudo.trim()"
            type="text"
            required
          />
        </div>
        <div class="form-group">
          <label>Mot de passe</label>
          <input v-model="password" type="password" required />
        </div>
        <button type="submit" :disabled="loading">
          {{ loading ? 'Connexion…' : 'Se connecter' }}
        </button>
      </form>
    </div>
    <div class="login-bottom">
      <p>
        Vous n'avez pas de compte ?
        <router-link to="/register">Inscrivez-vous</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'

const pseudo = ref('')
const password = ref('')
const loading = ref(false)

const router = useRouter()
const toast = useToast()
const auth = useAuthStore()

async function onSubmit() {
  loading.value = true
  try {
    await auth.login({ username: pseudo.value, password: password.value })
    toast.success('Connecté avec succès !')
    router.push('/home')
  } catch (err: any) {
    let msg = err.response?.data?.message || 'Échec de la connexion'
    if (Array.isArray(msg)) {
      msg = msg.join('\n')
    }
    toast.error(msg)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login {
  width: 100%;
  height: 100vh;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 25px;

  &-top {
    width: 100%;
    text-align: center;
    h1 {
      font-family: "Archivo Black", sans-serif;
      font-size: 54px;
      color: $primary-color;
    }
    h2 {
      font-size: 1.1rem;
      color: #111827;
      margin-bottom: 25px;
      font-weight: 500;
    }
  }

  &-container {
    width: 100%;
    max-width: 400px;
    padding: 48px;
    background-color: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;

    form {
      display: flex;
      flex-direction: column;
      gap: 20px;

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 5px;

        label {
          font-size: 1rem;
          color: #374151;
          font-weight: 500;
        }

        input {
          padding: 10px;
          border: 1px solid #e5e7eb;
          border-radius: 4px;

          &:focus {
            border-color: $primary-color;
            outline: none;
          }
        }
      }

      button {
        padding: 10px;
        background-color: $primary-color;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;

        &:disabled {
          background-color: #d1d5db;
          cursor: not-allowed;
        }

        &:hover:not(:disabled) {
          background-color: blue;
        }
      }
    }
  }

  &-bottom {
    text-align: center;
    p {
      color: #6b7280;
      a {
        color: $primary-color;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
