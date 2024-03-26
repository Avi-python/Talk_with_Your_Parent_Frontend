<template>
    <div>
        <div>{{ radio1 }}</div>
        <button @click="func1">
        call api !
        </button>
        <button @click="logout">
        logout
        </button>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore, mapState, mapMutations } from 'vuex';
import useAxios from '../utils/useAxios';
import axios from 'axios';

const api = useAxios();

const func1 = async () => {
    api.get('http://localhost:8000/app/function1/', { 
    // 因為 api 是一個 axios instance 並且帶有 intercepter 攔載器（access token），所以這個請求會含有 access token
        params: {
            par1: 'par1',
        }
    })
    .then(res => {
        console.log(res.data['msg']);
    })
    .catch(err => {
        console.log(err);
    })
}

const logout = async () => {
    axios({
    method: 'post',
    url: 'http://localhost:8000/authentication/logout/',
    data: {
      refresh: localStorage.getItem('authTokenRefresh'),
      // access: localStorage.getItem('authTokenAccess')
    },
  })
}
// func1(); 

const store = useStore();

const route = useRoute();
const router = useRouter();

const radio1 = ref("1");

const list1 = [1, 2, 3, 4]

</script>

<style lang="scss" scoped></style>