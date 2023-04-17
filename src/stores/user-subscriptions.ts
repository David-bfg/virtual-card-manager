import { ref } from 'vue';
import { defineStore } from 'pinia';
import meteorServerSock from '../assets/typescript/meteor-sock';

interface sub {
  logo: string;
  service_name: string;
  plan?: string;
  price: number;
  service_id: string;
  card?: boolean;
}

export const useUserSubscriptions = defineStore('user-subscriptions', () => {
  const userSubscriptions = ref<Array<sub>>([
    {logo:'https://image.tmdb.org/t/p/original/t2yyOv40HZeVlLjYsCsPHnWLk4W.jpg',
    service_name: 'Awesome Flix', plan: 'basic', price: 100, service_id: '1'},
    {logo:'https://image.tmdb.org/t/p/original/t2yyOv40HZeVlLjYsCsPHnWLk4W.jpg',
    service_name: 'Awesome Flix1', plan: 'HD', price: 900, service_id: '2'},
    {logo:'https://image.tmdb.org/t/p/original/t2yyOv40HZeVlLjYsCsPHnWLk4W.jpg',
    service_name: 'Awesome Flix2', plan: '4K', price: 1400, service_id: '3'},
    {logo:'https://image.tmdb.org/t/p/original/t2yyOv40HZeVlLjYsCsPHnWLk4W.jpg',
    service_name: 'Awesome Flix3', plan: 'Family', price: 10000, card: true,
    service_id: '4'},
  ]);

  async function refresh() {
    const streamManager = await meteorServerSock.call('subscription.details');
    console.log(streamManager)
    userSubscriptions.value = streamManager;
  }
  return { userSubscriptions, refresh };
});
