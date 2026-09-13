<template>
  <div class="max-w-md mx-auto mt-12">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
      <h1 class="text-2xl font-bold text-center mb-6">{{ t('register') }}</h1>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">{{ t('username') }}</label>
          <input
            v-model="username"
            required
            minlength="3"
            maxlength="20"
            class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">{{ t('email') }}</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
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
          {{ loading ? '注册中...' : t('register') }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-gray-500">
        {{ t('haveAccount') }}
        <router-link to="/login" class="text-primary hover:underline">{{ t('login') }}</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18nStore } from '@/stores/i18n'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const i18nStore = useI18nStore()
const userStore = useUserStore()
const t = (key) => i18nStore.t(key)

const username = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)

async function handleRegister() {
  loading.value = true
  try {
    await userStore.register(username.value, email.value, password.value)
    alert('注册成功！请查收邮箱验证邮件。')
    router.push('/login')
  } catch (err) {
    alert(err.response?.data?.error || '注册失败')
  } finally {
    loading.value = false
  }
}
</script>
