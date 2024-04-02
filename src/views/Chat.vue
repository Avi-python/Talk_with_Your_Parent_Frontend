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
import { onMounted } from 'vue'
import { ref } from 'vue';
import axios from 'axios';
import useAxios from '../utils/useAxios';
import { jwtDecode } from "jwt-decode";
import dayjs from 'dayjs';
import { stringifyQuery } from 'vue-router';

const intercepter = useAxios();

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

async function onSendMessage(message) {
    const newMessage = {
        data: message,
        member: me.value
    }
    const aiMessage = {
        data: "",
        member: ai.value
    };

    const url = 'http://localhost:8000/app/openai/';

    loading.value = true;

    all_messages.value.push(newMessage);

    all_messages.value.push(aiMessage);

    const { fetch: originalFetch } = window;

    // intercepter
    window.fetch = async (...args) => {
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

    const response = await fetch(url, {
        method: 'POST', // Set the method to POST
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ params: { messages: message } }),
    });

    console.log(response);

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
        const { value, done } = await reader.read();
        if (done) {
            break;
        }
        let message = decoder.decode(value);
        all_messages.value[all_messages.value.length - 1].data += message;
        // console.log(all_messages.value[all_messages.value.length - 1])
    }

    loading.value = false;

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