import { createRouter, createWebHistory } from "vue-router";
import Register from "../views/TheRegister.vue";
import Login from "../views/TheLogin.vue";
import TheHome from "@/views/TheHome.vue";
import TheChat from "@/views/TheChat.vue";
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
    path: "/home",
    name: "Home",
    component: TheHome,
    meta: { requiresAuth: true },
  },
  {
    path: "/chat",
    name: "Chat",
    component: TheChat,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("token");
  const authStore = useAuthStore();

  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      return next("/login");
    }
    try {
      await authStore.fetchUser();
      next();
    } catch (error) {
      authStore.logout();
      next("/login");
    }
  } else {
    next();
  }
});

export default router;
