import { createRouter, createWebHistory } from "vue-router";
import Register from "../views/TheRegister.vue";
import Login from "../views/TheLogin.vue";
import TheHome from "@/views/TheHome.vue";
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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
