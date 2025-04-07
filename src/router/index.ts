import { createRouter, createWebHistory } from 'vue-router'
import PostsPage from '@/views/PostsPage.vue'
import PostDetails from '@/views/PostDetails.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/1',
    },
    {
      path: '/:page',
      name: 'PostsPage',
      component: PostsPage,
      props: true,
    },
    {
      path: '/post/:id',
      name: 'PostDetails',
      component: PostDetails,
      props: true,
    },
  ],
})

export default router
