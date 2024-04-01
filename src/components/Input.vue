<template>
    <div class="input">
        <form @submit.prevent="onSubmit">
            <textarea class="color1" v-model="text" @input="onChange" :disabled="disabled" />
            <button type="button" @click="onSubmit" :disabled="disabled"><i
                    class="material-icons keyboard_arrow_up">keyboard_arrow_up</i></button>
        </form>
    </div>
</template>

<script setup>

import { ref, onMounted, defineProps } from 'vue';

function onChange(e) {
    const textValue = e.target.value;
    text.value = textValue;
}

function onSubmit() {
    if (text.value == "") return;
    props.onSendMessage(text.value);
    text.value = '';
}

const props = defineProps({
    onSendMessage: Function,
    disabled: Boolean,
});

const text = ref('');

</script>

<style scoped>
/* .input {
        padding: 0.8vw;
        border-radius: 1vw;
        border: 1px solid #df6d74;
    } */

form {
    display: flex;
    flex-direction: row;
}

textarea {
    padding: 20px 20px 0px 20px;
    resize: none;
    overflow: hidden;
    display: block;
    flex: 1;
    border-radius: 20px;
    border: 1px solid #222831;
    font-size: 1em;
    word-wrap: break-word;
    color: #222831;
    margin: 0px;
    line-height: 20px;
}

textarea:focus {
    outline: none;
}


button {
    margin: 10px 0px 10px 10px;
    padding: 5px 0px 0px 0px;
    font-size: 16px;
    height: 40px;
    width: 40px;
    background-color: #222831;
    color: white;
    border: none;
    border-radius: 15px;
    cursor: pointer;
    transition: 0.2s;
}

button:hover {
    background-color: #76ABAE;
}

textarea:disabled, button:disabled {
    /* Apply styles for disabled textarea here */
    opacity: 0.5;
    /* For example, reduce opacity */
    cursor: not-allowed;
    /* Change cursor style */
}

.material-icons.keyboard_arrow_up {
    color: #EEEEEE;
}
</style>