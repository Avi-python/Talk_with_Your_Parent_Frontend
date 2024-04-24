<template>
    <mainLayout />
    <chat v-if="isLoaded" :username="username" />
    <div v-if="!isLoaded" class="container">
        <bounce-loader :color="color" :size="size"></bounce-loader>
    </div>
</template>

<script setup>
import chat from '../components/chat.vue';
import mainLayout from '../components/mainLayout.vue';
import { ref, onMounted } from 'vue';
import useAxios from '@/utils/useAxios';
import BounceLoader from 'vue-spinner/src/BounceLoader.vue';

const intercepter = useAxios();
const isLoaded = ref(false);
const username = ref('');

const color = ref('#000000');
const size = ref("10vh");

const fetchUser = async () => {
    const res = await intercepter.get('http://localhost:8000/authentication/user/')
    .then(res => {
        return JSON.parse(res.data[0]).username;
    })
    .catch(err => {
        console.log(err);
    })

    return res;
};

onMounted(async () => {
    isLoaded.value = false;
    username.value = await fetchUser();
    await new Promise(resolve => setTimeout(resolve, 2000));
    isLoaded.value = true;
});


</script>

<style scope>

.container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: white;
        color: black;
        font-family: Arial, sans-serif;
    }

</style>