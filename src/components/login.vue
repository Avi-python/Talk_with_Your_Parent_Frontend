<template>
    <div class="wrapper">
        <div class="login-form">
            <div class="login-title">
                <p>Login</p>
            </div>
            <label for="email">Email</label>
            <input type="email" id="email" name="email" v-model="email">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" v-model="password">
            <button v-on:click="login">Submit</button>
        </div>
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
                router.push({ path: `/chat/${email.value}` });
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

<style scoped>
.wrapper {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    background-color: white;
    color: black;
    font-family: Arial, sans-serif;
}

.login-title {
    /* background-color: black; */
    display: flex;
    align-items: center;
    justify-content: center; /* horizontally center */
    box-sizing: border-box;
    font-size: 2em;
}

.login-title > p {
    padding: 10px 20px;
    border-bottom: 1px solid rgb(177, 177, 177);
    color: rgb(163, 163, 163);
}

.login-form {
    display: flex;
    flex-direction: column;
    width: 300px;
    box-shadow: 0px 10px 20px 1px rgba(0, 0, 0, 0.15);
    padding: 40px;
    border-radius: 10px;
}

.login-form input {
    margin-bottom:20px;
    padding: 10px;
    font-size: 16px;
}

.login-form button {
    padding: 10px;
    font-size: 16px;
    background-color: black;
    border-radius: 15px;
    color: white;
    border: none;
    cursor: pointer;
    transition: 0.2s;
}

.login-form button:hover {
    background-color: #76ABAE;
}

</style>