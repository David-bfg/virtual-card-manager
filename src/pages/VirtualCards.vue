<template>
  <q-page class="row items-center justify-evenly">
    <q-list bordered padding>

      <q-item-label header class="q-py-sm">
        Virtual Cards
        <q-icon
          :name="matRefresh"
          class="float-right"
          size="sm"
          @click="storeCards.refresh()"
        />
      </q-item-label>

      <template v-for="(card, index) in storeCards.virtualCards" :key="card.token">
        <q-separator v-if="0==index"/>
        <q-separator v-else spaced inset="item" />

        <q-item>

          <q-item-section avatar top>
            <q-avatar :icon="matCreditCard" color="primary" text-color="white" />
          </q-item-section>

          <q-item-section>
            <q-item-label caption>
              <div>
                {{card.memo}} Virtual Card
                <br/>
                Expires: {{card.exp_month}}/{{card.exp_year}}
                <br/>
                Status: {{ card.state.charAt(0) + card.state.substring(1).toLowerCase() }}
                <br/>
                XXXX-XXXX-XXXX-{{card.last_four}}
              </div>
            </q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>
              ${{(card.spend_limit/100).toFixed(2)}}
              <br/>
              <q-btn @click="prompt = true" >
                <q-icon :name="matEdit" color="blue" />
              </q-btn>
            </q-item-label>
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
import { matCreditCard, matRefresh, matEdit } from '@quasar/extras/material-icons';
import { ref } from 'vue';
import { useVirtualCards } from '../stores/virtual-cards';

const prompt = ref(false);
const storeCards = useVirtualCards();

</script>
