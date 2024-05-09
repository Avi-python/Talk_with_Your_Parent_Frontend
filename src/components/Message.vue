<template>
    <li :key="id" :class="className">
        <!-- <span class="avatar" :style="{ backgroundColor: color }" /> -->
        <div class="messageContent">
            <div class="username">{{ username }}</div>
            <div class="text">{{ data }}</div>
        </div>
    </li>
</template>

<script setup>// 本質上是 export default { setup(){ ... } } 是一個語法糖
// import { defineProps } from 'vue';

const props = defineProps({
    member: Object,
    me: Object,
    data: String,
    id: String,
})

var { username, color } = props.member.clientData;
const messageFromMe = props.member.id === props.me.id;
const className = messageFromMe
    ? "messagesMessage currentMember"
    : "messagesMessage";

// username = messageFromMe
//     ? "我"
//     : username;

</script>

<style scoped>
.text {
    white-space: pre-wrap;
}

.avatar {
    height: 35px;
    width: 35px;
    border-radius: 50%;
}

.messagesMessage {
    display: flex;
    margin-top: 10px;
}

.messagesMessage.currentMember {
    flex-direction: row-reverse;
    text-align: right;
}

.messagesMessage.currentMember > .messageContent {
    background-color: white;
    color: #222831;
}

.messagesMessage > .messageContent {
    background-color: #222831;
    color: white;
}

.messagesMessage>.avatar {
    margin: 0 10px -10px;
}

.username {
    color: gray;
    font-size: 14px;
}

.messageContent {
    padding: 0.5rem 1rem;
    border-radius: 15px;
    box-shadow: 0px 10px 20px 1px rgba(0, 0, 0, 0.15);

}

.messageContent > .text {
    padding: 10px;
    max-width: 400px;
    margin: 0;
    display: inline-block;
    animation: slideUp 0.5s ease-in-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

</style>