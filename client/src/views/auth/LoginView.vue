<template>
  <div class="max-w-md mx-auto mt-12">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
      <h1 class="text-2xl font-bold text-center mb-6">{{ t('login') }}</h1>

      <form @submit.prevent="handleLogin" class="space-y-4">
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
        </div>
        <div class="flex items-center justify-between text-sm">
          <label class="flex items-center">
            <input v-model="remember" type="checkbox" class="mr-2" />
            {{ t('rememberMe') }}
          </label>
          <router-link to="/forgot-password" class="text-primary hover:underline">
            {{ t('forgotPassword') }}
          </router-link>
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-2 rounded-lg bg-primary text-white hover:bg-primary-dark disabled:opacity-50 transition"
        >
          {{ loading ? '登录中...' : t('login') }}
        </button>
      </form>

      <div class="my-4 flex items-center">
        <div class="flex-1 border-t border-gray-200 dark:border-gray-600"></div>
        <span class="px-3 text-sm text-gray-400">或</span>
        <div class="flex-1 border-t border-gray-200 dark:border-gray-600"></div>
      </div>

      <div class="space-y-2">
        <a
          href="/api/auth/oauth/github"
          class="flex items-center justify-center w-full py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          <span class="mr-2">🐙</span> {{ t('loginWithGithub') }}
        </a>
        <a
          href="/api/auth/oauth/google"
          class="flex items-center justify-center w-full py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          <span class="mr-2">🔵</span> {{ t('loginWithGoogle') }}
        </a>
      </div>

      <p class="mt-6 text-center text-sm text-gray-500">
        {{ t('noAccount') }}
        <router-link to="/register" class="text-primary hover:underline">{{ t('register') }}</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18nStore } from '@/stores/i18n'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const i18nStore = useI18nStore()
const userStore = useUserStore()
const t = (key) => i18nStore.t(key)

const email = ref('')
const password = ref('')
const remember = ref(false)
const loading = ref(false)

async function handleLogin() {
  loading.value = true
  try {
    await userStore.login(email.value, password.value, remember.value)
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } catch (err) {
    alert(err.response?.data?.error || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>
