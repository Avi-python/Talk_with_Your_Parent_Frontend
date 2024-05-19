<template>
    <ul class="messagesList">
        <Message v-for="message in messages" :key="message.id" :member="message.member" :data="message.data"
            :id="message.id" :me="me" />
        <div ref="bottomRef"></div>
    </ul>
</template>

<script setup>

import { onUpdated, ref } from 'vue';
import Message from './Message.vue';

const props = defineProps({
    messages: Array,
    me: Object,
    // refresh: Boolean,
});

const bottomRef = ref(null); // which is a reference to an empty div positioned beneath the latest message

onUpdated(() => {
    bottomRef.value.scrollIntoView({ behavior: 'smooth' });
}) // 每當 vue render 的時候，會執行這個事情。

</script>

<style scoped>

.messagesList {
    list-style: none;
    padding-left: 0;
    flex-grow: 1;
    overflow: auto;
    scrollbar-width: none;
}

</style>