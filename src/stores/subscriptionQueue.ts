import { ref } from "vue";
import { defineStore } from "pinia";
import meteorServerSock from "@/assets/typescript/meteor-sock";

export const useSubscriptionQueue = defineStore("subscription-queue", () => {
  const subscriptionQueue = ref([1,2,3]);

  return { subscriptionQueue };
});
