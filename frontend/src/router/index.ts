import { createRouter, createWebHistory } from "vue-router";
import Register from "../views/TheRegister.vue";
import Login from "../views/TheLogin.vue";
import TheChat from "@/views/TheChat.vue";
import TheProfil from "@/views/TheProfil.vue";
import { useAuthStore } from "@/stores/auth";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/chat",
    name: "Chat",
    component: TheChat,
    meta: { requiresAuth: true },
  },
  {
    path: "/profil",
    name: "Profil",
    component: TheProfil,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth) {
    if (!token) {
      return next("/login");
    }
    if (!authStore.user) {
      try {
        await authStore.fetchUser();
      } catch (error) {
        authStore.logout();
        return next("/login");
      }
    }
    next();
  } else {
    next();
  }
});

export default router;
