<template>
  <div class="color1 chat-page">
    <div class="color2 left-panel">
        <h2>hi</h2>
    </div>
    <div class="right-panel">
        <div class="message-box-up">
            <div class="appContent">
                <Messages :messages="all_messages" :me="me" />
            </div>
        </div>
        <div class="message-box-down">
            <div class="input-panel">
                <!-- <input type="text" 
                    v-model.trim="text" 
                    @keydown.enter.prevent="sendMsg" 
                    placeholder="請輸入" /> -->
                <Input :onSendMessage="onSendMessage" />
                <!-- <p>Message is : {{ message }}</p> -->
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>

    import Messages from '../components/Messages.vue';
    import Input from '../components/Input.vue';
    import loop from '../service/ai.js';
    import { onMounted } from 'vue'
    import { ref } from 'vue';

    const props = defineProps({
        username: {
            type: String,
        },
    });

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
        all_messages.value.push(newMessage);
        let ai_respond = await loop(message);
        const aiMessage = {
            data: ai_respond,
            member: ai.value
        }
        all_messages.value.push(aiMessage);
    }

</script>

<style>

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