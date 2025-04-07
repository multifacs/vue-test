<template>
  <div class="p-4">
    <RouterLink to="/" class="text-blue-500 hover:underline mb-4 inline-block"
      >← Back to posts</RouterLink
    >

    <div v-if="loading" class="text-gray-500">Loading...</div>
    <div v-else-if="post" class="bg-white p-6 rounded-lg shadow">
      <h1 class="text-2xl font-bold mb-2">{{ post.title }}</h1>
      <p>{{ post.body }}</p>
    </div>
    <div v-else class="text-red-500">Post not found.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id
const post = ref(null)
const loading = ref(true)

const fetchPost = async () => {
  loading.value = true
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
  if (res.ok) {
    post.value = await res.json()
  } else {
    post.value = null
  }
  loading.value = false
}

onMounted(fetchPost)
</script>
