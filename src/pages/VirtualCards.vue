<template>
  <q-page class="row items-center justify-evenly">
    <q-list bordered padding>

      <q-item-label header class="q-py-sm">
        Virtual Cards
        <q-icon
          :name="matRefresh"
          class="float-right cursor-pointer"
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
              <CardInfo :card="card" />
            </q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>
              ${{(card.spend_limit/100).toFixed(2)}}
            </q-item-label>
            <br>
            <q-btn @click="selCard(card.token); prompt = true" class="vertical-bottom">
              <q-icon :name="matEdit" color="blue" />
            </q-btn>
          </q-item-section>

        </q-item>
      </template>

    </q-list>

    <q-dialog v-model="prompt">
      <CardEditor v-if="prompt" :editingCardToken="editingCardToken"/>
    </q-dialog>

  </q-page>
</template>

<script setup lang="ts">
import { matCreditCard, matRefresh, matEdit } from '@quasar/extras/material-icons';
import CardInfo from 'src/components/CardInfo.vue';
import CardEditor from 'src/components/CardEditor.vue';
import { ref } from 'vue';
import { useVirtualCards } from '../stores/virtual-cards';

const prompt = ref(false);
const storeCards = useVirtualCards();
const editingCardToken = ref<string | null>(null);

function selCard(token: string) {
  editingCardToken.value = token;
}

</script>
