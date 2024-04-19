<template>
    <div class="color1 chat-page">
        <div class="color2 left-panel">
            <h2>hi</h2>
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
                    <Input :onSendMessage="onSendMessage" :disabled="loading" />
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
import { ref } from 'vue';
import axios from 'axios';
import useAxios from '../utils/useAxios';
import { jwtDecode } from "jwt-decode";
import dayjs from 'dayjs';

const intercepter = useAxios();

const baseURL = 'http://localhost:8000';

const props = defineProps({
    username: {
        type: String,
    },
});

let loading = ref(false);

const all_messages = ref([
    {
        id: '1',
        data: 'This is a test message!',
        member: {
            id: '1',
            clientData: {
                color: 'blue',
                username: 'bluemoon',
            }
        }
    },
    {
        id: '0',
        data: 'This is my message',
        member: {
            id: '0',
            clientData: {
                color: 'green',
                username: props.username,
            },
        }
    },
]);

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
        var newToken = await axios.post(`${baseURL}/api/token/refresh/`, {
            refresh: localStorage.getItem('authTokenRefresh'),
        })

        localStorage.setItem("authTokenRefresh", newToken.data['refresh']);
        localStorage.setItem("authTokenAccess", newToken.data['access']);
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

    const response = await fetch(baseURL + "/app/openai/", {
        method: 'POST', // Set the method to POST
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ params: { messages: message } }),
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
                intercepter.get('http://localhost:8000/app/audio_file/', {
                    responseType: 'arraybuffer', // 一定要加這一個才可以使用
                    params: {
                        mark: mark
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

    loading.value = false;

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
                if(item.audio_file === null) {
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
    margin: 0;
    display: flex;
    height: 100vh;
}

.right-panel {
    overflow: hidden;
    height: 100vh;
    flex: 1;
    flex-direction: column;
    padding: 0vh 20vw;
    display: flex;
    /* background-color: rgb(255, 248, 230); */
}


.left-panel {
    width: 30vh;
    box-shadow: 4px 0px 5px 0px rgba(0, 0, 0, 0.5);
}

@media screen and (max-width: 1500px) {
    .right-panel {
        padding: 0vh 10vw;
    }
}

@media screen and (max-width: 800px) {
    .left-panel {
        width: 0;
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