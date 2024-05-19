<template>
    <div class="input">
        <form @submit.prevent="onSubmit">
            <textarea class="color1" v-model="text" @input="onChange" :disabled="disabled" />
            <button class="input" type="button" @click="onSubmit" :disabled="disabled"><i
                    class="material-icons">check_small</i></button>
            <button class="input color1 material-icons" type="button" @click="startRecognition"
                :disabled="disabled">mic</button>
        </form>
    </div>
    <div v-if="isStartRecording" class="talking">
        <div v-if="isRecording" class="talking-circle" :class="{ 'notTalking': !isTalking }">
            <i class="material-icons">mic</i>
        </div>
        <button class="stopRecord" @click="stopRecognition" ><i
                    class="material-icons">close</i></button>
    </div>
</template>

<script setup>

import { ref, onMounted, defineExpose } from 'vue';

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

const isTalking = ref(false);
const isRecording = ref(false);
const isStartRecording = ref(false);

//自己調整 textarea 行高

let recognition = null;

///語音轉文字
function startRecognition() {
    isStartRecording.value = true;
    recognition.start();
    console.log('開始接收輸入的音訊');
};

function stopRecognition() {
    recognition.stop();
};

defineExpose({
    startRecognition,
});

onMounted(() => {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = false;
    recognition.lang = 'zh-TW';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onaudiostart = () => {
        console.log('使用者的設備開始接收音訊時會觸發此事件');
        isRecording.value = true;
        
    };

    recognition.onsoundstart = () => {
        console.log('設備偵測到任何聲音時便會觸發此事件');
        isTalking.value = true;
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
        isStartRecording.value = false;
        console.log('已停止接收輸入的音訊');
    };

    recognition.onsoundend = () => {
        console.log('設備偵測不到任何聲音時便會觸發此事件');
    };

    recognition.onaudioend = () => {
        console.log('使用者的設備結束接收音訊時會觸發此事件');
    };

    recognition.onend = () => {
        isStartRecording.value = false;
        isRecording.value = false;
        isTalking.value = false;
        console.log('使用者設備結束與語音辨識伺服器的連結時會觸發此事件');
    };

    recognition.onnomatch = () => {
        diagnosticMessage.value = '我無法辨識該顏色。';
    };

    recognition.onerror = event => {
        isStartRecording.value = false;
        isRecording.value = false;
        isTalking.value = false;
        // diagnosticMessage.value = '辨識過程中出現錯誤： ' + event.error;
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
    resize: hidden;
    overflow: hidden;
    display: block;
    flex: 1;
    border-radius: 20px;
    border: none;
    background-color: rgb(255, 255, 255);
    box-shadow: 0px 10px 20px 1px rgba(0, 0, 0, 0.15);
    font-size: 1em;
    word-wrap: break-word;
    color: #000000;
    margin: 0px;
}

textarea:focus {
    outline: none;
}


button.input {
    margin: 10px 0px 10px 10px;
    font-size: 16px;
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 40px;
    background-color: #222831;
    box-shadow: 0px 10px 20px 1px rgba(0, 0, 0, 0.15);
    color: white;
    border: none;
    border-radius: 15px;
    cursor: pointer;
    transition: 0.2s;
}

button.input:hover {
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

.talking {
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
}

.talking-circle {
    width: 10rem;
    height: 10rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background-color: white;
    box-shadow: 0px 10px 20px 1px rgba(0, 0, 0, 0.15);
    animation: pulse 1s infinite;
}

.talking-circle.notTalking {
    opacity: 0.3;
    cursor: not-allowed;
}

.talking-circle i {
    font-size: 5rem;
}

button.stopRecord {
    width: 5rem;
    height: 5rem;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: #76ABAE;
    box-shadow: 0px 10px 20px 1px rgba(0, 0, 0, 0.15);
    border: none;
    position: absolute;
    bottom: 5rem;
    cursor: pointer;
    transition: 0.2s;
}

button.stopRecord:hover {
    background-color: #222831;

}

.material-icons.keyboard_arrow_up {
    color: #EEEEEE;
}
</style>