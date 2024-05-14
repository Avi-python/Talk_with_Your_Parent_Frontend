<template>
    <mainLayout />
    <chat v-if="isLoaded" :username="username" />
    <div v-if="!isLoaded" class="container">
        <div class="wrapper">
            <div class="description-form">
                <div class="description-title">
                    <p>排隊等待中...</p>
                </div>
                <div class="description-content">
                    <bounce-loader :color="color" :size="size"></bounce-loader>
                </div>
            </div>
        </div>
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

const waitForAccess = async () => {
    while (true) {

        console.log("Waiting for access...");

        const data = await intercepter.get('http://localhost:8000/app/wait_or_access/')
            .then(res => {
                return res.data;
            })
            .catch(err => {
                console.log("waitForAccess Error: ", err.response.data);
                return err.response.data;
            })

        if (!data["wait"]) {
            break;
        }

        await new Promise(resolve => setTimeout(resolve, 5000));
    }
};

onMounted(async () => {
    isLoaded.value = false;
    await waitForAccess();
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
.wrapper {
    color: black;
    font-family: Arial, sans-serif;
}

.description-title {
    /* background-color: black; */
    display: flex;
    align-items: center;
    justify-content: center;
    /* horizontally center */
    box-sizing: border-box;
    font-size: 2em;
}

.description-content {
    display: flex;
    justify-content: center;
    align-items: center;
}

.description-title>p {
    padding: 10px 20px;
    border-bottom: 1px solid rgb(177, 177, 177);
}
</style>