<template>
  <div>
    <!-- Hero -->
    <section class="text-center py-12 mb-8">
      <h1 class="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
        {{ t('siteName') }}
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">汇集米哈游及热门游戏官方链接</p>
      <div class="flex justify-center gap-4 flex-wrap">
        <router-link to="/games/mihoyo" class="px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary-dark transition">
          探索米哈游
        </router-link>
        <router-link to="/games/other" class="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-primary hover:text-primary transition">
          浏览全部
        </router-link>
      </div>
    </section>

    <!-- Categories -->
    <section v-for="cat in categories" :key="cat.slug" class="mb-10">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-bold">{{ cat.name }}</h2>
        <router-link :to="`/games/${cat.slug}`" class="text-primary hover:underline text-sm">查看全部 →</router-link>
      </div>
      <div v-if="gamesByCategory[cat.name]?.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <GameCard v-for="game in gamesByCategory[cat.name].slice(0, 4)" :key="game.id" :game="game" />
      </div>
      <p v-else class="text-gray-500">暂无游戏</p>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import GameCard from '@/components/GameCard.vue'
import { useI18nStore } from '@/stores/i18n'
import api from '@/api'

const i18nStore = useI18nStore()
const t = (key) => i18nStore.t(key)

const games = ref([])
const categories = ref([
  { slug: 'mihoyo', name: '米哈游' },
  { slug: 'other', name: '其他游戏' }
])

const gamesByCategory = computed(() => {
  const map = {}
  games.value.forEach((g) => {
    if (!map[g.category]) map[g.category] = []
    map[g.category].push(g)
  })
  return map
})

onMounted(async () => {
  try {
    const res = await api.get('/games')
    games.value = res.data
  } catch (err) {
    console.error('加载游戏失败', err)
  }
})
</script>
