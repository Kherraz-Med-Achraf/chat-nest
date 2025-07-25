import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";
import { useAuthStore } from "@/stores/auth";

const toastOptions = {
  position: POSITION.TOP_RIGHT,
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
};

const app = createApp(App);

app.use(createPinia());

const authStore = useAuthStore();

if (authStore.token) {
  try {
    await authStore.fetchUser();
  } catch {
    authStore.logout();
  }
}
app.use(router);
app.use(Toast, toastOptions);

app.mount("#app");
