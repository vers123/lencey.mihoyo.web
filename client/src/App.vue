<template>
  <div :class="['min-h-screen', themeStore.dark ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900']">
    <AppHeader />
    <main class="container mx-auto px-4 py-6">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'

const themeStore = useThemeStore()
const userStore = useUserStore()

onMounted(() => {
  themeStore.init()
  userStore.init()
})
</script>
