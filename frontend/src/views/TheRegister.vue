<template>
  <div class="register-container">
    <form @submit.prevent="handleSubmit" class="register-form">
      <h2>Inscription</h2>

      <div class="input-group">
        <label for="pseudo">Pseudo</label>
        <input
          id="pseudo"
          v-model="pseudo"
          type="text"
          placeholder="Entrez votre pseudo"
          required
        />
      </div>

      <div class="input-group">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          placeholder="Entrez votre email"
          required
        />
      </div>

      <div class="input-group">
        <label for="password">Mot de passe</label>
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="Entrez votre mot de passe"
          required
        />
      </div>

      <button type="submit" class="submit-btn" :disabled="loading">
        {{ loading ? "En cours…" : "S'inscrire" }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useAuthStore } from "@/stores/auth";

const pseudo = ref("");
const email = ref("");
const password = ref("");
const loading = ref(false);
const toast = useToast();
const router = useRouter();
const auth = useAuthStore();

async function handleSubmit() {
  loading.value = true;
  try {
    await auth.register({
      username: pseudo.value,
      email: email.value,
      password: password.value,
    });
    toast.success("Inscription réussie, connectez-vous");
    router.push("/login");
  } catch (err) {
    let message = err.response?.data?.message || "Erreur d'inscription";
    if (Array.isArray(message)) {
      message = message.join("\n");
    }
    toast.error(message);
  } finally {
    loading.value = false;
  }
}
</script>

<style lang="scss" scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.register-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;

  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #333;
  }
}

.input-group {
  margin-bottom: 1rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #555;
  }

  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.3s;

    &:focus {
      outline: none;
      border-color: #007bff;
    }
  }
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
}
</style>
