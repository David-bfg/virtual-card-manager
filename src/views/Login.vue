<template>
  <div class="form-group">
    <label for="username">Username:</label>
    <input type="text"
           id="username"
           v-model="username"
           :disabled="loggedIn">
    <br>
    <label for="password">Password:</label>
    <input type="password"
           id="password"
           v-model.lazy="password"
           :disabled="loggedIn">
    <br>
    <button v-if="loggedIn" @click="logout()">Logout</button>
    <button v-else @click="login()">Login</button>
    <h1 v-if="loggedIn">You Are LoggedIn</h1>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import meteorServerSock from "@/assets/typescript/meteor-sock";

const username = ref('');
const password = ref('');

let what2watchlistToken = 'w2w-token';

const loggedIn = ref(false);

let token = localStorage.getItem(what2watchlistToken);
if(meteorServerSock.token){
  loggedIn.value = !!meteorServerSock.userId;
} else if (token) {
  meteorServerSock.login({resume:token}).then(
    () => loggedIn.value = !!meteorServerSock.userId
  ).catch((e: Error) => {
    console.error('Stored login token failed.' +
        ' Unable to re-initiate login.', e)
  });
  
}


function logout() {
  meteorServerSock.logout().then(() => {
    loggedIn.value = false;
    localStorage.removeItem(what2watchlistToken);
  });

}

function login() {
  meteorServerSock.login({
    password: password.value,
    user: {
      username: username.value
    }
  }).then((userAuth: {id:string, token:string, tokenExpires:Date,
        type:string}) => {
    loggedIn.value = !!userAuth.id;
    if (userAuth) {
      localStorage.setItem(what2watchlistToken, userAuth.token);
    }
  }).catch((e: Error) => {
    console.error('Login failed.', e.message)
  });
}
</script>