<template>
  <div class="profile-container">
    <router-link to="/chat" class="profile-button">
      <button>Chat</button>
    </router-link>
    <div class="profile-card">
      <h1 class="profile-title">My Profile</h1>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading">Loading...</div>

      <!-- Error State -->
      <div v-if="error" class="error">
        {{ error }}
        <button @click="clearError" class="error-close">×</button>
      </div>

      <!-- Profile Form -->
      <form
        v-if="user && !isLoading"
        @submit.prevent="handleUpdateProfile"
        class="profile-form"
      >
        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            v-model="profileForm.username"
            type="text"
            :disabled="isLoading"
            required
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="profileForm.email"
            type="email"
            :disabled="isLoading"
            required
          />
        </div>

        <div class="form-group">
          <label for="colorText">Text Color</label>
          <div class="color-input-container">
            <input
              id="colorText"
              v-model="profileForm.colorText"
              type="color"
              :disabled="isLoading"
              class="color-input"
            />
            <input
              v-model="profileForm.colorText"
              type="text"
              :disabled="isLoading"
              placeholder="#ffffff"
              class="color-text-input"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="colorBg">Background Color</label>
          <div class="color-input-container">
            <input
              id="colorBg"
              v-model="profileForm.colorBg"
              type="color"
              :disabled="isLoading"
              class="color-input"
            />
            <input
              v-model="profileForm.colorBg"
              type="text"
              :disabled="isLoading"
              placeholder="#3498db"
              class="color-text-input"
            />
          </div>
        </div>

        <!-- Color Preview -->
        <div class="color-preview">
          <div
            class="preview-box"
            :style="{
              backgroundColor: profileForm.colorBg,
              color: profileForm.colorText,
            }"
          >
            Preview: {{ profileForm.username }}
          </div>
        </div>

        <button type="submit" :disabled="isLoading" class="btn btn-primary">
          Update Profile
        </button>
      </form>

      <!-- Password Change Form -->
      <form
        v-if="user && !isLoading"
        @submit.prevent="handleUpdatePassword"
        class="password-form"
      >
        <h2>Change Password</h2>

        <div class="form-group">
          <label for="currentPassword">Current Password</label>
          <input
            id="currentPassword"
            v-model="passwordForm.currentPassword"
            type="password"
            :disabled="isLoading"
            required
          />
        </div>

        <div class="form-group">
          <label for="newPassword">New Password</label>
          <input
            id="newPassword"
            v-model="passwordForm.newPassword"
            type="password"
            :disabled="isLoading"
            required
          />
        </div>

        <button type="submit" :disabled="isLoading" class="btn btn-secondary">
          Update Password
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, watch } from "vue";
import { useUserStore } from "@/stores/user";
import { useToast } from "vue-toastification";

const toast = useToast();

const userStore = useUserStore();
const {
  user,
  error,
  isLoading,
  getMe,
  updateProfile,
  updatePassword,
  clearError,
} = userStore;


const profileForm = reactive({
  username: "",
  email: "",
  colorText: "#ffffff",
  colorBg: "#3498db",
});

const passwordForm = reactive({
  currentPassword: "",
  newPassword: "",
});




onMounted(async () => {
  try {
    const me = await userStore.getMe();
    profileForm.username = me.username;
    profileForm.email = me.email;
    profileForm.colorText = me.colorText || "#ffffff";
    profileForm.colorBg = me.colorBg || "#3498db";
  } catch (err) {
    console.error("Failed to fetch user data:", err);
    toast.error("Impossible de charger votre profil.");
  }
});

const handleUpdateProfile = async () => {
  try {
    await updateProfile({
      username: profileForm.username,
      email: profileForm.email,
      colorText: profileForm.colorText,
      colorBg: profileForm.colorBg,
    });
    toast.success("Profile updated successfully!");
  } catch (error) {
    console.error("Failed to update profile:", error);
    toast.error("Failed to update profile");
  }
};

const handleUpdatePassword = async () => {
  try {
    await updatePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
    passwordForm.currentPassword = "";
    passwordForm.newPassword = "";
    toast.success("Password updated successfully!");
  } catch (error) {
    console.error("Failed to update password:", error);
    toast.error("Failed to update password");
  }
};
</script>

<style lang="scss" scoped>
.profile-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.profile-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.profile-title {
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #5d5d5d;
}

.error {
  background: #fee;
  border: 1px solid #fcc;
  color: #c33;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  position: relative;

  .error-close {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: #c33;
  }
}

.profile-form,
.password-form {
  margin-bottom: 2rem;

  h2 {
    color: #333;
    margin-bottom: 1rem;
    padding-top: 2rem;
    border-top: 1px solid #eee;
  }
}

.form-group {
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #333;
  }

  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: #007bff;
    }

    &:disabled {
      background: #f5f5f5;
      cursor: not-allowed;
    }
  }
}

.color-input-container {
  display: flex;
  gap: 0.5rem;
  align-items: center;

  .color-input {
    width: 60px;
    height: 40px;
    padding: 0;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;

    &::-webkit-color-swatch-wrapper {
      padding: 0;
    }

    &::-webkit-color-swatch {
      border: none;
      border-radius: 3px;
    }
  }

  .color-text-input {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    font-family: monospace;
  }
}

.color-preview {
  margin-bottom: 1.5rem;

  .preview-box {
    padding: 1rem;
    border-radius: 4px;
    text-align: center;
    font-weight: 500;
    border: 1px solid #ddd;
    transition: all 0.2s;
  }
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &.btn-primary {
    background: #007bff;
    color: white;

    &:hover:not(:disabled) {
      background: #0056b3;
    }
  }

  &.btn-secondary {
    background: #6c757d;
    color: white;

    &:hover:not(:disabled) {
      background: #545b62;
    }
  }
}

.profile-button {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;

  button {
    background: #007bff;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s;

    &:hover {
      background: #0056b3;
    }
  }
}
</style>
