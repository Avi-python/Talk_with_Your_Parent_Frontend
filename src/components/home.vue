<template>
    <div class="page">
        <div class="title">
            <h1>死而</h1>
            <h1 class="color3">復聲</h1>
        </div>
        <div class="main">
            <div class="content">
                <div class="wrapper">
                    <div class="description-form">
                        <div class="description-title">
                            <p>什麼是死而復聲?</p>
                        </div>
                        <div class="description-content">
                            我們是一個網站，幫助你重現已經過世的朋友、家人，可以和他們再次說說話。結合了 STT、Chatgpt、VITS 三項 AI 技術重現一個人的說話方式。這邊會使用<b>柯文哲</b>作為範例向你展示，請按下右下角按鈕開始對話！
                        </div>
                    </div>
                </div>
            </div>
            <div class="start-button">
                <button class="color3_back" @click="start_chatting">開始聊天</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import Navigation from '@/components/Navigation.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const start_chatting = () => {
    router.push({ path: `/Chat` });
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
    background-image: url('@/assets/background.png');
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
    flex-direction: column;
    align-items: flex-start;
    color: black;
    font-family: Arial, sans-serif;
    margin: 100px 0 100px 0;
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

.description-form {
    display: flex;
    flex-direction: column;
    width: 300px;
    box-shadow: 0px 10px 20px 1px rgba(0, 0, 0, 0.15);
    padding: 40px;
    border-radius: 10px;
    background-color: #ffffff;
}

.description-form input {
    margin-bottom: 20px;
    padding: 10px;
    font-size: 16px;
}

.start-button {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0vh 10vw;
    height: 20vh;
}

.start-button button {
    width: 25rem;
    height: 10rem;
    padding: 10px;
    font-size: 5rem;
    font-weight: bold;
    border-radius: 20px;
    color: white;
    border: none;
    cursor: pointer;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    /* 添加阴影 */
    transition: 0.2s;
}

.start-button button:hover {
    background-color: #000000;
}
</style>