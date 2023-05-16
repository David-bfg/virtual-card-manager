import { ref } from 'vue';
import { defineStore } from 'pinia';
import { api } from 'boot/axios';

interface card {
  token: string;
  last_four: string;
  memo: string;
  spend_limit: number;
  spend_limit_duration: string;
  exp_month: string;
  exp_year: string;
  state: string;
  created: string;
  funding: object;
  type: string;
  auth_rule_tokens: Array<string>;
}

export const useVirtualCards = defineStore('virtual-cards', () => {
  const virtualCards = ref<Array<card>>([]);
  const apiKeyToken = 'lithic-key-token';
  // const account_token = env.account_token;

  async function refresh() {
    const apiKey = localStorage.getItem(apiKeyToken) || '';

    if(apiKey.length){
      const options = {
        method: 'GET',
        url: '/lithic/cards',
        params: {
          // account_token: account_token,
          page: '1',
          page_size: '100'
        },
        headers: {
          accept: 'application/json',
          Authorization: 'api-key ' + apiKey
        }
      };

      api
        .request(options)
        .then(function (response) {
          console.log(response.data);
          console.log(response.data.data);
          virtualCards.value = response.data.data;
          // TODO: add case for multiple pages.
        })
        .catch(function (error) {
          console.error(error);
        });
    } else {
      virtualCards.value = [];
    }
  }

  refresh();

  return { virtualCards, refresh };
});
