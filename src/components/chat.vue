<template>
    <div class="chat-page">
        <div class="left-panel" :class="{ 'open': !isNotMaxTokens }">

            <button @click="resetTokens" class="color3_back material-icons">restart_alt</button>

            <div class="content">
                <div class="wrapper">
                    <div class="description-form">
                        <div class="description-title">
                            <p>重新啟動!</p>
                        </div>
                        <div class="description-content">
                            {{ resetMessage }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="right-panel">
            <div class="message-box-up">
                <div class="appContent">
                    <!-- <Messages :messages="all_messages" :me="me" :refresh="refresh"/> -->
                    <Messages :messages="all_messages" :me="me" />
                </div>
            </div>
            <div class="message-box-down">
                <div class="input-panel">
                    <!-- <input type="text" 
                    v-model.trim="text" 
                    @keydown.enter.prevent="sendMsg" 
                    placeholder="請輸入" /> -->
                    <Input ref="inputRef" :onSendMessage="onSendMessage" :disabled="loading" />
                    <!-- <p>Message is : {{ message }}</p> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

import Messages from '../components/Messages.vue';
import Input from '../components/Input.vue';
// import loop from '../service/ai.js';
import { onMounted, ref } from 'vue';
import axios from 'axios';
import useAxios from '../utils/useAxios';
import { useStore } from 'vuex';
import { jwtDecode } from "jwt-decode";
import dayjs from 'dayjs'; ''

const store = useStore();

const intercepter = useAxios();

const baseURL = 'http://localhost:8000';

const props = defineProps({
    username: {
        type: String,
    },
    personality_name: {
        type: String,
    }
});

console.log("personality_name: ", props.personality_name);

const isNotMaxTokens = ref(true);
let loading = ref(false);
const inputRef = ref();

// onMounted(() => {
//     inputRef.value.startRecognition();
// });

const all_messages = ref([
    {
        id: '1',
        data: '你好!',
        member: {
            id: '1',
            clientData: {
                color: 'blue',
                username: 'AI',
            }
        }
    },
]);

const resetMessage = ref("看起來是輸入的上下文長度已到達上限，請點擊左方按鈕重新啟動對話！");

const me = ref({
    id: '0',
    clientData: {
        color: 'green',
        username: props.username,
    },
});

const ai = ref({
    id: '1',
    clientData: {
        color: 'blue',
        username: "AI",
    },
});

async function resetTokens() {

    await intercepter.get("http://localhost:8000/app/reset_conversation_tokens/")
        .then(response => {
            console.log(response.data); // success
            isNotMaxTokens.value = true;
        })
        .catch(error => {
            console.log(error);
        });

    all_messages.value = [
        {
            id: '1',
            data: '你好!',
            member: {
                id: '1',
                clientData: {
                    color: 'blue',
                    username: 'AI',
                }
            }
        },
    ];
    // window.location.reload(); // TODO : 這個方法不太好，之後要改成不重新整理頁面的方法
}

const originalFetch = window.fetch;

async function fetchWithIntercepter(...args) {
    let [resource, options] = args;

    const payload = jwtDecode(String(localStorage.getItem('authTokenAccess')));
    // const isExpired = dayjs.unix(payload.exp).diff(dayjs()) < 1; 
    // This checks if the difference is less than 1 millisecond.

    const isExpired = dayjs.unix(payload.exp).diff(dayjs()) < 1;
    // payload.exp 的部分是 jwt的過期時間，如果這個過期時間超過了當前時間 dayjs 就會傳 true 代表 token 已經失效
    console.log("isExpired", isExpired);

    if (isExpired) {
        await axios({
            method: 'post',
            url: 'http://localhost:8000/authentication/token/refresh/',
            data: {
                refresh: localStorage.getItem('authTokenRefresh')
            },
        })
            .then(res => {
                store.commit('setToken', res.data)
            })
            .catch(err => {
                console.log("reset access token error: ", err);
            });
    }

    options.headers.Authorization = `Bearer ${localStorage.getItem('authTokenAccess')}`;

    const resp = await originalFetch(resource, options);
    return resp;
};

async function onSendMessage(message) {
    const newMessage = {
        data: message,
        member: me.value
    }

    all_messages.value.push(newMessage);

    const aiMessage = {
        data: "",
        member: ai.value
    };

    loading.value = true;

    all_messages.value.push(aiMessage);
    // intercepter
    window.fetch = fetchWithIntercepter;

    try {
        const response = await fetch(baseURL + "/app/openai/", {
            method: 'POST', // Set the method to POST
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ params: { messages: message, personality_name: props.personality_name} }),
        });

        console.log(response);

        const jobQueue = new Queue();
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        var mark = 0;

        const job = async () => {
            while (true) {
                const { value, done } = await reader.read();
                if (done) {
                    jobQueue.enqueue(new Promise((resolve, reject) => {
                        resolve({ message: "DEBUG:Done", audio_file: null });
                    }));
                    break;
                }

                let message = decoder.decode(value);

                jobQueue.enqueue(new Promise((resolve, reject) => {
                    intercepter.get('http://localhost:8000/app/audio_file/', { // TODO : 再請求音檔的時候，如果正好要更換 access token 的時候，好像會出現問題
                        responseType: 'arraybuffer', // 一定要加這一個才可以使用
                        params: {
                            mark: mark,
                            personality_name: props.personality_name
                        }
                    })
                        .then(response => {
                            const audio_file = response.data;
                            resolve({ message: message, audio_file: audio_file });
                        })
                        .catch(error => {
                            reject(error);
                        });
                }));
                mark += 1;
            }
        }

        job();
        await jobQueue.waitForDequeue();

        jobQueue.enqueue(new Promise((resolve, reject) => {
            intercepter.get('http://localhost:8000/app/conversation_tokens/', { // TODO : 再請求音檔的時候，如果正好要更換 access token 的時候，好像會出現問題
            })
                .then(response => {
                    console.log(response.data);
                    if (response.data.isFull) {
                        resetMessage.value = "看起來是輸入的上下文長度已到達上限，請點擊左方按鈕重新啟動對話！";
                        isNotMaxTokens.value = false;
                    }
                    resolve({ message: "", audio_file: null });
                })
                .catch(error => {
                    reject(error);
                });
        }));

        await jobQueue.waitForDequeue();

        loading.value = false;

        if(isNotMaxTokens.value) {
            inputRef.value.startRecognition();
        }


    } catch (error) {

        console.error('Error:', error);
        resetMessage.value = "網頁發生錯誤，請點擊左方按鈕重新啟動對話！";
        isNotMaxTokens.value = false; // 如果出錯，強制重新啟動

    }

}

class Queue {
    constructor() {
        this.elements = [];
    }

    enqueue(item) {
        this.elements.push(item);
    }

    dequeue() {
        return this.elements.shift();
    }

    isEmpty() {
        return this.elements.length === 0;
    }

    async waitForDequeue() {

        while (true) {
            if (!this.isEmpty()) {
                const item = await this.dequeue();
                console.log("item.message: ", item.message);
                if (item.audio_file === null) {
                    break;
                }
                // console.log("item.audio_file: ", item.audio_file.length);
                all_messages.value[all_messages.value.length - 1].data += item.message;
                const blob = new Blob([item.audio_file], { type: 'audio/wav' });
                const url = URL.createObjectURL(blob);
                console.log(url);
                const audio = new Audio(url);
                await new Promise(resolve => {
                    // Play the audio and resolve the promise when the audio ends
                    audio.onended = resolve;
                    audio.play();
                });
                // Create a blob URL for the audio element

            } else {
                await new Promise(resolve => setTimeout(resolve, 1000)); // wait for 1 second
            }
        }
    }
}

</script>

<style scoped>
.chat-page {
    background-color: rgb(25, 43, 58);
    margin: 0;
    display: flex;
    height: 100vh;
    width: 100vw;
}

.right-panel {
    overflow: hidden;
    flex: 1;
    flex-direction: column;
    padding: 0vh 20vw;
    display: flex;
    /* background-color: rgb(255, 248, 230); */
}

.left-panel {
    top: 0;
    left: 0;
    background-color: rgba(25, 43, 58, 0.5);
    width: 100vw;
    height: 100vh;
    opacity: 0;
    display: flex;
    pointer-events: none;
    /* 隱藏時禁用內部元素的交互 */
    flex-direction: row;
    position: fixed;
    align-items: center;
    justify-content: start;
}

.left-panel.open {
    opacity: 1;
    pointer-events: all;
    animation: slideIn 1.5s forwards;
}

@keyframes slideIn {
    0% {
        transform: translateX(-100%);
    }

    50% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(0);
    }
}

.left-panel button {
    border-radius: 15px;
    margin-left: 2rem;
    height: auto;
    padding: 5vw;
    font-size: 5rem;
    border: none;
    box-shadow: 0px 10px 20px 1px rgba(0, 0, 0, 0.15);
    color: white;
    cursor: pointer;
}

.left-panel button:hover {
    background-color: #000000;
}

.content {
    width: 20rem;
    padding: 2rem;
    margin-left: 2rem;
    margin-right: 2rem;
    box-shadow: 0px 10px 20px 1px rgba(0, 0, 0, 0.15);
    background-color: rgb(255, 238, 162);
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

.description-title>p {
    padding: 10px 20px;
    border-bottom: 1px solid rgb(177, 177, 177);
}

.right-panel {
    background-image: url('@/assets/chat_background.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
}

@media screen and (max-width: 1500px) {
    .right-panel {
        padding: 0vh 10vw;
    }
}

@media screen and (max-width: 1000px) {
    .right-panel {
        padding: 0;
    }
}

.message-box-down {
    order: 2;
    display: flex;
    /* align-items: center; */
    justify-content: center;

}

.message-box-up {
    display: flex;
    padding: 0vh 20px;
    flex-direction: column;
    /* align-items: center; */
    order: 1;
    flex: 1;
    overflow: hidden;
    /* background-color: rgba(99,99,191,.07); */
}

.appContent {
    height: 100%;
    display: flex;
    margin: 0 1rem;
    flex-direction: column;
    justify-content: center;
    /* box-sizing: border-box; */
}

.input-panel {
    padding: 0vw 20px 20px;
    min-width: 20vw;
    /* max-width: 40vw; */
    min-height: 1.5em;
    flex: 1
}


/* .input {
  font-size: 16px;
  border: 0;
  outline: none;
  flex-grow: 1;
  padding: 20px;
  border-radius: 10px;
} */
</style>