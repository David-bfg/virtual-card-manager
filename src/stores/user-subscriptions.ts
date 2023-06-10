import { ref } from 'vue';
import { defineStore } from 'pinia';
import meteorServerSock from '../assets/typescript/meteor-sock';

export interface sub {
  logo: string;
  service_name: string;
  plan?: string;
  price: number;
  period: string;
  service_id: string;
}

export interface subLink {
  sub: sub;
  cardToken?: string;
}

export const useUserSubscriptions = defineStore('user-subscriptions', () => {
  const userSubscriptions = ref<Array<sub>>([]);
  // TODO: load on startup and persist data
  const subLinksToVirtualCards = ref(new Map<string, subLink>());
  // TODO: calculate on startup
  const cardToSub = new Map<string, sub>();

  async function refresh() {
    if(meteorServerSock.userId){
      userSubscriptions.value = await meteorServerSock.call('subscription.details');
      userSubscriptions.value.forEach(sub => {
        const id = 'w2w:' + sub.service_id;
        const value = subLinksToVirtualCards.value.get(id);
        if(value){
          value.sub = sub;
          if(value.cardToken){
            cardToSub.set(value.cardToken, sub);
          }
        } else {
          subLinksToVirtualCards.value.set(id, {sub: sub});
        }
      });
    } else {
      userSubscriptions.value = [];
    }
  }

  function getSubFromCard(token: string) {
    return cardToSub.get(token);
  }

  function setSubLink(service_id: string, cardToken: string) {
    const id = 'w2w:' + service_id;
    const subLnk = subLinksToVirtualCards.value.get(id);
    if(subLnk){
      subLnk.cardToken = cardToken;
      cardToSub.set(cardToken, subLnk.sub);
    } else {
      throw new Error('Error: Subscription service not found');
    }
  }

  function getLinkedCardToken(service_id: string) {
    return subLinksToVirtualCards.value.get('w2w:' + service_id)?.cardToken;
  }

  return {
    userSubscriptions,
    subLinksToVirtualCards,
    refresh,
    getSubFromCard,
    setSubLink,
    getLinkedCardToken
  };
},
{
  persist: {
    afterRestore: (ctx) => {
      ctx.store.subLinksToVirtualCards = new Map<string, subLink>(
          Object.entries(ctx.store.subLinksToVirtualCards));
    },
    paths: ['subLinksToVirtualCards'],
  },
},
);
