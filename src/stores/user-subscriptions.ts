import { ref } from 'vue';
import { defineStore } from 'pinia';
import meteorServerSock from '../assets/typescript/meteor-sock';

export const useUserSubscriptions = defineStore('user-subscriptions', () => {
  const userSubscriptions = ref([
    {icon:'https://image.tmdb.org/t/p/original/t2yyOv40HZeVlLjYsCsPHnWLk4W.jpg',
    service: 'Awesome Flix', plan: 'basic', price: 100},
    {icon:'https://image.tmdb.org/t/p/original/t2yyOv40HZeVlLjYsCsPHnWLk4W.jpg',
    service: 'Awesome Flix1', plan: 'HD', price: 900},
    {icon:'https://image.tmdb.org/t/p/original/t2yyOv40HZeVlLjYsCsPHnWLk4W.jpg',
    service: 'Awesome Flix2', plan: '4K', price: 1400},
    {icon:'https://image.tmdb.org/t/p/original/t2yyOv40HZeVlLjYsCsPHnWLk4W.jpg',
    service: 'Awesome Flix3', plan: 'Family', price: 10000, card: true},
  ]);

  function refresh() {
    // TODO: meteor call
  }
  return { userSubscriptions, refresh };
});
