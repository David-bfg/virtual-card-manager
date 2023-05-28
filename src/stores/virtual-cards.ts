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
  const mapCards = new Map<string, number>();
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
          virtualCards.value = response.data.data;
          // TODO: add case for multiple pages.
          mapCards.clear();
          virtualCards.value.forEach((card, i) => mapCards.set(card.token, i))
        })
        .catch(function (error) {
          console.error(error);
        });
    } else {
      virtualCards.value = [];
      mapCards.clear();
    }
  }

  async function editCard(cardToken: string, spend_limit_duration: string, spend_limit: number, memo: string, state: string) {
    const apiKey = localStorage.getItem(apiKeyToken) || '';
    const card = getCard(cardToken);
    const edits = {spend_limit_duration, spend_limit, memo, state};
    Object.keys(card).forEach(key => {
      if(card[key] === edits[key]) delete edits[key];
    });

    if(apiKey.length){
      const options = {
        method: 'PATCH',
        url: '/lithic/cards/' + cardToken,
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          Authorization: 'api-key ' + apiKey
        },
        data: edits
      };
  
      api
        .request(options)
        .then(function (response) {
          Object.keys(card).forEach(key => card[key] = response.data[key]);
        })
        .catch(function (error) {
          console.error(error);
        });
    } else {
      console.error('error: No API Key');
    }
  }

  async function addCard(spend_limit_duration: string, spend_limit: number, memo: string, state: string) {
    const apiKey = localStorage.getItem(apiKeyToken) || '';

    if(apiKey.length){
      const options = {
        method: 'POST',
        url: '/lithic/cards/',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          Authorization: 'api-key ' + apiKey
        },
        data: {
          type: 'VIRTUAL',
          spend_limit_duration: spend_limit_duration,
          spend_limit: spend_limit,
          memo: memo,
          state: state
        }
      };
      
      api
        .request(options)
        .then(function (response) {
          virtualCards.value.push(response.data);
          mapCards.set(response.data.token, virtualCards.value.length-1);
        })
        .catch(function (error) {
          console.error(error);
        });
    } else {
      console.error('error: No API Key');
    }
  }

  function getCard(token: string) {
    return virtualCards.value?.[mapCards.get(token)];
  }

  refresh();

  return { virtualCards, refresh, getCard, editCard, addCard };
});
