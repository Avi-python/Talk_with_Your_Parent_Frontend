<script setup>
// 這邊我們使用巢狀路由來做到每隔一段時間自動刷新 token 的功能，
// 我們做一個 src/components/mainLayout.vue 當作父頁面，在父頁面這邊做到刷新 token 的功能，
// 其他需要做到這個功能的頁面，都掛在這個頁面之下當作子頁面。

import { computed, ref } from 'vue'
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// vuex ############################
const store = useStore()
// const user = jwt_decode<{'username':''}>(String(localStorage.getItem('authTokenAccess')))['username'];
const user = jwtDecode<{'username':''}>(String(localStorage.getItem('authTokenAccess')))['username'];

// route ###########################
const router = useRouter()
let now = new Date()
// get username after verify token ######
// refresh token every 4 minutes ########
setInterval(()=>{
  axios({
    method: 'post',
    url:'http://localhost:8000/authentication/token/refresh/',
    data: {      
      refresh:localStorage.getItem('authTokenRefresh')
    },
  })
  .then(res=>{
    store.commit('setToken',res.data)    
  }) 
},1000*60*4); // 要求重新刷新 access token，1000 毫秒 * 60 * 4 = 4分鐘

const logout = () => {
  store.commit('delToken')    
  router.push('/login')
}

</script>