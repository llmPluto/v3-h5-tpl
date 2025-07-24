import { createRouter, createWebHashHistory } from 'vue-router'
import { titleGuard } from './guards/titleGuard'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/poster',
      name: 'poster',
      component: () => import('@/views/poster/index.vue'),
      meta: {
        title: '海报',
      },
    },
  ],
})

// 标题守卫
router.beforeEach(titleGuard)

export default router
