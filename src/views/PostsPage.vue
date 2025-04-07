<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

import type { Post } from '@/types/Post'
import { parsePageParam } from '@/utils/page'

import { usePostsStore } from '@/stores/posts'

const route = useRoute()
const page = ref<number>(parsePageParam(route.params.page))

const store = usePostsStore()
const posts = ref<Post[]>([])
const loading = ref(true)

const loadPosts = async () => {
  loading.value = true
  posts.value = await store.fetchPosts(page.value)
  loading.value = false
}

watch(
  () => route.params.page,
  (newPage) => {
    page.value = Number(newPage) || 1
    loadPosts()
  },
)

onMounted(loadPosts)
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Posts - Page {{ page }}</h1>
    <div v-if="loading" class="text-gray-500">Loading...</div>
    <div v-else>
      <RouterLink :to="`/post/${post.id}`" v-for="post in posts" :key="post.id">
        <div class="mb-2 p-4 border rounded-lg bg-white shadow-sm hover:bg-gray-50 transition">
          <h2 class="font-semibold">{{ post.title }}</h2>
          <p class="text-sm text-gray-600">{{ post.body }}</p>
        </div>
      </RouterLink>

      <div class="mt-6 flex gap-4">
        <RouterLink
          :to="`/${page - 1}`"
          v-if="page > 1"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Previous
        </RouterLink>
        <RouterLink
          :to="`/${page + 1}`"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Next
        </RouterLink>
      </div>
    </div>
  </div>
</template>
