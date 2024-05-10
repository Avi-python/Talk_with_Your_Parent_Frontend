import { createRouter, createWebHistory } from 'vue-router'
import Chat from '../views/Chat.vue'
import axios from 'axios'
import store from '../store' // 這樣導入 vuex

const routes = [
  {
    path: '/',
    redirect: '/Login',
  },
  {
    path: '/Home',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/Login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue') 
  },
  {
    path: '/Chat',
    // path: '/Chat/:username',
    name: 'Chat',
    // props: true,
    component: () => import('../views/Chat.vue'),
    // meta: {
    //     index: 2
    // }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

let isNavigating = false; // 新增這個可以避免浮現 navigate

// 在每次切換頁面的時候，我們都會刷新 token
// 因為當使用者登入之後再關掉網頁，下次開頁面的時候肯定已經失效了，所以要先用 refresh token 去向後端要求新的一組 token
router.beforeEach((to, from, next) => {

  console.log(to.path, '|', from.path, '| isNavigating:', isNavigating);

  if (isNavigating) {
    next();
  } else { // 要用 else，好像不能使用 return
    // refresh
    axios({
      method: 'post',
      url: 'http://localhost:8000/authentication/token/refresh/',
      data: {
        refresh: localStorage.getItem('authTokenRefresh'),
        // access: localStorage.getItem('authTokenAccess')
      },
    })
      .then(res => {
        if (res.status == 200) {
          // restore new token to cookie ###
          store.commit('setToken', res.data);
          axios({
            method: 'post',
            url: 'http://localhost:8000/authentication/token/verify/',
            data: {
              token: localStorage.getItem('authTokenAccess')
            },
          })
            .then(res => {
              // if toke{n valid #############
              if (res.status == 200) {
                isNavigating = true;

                if(to.path == '/Chat') {
                  
                }
                
                return next({ path: to.path });
              }
              else {
                // if token is not valid ####
                isNavigating = true;
                return next({ path: '/login' });
              }
            })
            .catch(err => {
              // if token is not valid ######
              isNavigating = true;
              return next({ path: '/login' });
            })
        }
        else {
          isNavigating = true;
          return next({ path: '/login' });
        }
      })
      .catch(err => {
        // if token is not valid ######
        isNavigating = true;
        return next({ path: '/login' });
      })
  }
})

router.afterEach(() => {
  isNavigating = false; // 跳转结束后重置标记
});

export default router;
