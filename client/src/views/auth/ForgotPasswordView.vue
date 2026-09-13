<template>
  <div class="max-w-md mx-auto mt-12">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
      <h1 class="text-2xl font-bold text-center mb-6">忘记密码</h1>
      <p class="text-sm text-gray-500 text-center mb-6">输入注册邮箱，我们将发送密码重置链接</p>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">{{ t('email') }}</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-2 rounded-lg bg-primary text-white hover:bg-primary-dark disabled:opacity-50 transition"
        >
          {{ loading ? '发送中...' : '发送重置链接' }}
        </button>
      </form>

      <p v-if="sent" class="mt-4 text-center text-sm text-green-600">
        如果该邮箱已注册，密码重置链接已发送至您的邮箱。
      </p>

      <p class="mt-6 text-center text-sm">
        <router-link to="/login" class="text-primary hover:underline">返回登录</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18nStore } from '@/stores/i18n'
import { useUserStore } from '@/stores/user'

const i18nStore = useI18nStore()
const userStore = useUserStore()
const t = (key) => i18nStore.t(key)

const email = ref('')
const loading = ref(false)
const sent = ref(false)

async function handleSubmit() {
  loading.value = true
  try {
    await userStore.forgotPassword(email.value)
    sent.value = true
  } catch (err) {
    alert(err.response?.data?.error || '发送失败')
  } finally {
    loading.value = false
  }
}
</script>
