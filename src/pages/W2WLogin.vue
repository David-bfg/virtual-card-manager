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
            @click="logout()"
            :loading="isLoading">
      Logout
    </q-btn>
  </q-page>

</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import meteorServerSock from '../assets/typescript/meteor-sock';

const username = ref('');
const password = ref('');

let what2watchlistToken = 'w2w-token';

const loggedIn = ref(false);
const isLoading = ref(false);

interface event { stop: () => void; }
let loginEvent: event, logoutEvent: event, loginSessionLostEvent:
    event, loginResumeEvent: event;
onMounted(() => {

  if(meteorServerSock.token){ 
    loggedIn.value = !!meteorServerSock.userId;
  }

  loginEvent = meteorServerSock.on('login',()=>{
    loggedIn.value = true;
    console.log('User logged in');
  });

  logoutEvent = meteorServerSock.on('logout',()=>{
    loggedIn.value = false;
    console.log('User logged out');
  });

  loginSessionLostEvent = meteorServerSock.on('loginSessionLost',()=>{
    loggedIn.value = false;
    console.log('User lost connection to server, will auto resume ' +
        'by default with token');
  });

  loginResumeEvent = meteorServerSock.on('loginResume',()=>{
    loggedIn.value = true;
    console.log('User resumed (logged in by token)');
  });

});

onUnmounted(() => {
  loginEvent.stop();
  logoutEvent.stop();
  loginSessionLostEvent.stop();
  loginResumeEvent.stop();
});

function logout() {
  isLoading.value = true;
  meteorServerSock.logout().then(() => {
    localStorage.removeItem(what2watchlistToken);
  }).finally(() => isLoading.value = false);

}

function login() {
  isLoading.value = true;
  meteorServerSock.login({
    password: password.value,
    user: {
      username: username.value
    }
  }).then((userAuth: {id:string, token:string, tokenExpires:Date,
        type:string}) => {
    if (userAuth) {
      localStorage.setItem(what2watchlistToken, userAuth.token);
    }
  }).catch((e: Error) => {
    console.error('Login failed.', e.message)
  }).finally(() => isLoading.value = false);
}
</script>
