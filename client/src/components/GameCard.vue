<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition group">
    <div class="relative aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden">
      <router-link :to="`/game/${game.id}`" class="block w-full h-full">
        <img
          :src="game.image"
          :alt="game.name"
          class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          @error="handleImageError"
        />
      </router-link>
      <div class="absolute top-2 left-2">
        <span class="px-2 py-0.5 text-xs rounded-full bg-black/50 text-white">{{ game.category }}</span>
      </div>
      <button
        v-if="userStore.isLoggedIn"
        @click.stop="toggleFavorite"
        class="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 dark:bg-gray-800/80 flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 transition"
      >
        {{ isFavorite ? '❤️' : '🤍' }}
      </button>
    </div>
    <div class="p-4">
      <router-link :to="`/game/${game.id}`" class="block">
        <h3 class="font-semibold text-lg mb-1 hover:text-primary transition">{{ game.name }}</h3>
      </router-link>
      <p v-if="game.name_en && game.name_en !== game.name" class="text-sm text-gray-500 dark:text-gray-400 mb-2">
        {{ game.name_en }}
      </p>
      <router-link :to="`/game/${game.id}`" class="block">
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{{ game.description }}</p>
      </router-link>
      <div class="flex flex-wrap gap-1 mb-3">
        <span
          v-for="tag in game.tags"
          :key="tag"
          class="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary"
        >
          {{ tag }}
        </span>
      </div>
      <div class="flex gap-2">
        <router-link
          :to="`/game/${game.id}`"
          class="flex-1 text-center py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm hover:border-primary hover:text-primary transition"
        >
          详情
        </router-link>
        <a
          :href="game.link"
          target="_blank"
          class="flex-1 text-center py-2 rounded-lg bg-primary text-white text-sm hover:bg-primary-dark transition"
        >
          官网
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import api from '@/api'

const props = defineProps({
  game: { type: Object, required: true }
})

const userStore = useUserStore()
const isFavorite = ref(false)

// 初始化收藏状态
api.get(`/user/favorites`).then((res) => {
  isFavorite.value = res.data.some((g) => g.id === props.game.id)
}).catch(() => {})

async function toggleFavorite() {
  try {
    if (isFavorite.value) {
      await api.delete(`/user/favorites/${props.game.id}`)
      isFavorite.value = false
    } else {
      await api.post(`/user/favorites/${props.game.id}`)
      isFavorite.value = true
    }
  } catch (err) {
    alert(err.response?.data?.error || '操作失败')
  }
}

function handleImageError(e) {
  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect fill="%23e5e7eb" width="100%" height="100%"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="16">No Image</text></svg>'
}
</script>
