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

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

import type { Post } from '@/types/Post'

const route = useRoute()
const pageParam = route.params.page
const page = ref<number>(Number(pageParam) || 1)

const posts = ref<Post[]>([])
const loading = ref(true)

const fetchPosts = async () => {
  loading.value = true
  const start = (page.value - 1) * 10
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=10`)
  posts.value = await res.json()
  loading.value = false
}

watch(
  () => route.params.page,
  (newPage) => {
    page.value = Number(newPage) || 1
    fetchPosts()
  },
)

onMounted(fetchPosts)
</script>
