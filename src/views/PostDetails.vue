<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { usePostsStore } from '@/stores/posts'

const route = useRoute()
const store = usePostsStore()

const postId = Number(route.params.id)

const loading = ref(true) // Local loading state
const post = ref<Post | null>(null) // Post data
const comments = ref<Comment[]>([]) // Comments data

// Fetch the post and its comments using the store
const loadPostAndComments = async () => {
  loading.value = true // Set loading to true
  post.value = await store.fetchPost(postId) // Fetch post
  if (post.value) {
    comments.value = await store.fetchComments(postId) // Fetch comments for the post
  }
  loading.value = false // Done loading
}

onMounted(() => {
  loadPostAndComments() // Fetch post and comments when the component is mounted
})
</script>

<template>
  <div class="p-4">
    <RouterLink to="/" class="text-blue-500 hover:underline mb-4 inline-block"
      >← Back to posts</RouterLink
    >

    <!-- Show loading state while fetching the post and comments -->
    <div v-if="loading" class="text-gray-500">Loading...</div>

    <!-- Display the post once it's available -->
    <div v-else-if="post" class="bg-white p-6 rounded-lg shadow">
      <h1 class="text-2xl font-bold mb-2">{{ post.title }}</h1>
      <p>{{ post.body }}</p>
    </div>

    <!-- Handle case where no post is found -->
    <div v-else class="text-red-500">Post not found.</div>

    <!-- Display comments once they are loaded -->
    <div v-if="comments.length > 0" class="mt-6">
      <h2 class="text-xl font-semibold mb-4">Comments:</h2>
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="bg-gray-100 p-4 rounded-lg mb-4 shadow-sm"
      >
        <h3 class="font-bold text-lg">{{ comment.name }}</h3>
        <p class="text-sm text-gray-600">{{ comment.email }}</p>
        <p class="mt-2">{{ comment.body }}</p>
      </div>
    </div>

    <!-- Handle case where no comments are found -->
    <div v-else class="mt-6 text-gray-500">No comments available for this post.</div>
  </div>
</template>
