<template>
  <div>
    <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
      <h1 class="text-2xl font-bold">
        {{ isSearch ? `搜索: ${route.query.q}` : categoryName }}
      </h1>
      <!-- Tags filter -->
      <div class="flex flex-wrap gap-2">
        <button
          @click="selectedTag = ''"
          :class="['px-3 py-1 rounded-full text-sm transition', !selectedTag ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700']"
        >
          全部
        </button>
        <button
          v-for="tag in allTags"
          :key="tag"
          @click="selectedTag = tag"
          :class="['px-3 py-1 rounded-full text-sm transition', selectedTag === tag ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700']"
        >
          {{ tag }}
        </button>
      </div>
    </div>

    <div v-if="filteredGames.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <GameCard v-for="game in filteredGames" :key="game.id" :game="game" />
    </div>
    <div v-else class="text-center py-16 text-gray-500">
      暂无游戏数据
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import GameCard from '@/components/GameCard.vue'
import api from '@/api'

const route = useRoute()

// slug -> 中文分类名 映射
const categoryMap = {
  mihoyo: '米哈游',
  other: '其他游戏'
}

const categorySlug = computed(() => route.params.category)
const isSearch = computed(() => categorySlug.value === 'search')
const categoryName = computed(() => categoryMap[categorySlug.value] || categorySlug.value)

const games = ref([])
const selectedTag = ref('')
const allTags = ref([])

const filteredGames = computed(() => {
  let list = games.value
  if (selectedTag.value) {
    list = list.filter((g) => g.tags?.includes(selectedTag.value))
  }
  return list
})

async function loadGames() {
  try {
    const params = {}
    if (isSearch.value) {
      params.search = route.query.q
    } else if (categoryMap[categorySlug.value]) {
      params.category = categoryMap[categorySlug.value]
    }
    const res = await api.get('/games', { params })
    games.value = res.data
    const tagSet = new Set()
    games.value.forEach((g) => g.tags?.forEach((t) => tagSet.add(t)))
    allTags.value = [...tagSet]
  } catch (err) {
    console.error('加载游戏失败', err)
  }
}

onMounted(loadGames)
watch(() => route.params.category, loadGames)
watch(() => route.query.q, loadGames)
</script>
