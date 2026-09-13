<template>
  <div class="max-w-md mx-auto mt-12">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
      <div v-if="status === 'loading'" class="py-8">
        <p class="text-gray-500">正在验证邮箱...</p>
      </div>
      <div v-else-if="status === 'success'" class="py-8">
        <div class="text-6xl mb-4">✅</div>
        <h1 class="text-2xl font-bold mb-2">邮箱验证成功</h1>
        <p class="text-gray-500 mb-6">您的邮箱已成功验证，现在可以登录了。</p>
        <router-link to="/login" class="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition">
          去登录
        </router-link>
      </div>
      <div v-else class="py-8">
        <div class="text-6xl mb-4">❌</div>
        <h1 class="text-2xl font-bold mb-2">验证失败</h1>
        <p class="text-gray-500 mb-6">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const userStore = useUserStore()
const status = ref('loading')
const error = ref('')

onMounted(async () => {
  try {
    await userStore.verifyEmail(route.query.token)
    status.value = 'success'
  } catch (err) {
    status.value = 'error'
    error.value = err.response?.data?.error || '验证链接无效或已过期'
  }
})
</script>
