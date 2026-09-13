<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">{{ t('admin') }}</h1>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 text-center">
        <p class="text-3xl font-bold text-primary">{{ stats.userCount }}</p>
        <p class="text-sm text-gray-500">用户数</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 text-center">
        <p class="text-3xl font-bold text-primary">{{ stats.gameCount }}</p>
        <p class="text-sm text-gray-500">游戏数</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 text-center">
        <p class="text-3xl font-bold text-primary">{{ stats.commentCount }}</p>
        <p class="text-sm text-gray-500">评论数</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 text-center">
        <p class="text-3xl font-bold text-primary">{{ stats.pendingComments }}</p>
        <p class="text-sm text-gray-500">待审核</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex space-x-2 mb-4 border-b border-gray-200 dark:border-gray-700">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="activeTab = tab"
        :class="['px-4 py-2 -mb-px border-b-2 transition', activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-500']"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Users -->
    <div v-if="activeTab === '用户管理'" class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-4 py-3 text-left">用户名</th>
            <th class="px-4 py-3 text-left">邮箱</th>
            <th class="px-4 py-3 text-left">管理员</th>
            <th class="px-4 py-3 text-left">已验证</th>
            <th class="px-4 py-3 text-left">注册时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.id" class="border-t border-gray-100 dark:border-gray-700">
            <td class="px-4 py-3">{{ u.username }}</td>
            <td class="px-4 py-3 text-gray-500">{{ u.email }}</td>
            <td class="px-4 py-3">
              <button
                @click="toggleAdmin(u)"
                :class="['px-2 py-1 rounded text-xs', u.is_admin ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-600']"
              >
                {{ u.is_admin ? '是' : '否' }}
              </button>
            </td>
            <td class="px-4 py-3">{{ u.is_verified ? '✅' : '❌' }}</td>
            <td class="px-4 py-3 text-gray-500">{{ u.created_at }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Games -->
    <div v-if="activeTab === '游戏管理'" class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
      <button @click="showGameForm = true" class="mb-4 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark text-sm">
        + 添加游戏
      </button>
      <div v-if="showGameForm" class="mb-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg space-y-3">
        <input v-model="gameForm.name" placeholder="名称" class="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700" />
        <input v-model="gameForm.name_en" placeholder="英文名" class="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700" />
        <input v-model="gameForm.category" placeholder="分类" class="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700" />
        <input v-model="gameForm.link" placeholder="链接" class="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700" />
        <input v-model="gameForm.description" placeholder="描述" class="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700" />
        <input v-model="gameForm.tagsStr" placeholder="标签（逗号分隔）" class="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700" />
        <div class="flex space-x-2">
          <button @click="addGame" class="px-4 py-2 rounded bg-primary text-white text-sm">保存</button>
          <button @click="showGameForm = false" class="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600 text-sm">取消</button>
        </div>
      </div>
      <table class="w-full text-sm">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-4 py-3 text-left">名称</th>
            <th class="px-4 py-3 text-left">分类</th>
            <th class="px-4 py-3 text-left">链接</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="g in games" :key="g.id" class="border-t border-gray-100 dark:border-gray-700">
            <td class="px-4 py-3">{{ g.name }}</td>
            <td class="px-4 py-3 text-gray-500">{{ g.category }}</td>
            <td class="px-4 py-3 text-primary truncate max-w-xs">{{ g.link }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useI18nStore } from '@/stores/i18n'
import api from '@/api'

const i18nStore = useI18nStore()
const t = (key) => i18nStore.t(key)

const tabs = ['用户管理', '游戏管理']
const activeTab = ref('用户管理')
const stats = ref({ userCount: 0, gameCount: 0, commentCount: 0, pendingComments: 0 })
const users = ref([])
const games = ref([])

const showGameForm = ref(false)
const gameForm = reactive({ name: '', name_en: '', category: '', link: '', description: '', tagsStr: '' })

onMounted(async () => {
  const [statsRes, usersRes, gamesRes] = await Promise.all([
    api.get('/admin/stats'),
    api.get('/admin/users'),
    api.get('/games')
  ])
  stats.value = statsRes.data
  users.value = usersRes.data
  games.value = gamesRes.data
})

async function toggleAdmin(u) {
  await api.put(`/admin/users/${u.id}`, { isAdmin: !u.is_admin })
  u.is_admin = !u.is_admin
}

async function addGame() {
  try {
    await api.post('/games', {
      name: gameForm.name,
      nameEn: gameForm.name_en,
      category: gameForm.category,
      link: gameForm.link,
      description: gameForm.description,
      tags: gameForm.tagsStr.split(',').map(t => t.trim()).filter(Boolean)
    })
    alert('添加成功')
    showGameForm.value = false
    Object.assign(gameForm, { name: '', name_en: '', category: '', link: '', description: '', tagsStr: '' })
    const res = await api.get('/games')
    games.value = res.data
  } catch (err) {
    alert(err.response?.data?.error || '添加失败')
  }
}
</script>
