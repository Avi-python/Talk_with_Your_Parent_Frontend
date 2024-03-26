<template>
    <div>
        <button v-on:click="login">login</button>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter();
// vuex ############################
const store = useStore();
// login ###########################
let email = ref('guagua@gmail.com');
let password = ref('12345');

const login = () => {
    axios({
        method: 'post',
        url: 'http://localhost:8000/authentication/token/',
        data: {
            email: email.value,
            password: password.value
        },
    })
        .then(res => {
            // restore token to stage management and local storage
            store.commit('setToken', res.data)
            if (res.status == 200) {
                router.push('/')
            }
            else {
                console.log("login failed");
            }
        })
        .catch(err => {
            console.log("login failed");
        })
}

</script>