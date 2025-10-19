<template>
    <div class="page">
        <div class="main">
            <div class="content">
                <div class="wrapper">
                    <div class="description-form" v-for="(personality, index) in personalities" :key="index" @click="start_chatting(personality)">
                        <img class="avatar" :src="'data:image/jpes;base64,' + personality.image" alt="personality.name">
                        <div class="description-title">
                            <p>{{ personality.name }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Navigation from '@/components/Navigation.vue';
import { useRouter } from 'vue-router';

const props = defineProps({
    personalities: Array,
});

console.log("props: ", props.personalities);

const router = useRouter();

const start_chatting = (personality) => {
    router.push({ path: `/Chat/${personality.name}` });
}

</script>

<style scoped>
.page {
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    height: 100vh;
    min-width: 800px;
}

.title {
    display: flex;
    justify-content: center;
    font-size: 5rem;
}

.title h1 {
    padding: 0;
    margin: 5rem 0 0 0;
}

.main {
    display: flex;
    justify-content: center;
    flex-direction: column;
    background-repeat: no-repeat;
    background-position: center;
    height: 100%;
}

.content {
    display: flex;
    justify-content: center;
    align-items: center;
}

.wrapper {
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    color: black;
    font-family: Arial, sans-serif;
    margin: 100px 0 100px 0;
}

.description-form {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 300px;
    margin: 2em;
    box-shadow: 0px 10px 20px 1px rgba(0, 0, 0, 0.15);
    padding-top: 20px;
    border-radius: 20%;
    background-color: #ffffff;
}

.description-form:hover {
    cursor: pointer;
    transform: scale(1.05);
    transition: transform 0.5s;
}

.avatar {
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: 50%;
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

.description-title>p {
    padding: 10px 20px;
    border-bottom: 1px solid rgb(177, 177, 177);
}

.description-form input {
    margin-bottom: 20px;
    padding: 10px;
    font-size: 16px;
}

</style>