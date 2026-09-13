<template>
  <div class="max-w-md mx-auto mt-12">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
      <h1 class="text-2xl font-bold text-center mb-6">{{ t('resetPassword') }}</h1>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">{{ t('password') }}</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p class="text-xs text-gray-500 mt-1">至少12位，包含大小写字母、数字和特殊符号</p>
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-2 rounded-lg bg-primary text-white hover:bg-primary-dark disabled:opacity-50 transition"
        >
          {{ loading ? '重置中...' : t('resetPassword') }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18nStore } from '@/stores/i18n'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const i18nStore = useI18nStore()
const userStore = useUserStore()
const t = (key) => i18nStore.t(key)

const password = ref('')
const loading = ref(false)

async function handleSubmit() {
  loading.value = true
  try {
    await userStore.resetPassword(route.query.token, password.value)
    alert('密码重置成功，请重新登录')
    router.push('/login')
  } catch (err) {
    alert(err.response?.data?.error || '重置失败')
  } finally {
    loading.value = false
  }
}
</script>
