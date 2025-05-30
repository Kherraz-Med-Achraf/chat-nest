<template>
    <div class="home">
        <h1 class="greeting">Bonjour {{ user?.username || 'Invité' }}</h1>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const user = computed(() => authStore.user)
</script>

<style lang="scss" scoped>
.home {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 2rem;

    .greeting {
        font-size: 2.5rem;
        font-weight: bold;
        text-align: center;
        color: v-bind('user?.colorText || "#333"');
        background-color: v-bind('user?.colorBg || "transparent"');
        padding: 1rem 2rem;
        border-radius: 8px;
    }
}
</style>