import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_NEST_API_URL || "http://localhost:3000",
});

// Types
interface User {
  id: string;
  username: string;
  email: string;
  colorText?: string;
  colorBg?: string;
}

interface UpdateProfileDto {
  username?: string;
  email?: string;
  colorText?: string;
  colorBg?: string;
}

interface UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
}

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const authStore = useAuthStore();

  const getMe = async (): Promise<User> => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.get<User>("/users/me", {
        headers: getAuthHeaders(),
      });
      user.value = response.data;
      return response.data;
    } catch (err) {
      error.value = axios.isAxiosError(err) ? err.message : "An error occurred";
      user.value = null;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateProfile = async (data: UpdateProfileDto) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.patch("/users/me", data, {
        headers: getAuthHeaders(),
      });
      user.value = response.data;
      return response.data;
    } catch (err) {
      error.value = axios.isAxiosError(err) ? err.message : "An error occurred";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updatePassword = async (data: UpdatePasswordDto) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.patch("/users/me/password", data, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (err) {
      error.value = axios.isAxiosError(err) ? err.message : "An error occurred";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const clearError = () => {
    error.value = null;
  };

  const logout = () => {
    user.value = null;
    localStorage.removeItem("token");
  };

  return {
    user,
    isLoading,
    error,
    getMe,
    updateProfile,
    updatePassword,
    clearError,
    logout,
  };
});
