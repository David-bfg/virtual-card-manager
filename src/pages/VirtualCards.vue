<template>
  <q-page class="row items-center justify-evenly">
    <q-list bordered padding>

      <q-item-label header>Virtual Cards</q-item-label>

      <template v-for="(card, index) in cards" :key="card.index">
        <q-separator v-if="0==index"/>
        <q-separator v-else spaced inset="item" />

        <q-item
        clickable
        v-ripple
        @click="prompt = true"
        >

          <q-item-section avatar top>
            <q-avatar :icon="matCreditCard" color="primary" text-color="white" />
          </q-item-section>

          <q-item-section>
            <q-item-label caption>
              <div>
                Linked Payment Card
                <br/>
                XXXX-XXXX-XXXX-{{card.last_four}}
              </div>
              card data...
            </q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>${{(card.limit/100).toFixed(2)}}</q-item-label>
          </q-item-section>

        </q-item>
      </template>

    </q-list>

    <q-dialog v-model="prompt">
      <q-card style="min-width: 350px">

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Apply" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup lang="ts">
import { matCreditCard } from '@quasar/extras/material-icons';
import { ref } from 'vue';

const prompt = ref(false);
const cards = ref([
  {id: 'a', last_four: '9876', name: 'Awesome Flix', plan: 'basic', limit: 100},
  {id: 'b', last_four: '9871', name: 'Awesome Flix1', plan: 'HD', limit: 900},
  {id: 'c', last_four: '9872', name: 'Awesome Flix2', plan: '4K', limit: 1400},
  {id: 'd', last_four: '9873', name: 'Awesome Flix3', plan: 'Family', limit: 10000},
])
</script>
