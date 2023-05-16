<template>
  <q-page class="row items-center justify-evenly">

    <q-form @submit="getCards">
          <q-input
            filled
            v-model.lazy="apiKey"
            label="API-Key"
            type="password"
            lazy-rules
            :rules="[ val => !!val || 'Please enter your API-Key' ]"
          />
    </q-form>
  </q-page>

</template>

<script setup lang="ts">
import { ref } from 'vue';
import { api } from 'boot/axios'

const apiKeyToken = 'lithic-key-token';
// const account_token = env.account_token;
const apiKey = ref(localStorage.getItem(apiKeyToken) || '');

function getCards() {
  const options = {
    method: 'GET',
    url: '/lithic/transactions',
    params: {
      // account_token: account_token,
      page: '1',
      page_size: '50'
    },
    headers: {
      accept: 'application/json',
      Authorization: 'api-key ' + apiKey.value
    }
  };

  api
    .request(options)
    .then(function (response) {
      console.log(response.data);
      console.log(response.data.data);
      localStorage.setItem(apiKeyToken, apiKey.value);
    })
    .catch(function (error) {
      console.error(error);
    });
}

</script>
