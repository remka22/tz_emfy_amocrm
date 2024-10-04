import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from "@/stores/user-store";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/loginView.vue')
    },
    {
      path: '/leads',
      name: 'leads',
      component: () => import('../views/LeadsView.vue')
    }
  ]
})

router.beforeEach(async (to) => {
  // console.log(to.path);
  const user = useAuthStore();
  const token = localStorage.getItem('ACCESS_TOKEN');
  if (token) {
    user.userInfo.token = token
    await user.user()
  }
  if (user.isLogined) {
    if (to.path === '/login') {
      return { name: "leads" }
    }
    return
  }
  else {
    if (to.path === '/login') {
      return 
    }
    return { name: "login" }
  }
})

export default router
