// src/stores/posts.ts
import { defineStore } from 'pinia'
import type { Post } from '@/types/Post'
import type { Comment } from '@/types/Comment'

import Fuse from 'fuse.js'

export const usePostsStore = defineStore('posts', {
  state: () => ({
    postsCache: {} as Record<number, Post[]>,
    searchTerm: '', // The search term
    currentPost: null as Post | null,
    commentsCache: {} as Record<number, Comment[]>, // Cache for comments
  }),

  actions: {
    /**
     * Fetch posts for a specific page
     * Returns a promise that resolves to a list of posts
     */
    // Fetch posts for a specific page
    async fetchPosts(page: number): Promise<Post[]> {
      // If posts are already cached for the page, use them
      if (this.postsCache[page]) return this.postsCache[page]

      if (this.searchTerm) {
        const res = await fetch(`https://jsonplaceholder.typicode.com/posts`)
        const data = await res.json()
        const filteredData = this.filterPosts(data, page)
        this.postsCache[page] = filteredData
        return filteredData
      }
      const start = (page - 1) * 10
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=10`,
      )
      const data = await res.json()
      this.postsCache[page] = data
      return data
    },

    // Use Fuse.js to filter posts for partial matching and return posts for the given page
    filterPosts(posts: Post[], page: number): Post[] {
      if (!this.searchTerm) return posts.slice((page - 1) * 10, page * 10)

      const fuse = new Fuse(posts, {
        keys: ['title', 'body'],
        threshold: 0.3, // Adjust this to control the fuzziness of the match
      })

      // Perform search
      const result = fuse.search(this.searchTerm)

      // Return a set of 10 or less posts corresponding to the given page
      const pagedResults = result.map((r) => r.item).slice((page - 1) * 10, page * 10)

      return pagedResults
    },

    // Set the search term in the store and refetch posts
    setSearchTerm(searchTerm: string) {
      this.searchTerm = searchTerm
      this.postsCache = {}
    },

    /**
     * Fetch a single post by ID
     * Returns a promise that resolves to a single post or null if not found
     */
    async fetchPost(id: number): Promise<Post | null> {
      // Try to find in cached posts
      const allPosts = Object.values(this.postsCache).flat()
      const found = allPosts.find((p) => p.id === id)
      if (found) {
        this.currentPost = found
        return found
      }

      // Fetch from API
      const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
      if (!res.ok) {
        this.currentPost = null
        return null
      }

      const data: Post = await res.json()
      this.currentPost = data
      return data
    },

    /**
     * Fetch comments for a specific post
     * Returns a promise that resolves to a list of comments
     */
    async fetchComments(postId: number): Promise<Comment[]> {
      // Check if comments for the post are cached
      if (this.commentsCache[postId]) return this.commentsCache[postId]

      const res = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
      const data: Comment[] = await res.json()
      this.commentsCache[postId] = data
      return data
    },

    clearCurrentPost() {
      this.currentPost = null
    },
  },
})
