<template>
    <mainLayout />
    <chat v-if="isLoaded" :username="username" :personality_name="personality_name" />
    <Navigation v-if="isLoaded" />
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
import { useRoute } from 'vue-router';
import Navigation from '@/components/Navigation.vue';

const route = useRoute();
const intercepter = useAxios();
const isLoaded = ref(false);
const username = ref('');
const personality_name = ref(route.params.personality_name);

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

const load_model = async () => {
    try
    {
        const res = await intercepter.post('http://localhost:8000/app/load-model/', 
        {
            personality_name: personality_name.value
        });
    }
    catch (err)
    {
        console.log(err);
    }
}

onMounted(async () => {
    isLoaded.value = false;
    await load_model();
    username.value = await fetchUser();
    // await new Promise(resolve => setTimeout(resolve, 2000));
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