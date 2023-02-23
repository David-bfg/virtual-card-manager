<template>
  <div class="about">
    <h1>
      This is an about page
      {{ storeSubscriptionQueue.subscriptionQueue }}
    </h1>
  </div>
</template>

<script setup lang="ts">
import { useSubscriptionQueue } from '@/stores/subscriptionQueue';

const storeSubscriptionQueue = useSubscriptionQueue();
</script>
