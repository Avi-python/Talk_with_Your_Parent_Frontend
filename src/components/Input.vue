<template>
    <div class="input">
        <form @submit.prevent="onSubmit">
            <textarea class="color1" v-model="text" @input="onChange" :disabled="disabled" />
            <button type="button" @click="onSubmit" :disabled="disabled"><i
                    class="material-icons keyboard_arrow_up">keyboard_arrow_up</i></button>
            <button type="button" @click="startRecognition" class="color1">語</button>
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

let recognition = null;

///語音轉文字
const startRecognition = () => {
    recognition.start();
    console.log('開始接收輸入的音訊');
};

onMounted(() => {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = false;
    recognition.lang = 'zh-TW'; 
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onaudiostart = () => {
        console.log('使用者的設備開始接收音訊時會觸發此事件');
    };

    recognition.onsoundstart = () => {
        console.log('設備偵測到任何聲音時便會觸發此事件');
    };

    recognition.onspeechstart = () => {
        console.log('語音辨識伺服器開始辨識出音訊時便會觸發此事件');
    };

    recognition.onresult = event => {
        console.log('語音辨識伺服器結束辨識並回傳結果為:', event.results);
        const resultMsg = event.results[0][0].transcript;
        console.log('語音辨識伺服器辨識出的結果為: ' + resultMsg);
        text.value = resultMsg;
        onSubmit();
        console.log(
            '語音辨識系統對辨識正確性的置信度: ' + event.results[0][0].confidence
        );
    };

    recognition.onspeechend = () => {
        console.log('語音辨識伺服器結束辨識音訊時便會觸發此事件');
        recognition.stop();
        console.log('已停止接收輸入的音訊');
    };

    recognition.onsoundend = () => {
        console.log('設備偵測不到任何聲音時便會觸發此事件');
    };

    recognition.onaudioend = () => {
        console.log('使用者的設備結束接收音訊時會觸發此事件');
    };

    recognition.onend = () => {
        console.log('使用者設備結束與語音辨識伺服器的連結時會觸發此事件');
    };

    recognition.onnomatch = () => {
        diagnosticMessage.value = '我無法辨識該顏色。';
    };

    recognition.onerror = event => {
        diagnosticMessage.value = '辨識過程中出現錯誤： ' + event.error;
    };
})
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

textarea:disabled,
button:disabled {
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