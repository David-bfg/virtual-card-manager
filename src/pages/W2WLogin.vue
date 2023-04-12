<template>
  <q-page class="row items-center justify-evenly">

    <q-form v-if="!loggedIn" @submit="login">
          <q-input
            filled
            v-model="username"
            label="Username"
            lazy-rules
            :rules="[ val => !!val || 'Please enter your username' ]"
          />
          <q-input
            filled
            v-model.lazy="password"
            label="Password"
            type="password"
            lazy-rules
            :rules="[ val => !!val || 'Please enter your password' ]"
          />
          <q-btn
            type="submit"
            color="primary"
            class="full-width"
            :loading="isLoading"
          >
            Login
          </q-btn>
    </q-form>
    <q-btn v-else 
            color="primary"
            @click="logout()">
      Logout
    </q-btn>
  </q-page>

</template>

<script setup lang="ts">
import { ref } from 'vue';
import meteorServerSock from '../assets/typescript/meteor-sock';

const username = ref('');
const password = ref('');

let what2watchlistToken = 'w2w-token';

const loggedIn = ref(false);
const isLoading = ref(false);

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
