<template>
    <mainLayout />
    <chat :username="username" />
</template>

<script setup>
import chat from '../components/chat.vue';
import mainLayout from '../components/mainLayout.vue';

const props = defineProps({
    username: {
        type: String,
    },
});

</script>