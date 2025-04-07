<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'

import type { Post } from '@/types/Post'
import { parsePageParam } from '@/utils/page'

import { usePostsStore } from '@/stores/posts'

const route = useRoute()
const page = ref<number>(parsePageParam(route.params.page)) // Page param

const store = usePostsStore() // Store
const posts = ref<Post[]>([]) // Posts data
const loading = ref(true) // Local loading state

const loadPosts = async () => {
  loading.value = true
  posts.value = await store.fetchPosts(page.value) // Load from store
  loading.value = false
}

// Truncate post text and end it with ...
const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}

// Computed property to get and set the search term in the store
const localSearchTerm = computed({
  get: () => store.searchTerm, // Get the search term from the store
  set: (value: string) => {
    store.setSearchTerm(value) // Set the search term in the store
    loadPosts()
  },
})

// Watch the page param change
watch(
  () => route.params.page,
  (newPage) => {
    page.value = Number(newPage) || 1
    loadPosts()
  },
)

onMounted(() => {
  loadPosts() // Fetch on mounted
})
</script>

<template>
  <div class="p-4">
    <!-- Search field -->
    <input
      v-model="localSearchTerm"
      type="text"
      class="mb-4 p-2 border rounded-lg"
      placeholder="Search for posts..."
    />
    <h1 class="text-2xl font-bold mb-4">Posts - Page {{ page }}</h1>
    <div v-if="loading" class="text-gray-500">Loading...</div>
    <div v-else>
      <RouterLink :to="`/post/${post.id}`" v-for="post in posts" :key="post.id">
        <div class="mb-2 p-4 border rounded-lg bg-white shadow-sm hover:bg-gray-50 transition">
          <h2 class="font-semibold">{{ post.title }}</h2>
          <p class="text-sm text-gray-600">{{ truncateText(post.body, 100) }}</p>
        </div>
      </RouterLink>
      <h2 v-if="!posts.length" class="font-semibold">Mo more posts :(</h2>

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
          v-if="posts.length == 10"
        >
          Next
        </RouterLink>
      </div>
    </div>
  </div>
</template>
