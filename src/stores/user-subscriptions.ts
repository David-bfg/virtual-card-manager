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
  card?: boolean;
}

export const useUserSubscriptions = defineStore('user-subscriptions', () => {
  const userSubscriptions = ref<Array<sub>>([]);

  async function refresh() {
    if(meteorServerSock.userId){
      const streamManager = await meteorServerSock.call('subscription.details');
      userSubscriptions.value = streamManager;
    } else {
      userSubscriptions.value = [];
    }
  }
  return { userSubscriptions, refresh };
});
