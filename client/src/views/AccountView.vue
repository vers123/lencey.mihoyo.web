<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">{{ t('account') }}</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Profile -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:col-span-1">
        <div class="text-center">
          <div class="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center text-3xl mb-3">
            {{ userStore.user?.username?.[0]?.toUpperCase() || 'U' }}
          </div>
          <h2 class="font-bold text-xl">{{ userStore.user?.username }}</h2>
          <p class="text-sm text-gray-500">{{ userStore.user?.email }}</p>
          <p v-if="userStore.isAdmin" class="mt-2 text-xs text-primary font-medium">管理员</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="md:col-span-2 space-y-6">
        <!-- Favorites -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 class="font-bold text-lg mb-4">{{ t('favorites') }}</h3>
          <div v-if="favorites.length" class="grid grid-cols-2 gap-3">
            <router-link
              v-for="g in favorites"
              :key="g.id"
              :to="`/game/${g.id}`"
              class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <img :src="g.image" class="w-12 h-12 rounded object-cover" />
              <div>
                <p class="font-medium text-sm">{{ g.name }}</p>
                <p class="text-xs text-gray-500">{{ g.category }}</p>
              </div>
            </router-link>
          </div>
          <p v-else class="text-gray-500 text-sm">暂无收藏</p>
        </div>

        <!-- Login history -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 class="font-bold text-lg mb-4">登录历史</h3>
          <div v-if="history.length" class="space-y-2">
            <div v-for="h in history" :key="h.id" class="flex items-center justify-between text-sm py-2 border-b border-gray-100 dark:border-gray-700">
              <div>
                <span :class="h.success ? 'text-green-600' : 'text-red-600'">
                  {{ h.success ? '成功' : '失败' }}
                </span>
                <span class="text-gray-500 ml-2">{{ h.ip }}</span>
              </div>
              <span class="text-gray-400">{{ h.login_at }}</span>
            </div>
          </div>
          <p v-else class="text-gray-500 text-sm">暂无记录</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18nStore } from '@/stores/i18n'
import { useUserStore } from '@/stores/user'
import api from '@/api'

const i18nStore = useI18nStore()
const userStore = useUserStore()
const t = (key) => i18nStore.t(key)

const favorites = ref([])
const history = ref([])

onMounted(async () => {
  try {
    const [favRes, histRes] = await Promise.all([
      api.get('/user/favorites'),
      api.get('/user/login-history')
    ])
    favorites.value = favRes.data
    history.value = histRes.data
  } catch (err) {
    console.error(err)
  }
})
</script>
