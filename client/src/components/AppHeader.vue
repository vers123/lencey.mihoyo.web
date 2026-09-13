<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-2">
          <span class="text-2xl font-bold text-primary">Vers123</span>
        </router-link>

        <!-- Nav -->
        <nav class="hidden md:flex items-center space-x-6">
          <router-link to="/" class="hover:text-primary transition">{{ t('home') }}</router-link>
          <router-link to="/games/mihoyo" class="hover:text-primary transition">{{ t('mihoyo') }}</router-link>
          <router-link to="/games/other" class="hover:text-primary transition">{{ t('otherGames') }}</router-link>
        </nav>

        <!-- Actions -->
        <div class="flex items-center space-x-3">
          <!-- Search -->
          <div class="relative hidden sm:block">
            <input
              v-model="searchQuery"
              @keyup.enter="doSearch"
              :placeholder="t('search')"
              class="w-48 px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <!-- Theme toggle -->
          <button @click="themeStore.toggle" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            {{ themeStore.dark ? '☀️' : '🌙' }}
          </button>

          <!-- Language toggle -->
          <button @click="i18nStore.toggle" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium">
            {{ i18nStore.locale === 'zh' ? 'EN' : '中' }}
          </button>

          <!-- User menu -->
          <template v-if="userStore.isLoggedIn">
            <router-link
              v-if="userStore.isAdmin"
              to="/admin"
              class="px-3 py-1.5 text-sm rounded-lg bg-primary text-white hover:bg-primary-dark transition"
            >
              {{ t('admin') }}
            </router-link>
            <router-link to="/account" class="flex items-center space-x-1 hover:text-primary">
              <span class="text-sm">{{ userStore.user?.username }}</span>
            </router-link>
            <button @click="userStore.logout(); router.push('/')" class="text-sm text-gray-500 hover:text-red-500">
              {{ t('logout') }}
            </button>
          </template>
          <template v-else>
            <router-link to="/login" class="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:border-primary hover:text-primary transition">
              {{ t('login') }}
            </router-link>
            <router-link to="/register" class="px-3 py-1.5 text-sm rounded-lg bg-primary text-white hover:bg-primary-dark transition">
              {{ t('register') }}
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { useI18nStore } from '@/stores/i18n'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const themeStore = useThemeStore()
const i18nStore = useI18nStore()
const userStore = useUserStore()
const searchQuery = ref('')

const t = (key) => i18nStore.t(key)

function doSearch() {
  if (searchQuery.value.trim()) {
    router.push({ name: 'GameList', params: { category: 'search' }, query: { q: searchQuery.value } })
  }
}
</script>
