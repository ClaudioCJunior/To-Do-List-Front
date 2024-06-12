import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import middleware from '../middlewares/authMiddleware'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...routes
  ]
})

router.beforeEach(middleware);

export default router
