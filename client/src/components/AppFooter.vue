<template>
  <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
    <div class="container mx-auto px-4 py-6">
      <div class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('copyright') }}</p>
        <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <router-link to="/" class="hover:text-primary">{{ t('home') }}</router-link>
          <a href="https://github.com/vers123" target="_blank" class="hover:text-primary">GitHub</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useI18nStore } from '@/stores/i18n'
const i18nStore = useI18nStore()
const t = (key) => i18nStore.t(key)
</script>
