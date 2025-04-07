import { createRouter, createWebHistory } from 'vue-router'
import PostsPage from '@/views/PostsPage.vue'
import PostDetails from '@/views/PostDetails.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/', // Main page redirects to the 1st posts page
      redirect: '/1',
    },
    {
      path: '/:page', // Dynamic param
      name: 'PostsPage',
      component: PostsPage,
      props: true,
    },
    {
      path: '/post/:id', // Dynamic param
      name: 'PostDetails',
      component: PostDetails,
      props: true,
    },
  ],
})

export default router
