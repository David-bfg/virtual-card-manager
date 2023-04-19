<template>
  <router-view />
</template>

<script setup lang="ts">
import { useUserSubscriptions } from 'stores/user-subscriptions';
import meteorServerSock from 'assets/typescript/meteor-sock';

const what2watchlistToken = 'w2w-token';

let token = localStorage.getItem(what2watchlistToken);
const storeSubscriptions = useUserSubscriptions();
if (token) {
  meteorServerSock.login({resume:token}).then(() => {
    console.log('Resumed Login');
    storeSubscriptions.refresh();
  }).catch((e: Error) => {
    // TODO: send to login page
    console.error('Stored login token failed.' +
        ' Unable to re-initiate login.', e)
  });
}
</script>
