<template>
  <div v-if="game" class="max-w-4xl mx-auto">
    <!-- Game Info -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
      <div class="aspect-video bg-gray-100 dark:bg-gray-700">
        <img :src="game.image" :alt="game.name" class="w-full h-full object-cover" />
      </div>
      <div class="p-6">
        <h1 class="text-3xl font-bold mb-2">{{ game.name }}</h1>
        <p v-if="game.name_en" class="text-gray-500 dark:text-gray-400 mb-3">{{ game.name_en }}</p>
        <span class="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary">{{ game.category }}</span>
        <p class="mt-4 text-gray-600 dark:text-gray-300">{{ game.description }}</p>
        <div class="flex flex-wrap gap-2 mt-4">
          <span v-for="tag in game.tags" :key="tag" class="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-700">
            {{ tag }}
          </span>
        </div>
        <a
          :href="game.link"
          target="_blank"
          class="inline-block mt-6 px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition"
        >
          进入官网 →
        </a>
      </div>
    </div>

    <!-- Comments -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h2 class="text-xl font-bold mb-4">{{ t('comments') }}</h2>

      <!-- Comment form -->
      <div v-if="userStore.isLoggedIn" class="mb-6">
        <textarea
          v-model="newComment.content"
          rows="3"
          placeholder="写下你的评论..."
          class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
        <div class="flex items-center justify-between mt-2">
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">{{ t('rating') }}:</span>
            <input
              v-model.number="newComment.rating"
              type="number"
              min="1"
              max="10"
              class="w-16 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
            />
            <span class="text-sm text-gray-500">/10</span>
          </div>
          <button
            @click="submitComment"
            :disabled="submitting"
            class="px-4 py-1.5 rounded-lg bg-primary text-white hover:bg-primary-dark disabled:opacity-50 transition"
          >
            {{ t('submitComment') }}
          </button>
        </div>
      </div>
      <div v-else class="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 text-center">
        <router-link to="/login" class="text-primary hover:underline">登录后发表评论</router-link>
      </div>

      <!-- Comment list -->
      <div v-if="comments.length" class="space-y-4">
        <div v-for="c in comments" :key="c.id" class="border-b border-gray-100 dark:border-gray-700 pb-4">
          <div class="flex items-center justify-between mb-1">
            <span class="font-medium">{{ c.username }}</span>
            <span v-if="c.rating" class="text-sm text-primary">{{ c.rating }}/10</span>
          </div>
          <p class="text-gray-600 dark:text-gray-300">{{ c.content }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ c.created_at }}</p>
        </div>
      </div>
      <p v-else class="text-gray-500 text-center py-4">暂无评论，来抢沙发吧~</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18nStore } from '@/stores/i18n'
import { useUserStore } from '@/stores/user'
import api from '@/api'

const route = useRoute()
const i18nStore = useI18nStore()
const userStore = useUserStore()
const t = (key) => i18nStore.t(key)

const game = ref(null)
const comments = ref([])
const submitting = ref(false)
const newComment = reactive({ content: '', rating: 8 })

onMounted(async () => {
  const gameId = route.params.id
  const [gameRes, commentsRes] = await Promise.all([
    api.get(`/games/${gameId}`),
    api.get(`/games/${gameId}/comments`)
  ])
  game.value = gameRes.data
  comments.value = commentsRes.data
})

async function submitComment() {
  if (!newComment.content.trim()) return
  submitting.value = true
  try {
    await api.post(`/games/${route.params.id}/comments`, {
      content: newComment.content,
      rating: newComment.rating
    })
    newComment.content = ''
    const res = await api.get(`/games/${route.params.id}/comments`)
    comments.value = res.data
  } catch (err) {
    alert(err.response?.data?.error || '评论失败')
  } finally {
    submitting.value = false
  }
}
</script>
