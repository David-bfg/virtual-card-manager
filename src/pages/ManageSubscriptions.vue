<template>
  <q-page class="row items-center justify-evenly">
    <q-list bordered padding>

      <q-item-label header class="q-py-sm">
        What to Watchlist prefered subscriptions
        <q-icon
          :name="matRefresh"
          class="float-right cursor-pointer"
          size="sm"
          @click="storeSubscriptions.refresh()"
        />
      </q-item-label>

      <template v-for="(sub, index) in storeSubscriptions.userSubscriptions" :key="sub.service_id">
        <q-separator v-if="0==index"/>
        <q-separator v-else spaced inset="item" />

        <q-item>
          <q-item-section top avatar>
            <q-avatar rounded>
              <img :src="sub.logo">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{sub.service_name}}</q-item-label>
            <q-item-label caption>
              {{sub.plan}} plan  {{ sub.service_id }}
              <CardInfo v-if="sub.card" :card="{TODO: 'add plumbing for linked card data'}" />
              <div v-if="sub.card">
                Linked Payment Card
                <br/>
                XXXX-XXXX-XXXX-0000
              </div>
              <p v-else>
                Needs linked card to manage service payments.
              </p>
            </q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>${{(sub.price/100).toFixed(2)}}</q-item-label>
            <br/>
            <q-btn @click="selectCard = null; prompt = true, activeSub=sub" >
              <q-icon v-if="sub.card" :name="matCreditCard" color="blue" />
              <q-icon v-else :name="matAdd" color="blue" />
            </q-btn>
          </q-item-section>
        </q-item>
      </template>

    </q-list>

    <q-dialog v-model="prompt">
      <q-card v-if="!addCard" style="min-width: 350px">
        <q-list bordered padding class="rounded-borders text-primary">
          <q-item-label header class="q-py-sm">
            Select card for subscription
            <q-icon
              :name="matRefresh"
              class="float-right cursor-pointer"
              size="sm"
              @click="storeCards.refresh()"
            />
          </q-item-label>
          
          <q-separator />

          <template v-for="(card) in storeCards.virtualCards" :key="card.token">
            <q-item
              clickable
              v-ripple
              :active="selectCard === card.token"
              @click="selectCard = card.token"
              active-class="my-menu-link"
            >
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
              </q-item-section>
            </q-item>

            <q-separator spaced inset="item" />
          </template>

          <q-item
            clickable
            v-ripple
            @click="selectCard = null;"
          >
            <q-item-section avatar top>
              <q-avatar :icon="matAdd" color="primary" text-color="white" />
            </q-item-section>

            <q-item-section @click="addCard = true">
              <q-item-label>Create New Card</q-item-label>
            </q-item-section>

          </q-item>
        </q-list>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Link Card" @click=";" v-close-popup />
        </q-card-actions>
      </q-card>
      
      <CardEditor v-else :cardDefaults="{memo: activeSub?.service_name || '', spend_limit: ((activeSub?.price || 0)/100).toFixed(2), spend_limit_duration: activeSub?.period || ''}"/>
    </q-dialog>

  </q-page>
</template>

<script setup lang="ts">
import { matCreditCard, matAdd, matRefresh } from '@quasar/extras/material-icons';
import { ref, onMounted, watch } from 'vue';
import type { sub } from '../stores/user-subscriptions';
import { useUserSubscriptions } from '../stores/user-subscriptions';
import { useVirtualCards } from '../stores/virtual-cards';
import CardInfo from 'src/components/CardInfo.vue';
import CardEditor from 'src/components/CardEditor.vue';

const prompt = ref(false);
const addCard = ref(false);
const selectCard = ref<string | null>(null);
const storeSubscriptions = useUserSubscriptions();
const storeCards = useVirtualCards();
const activeSub = ref<sub | null>(null);

onMounted(() => {
  if(!storeSubscriptions.userSubscriptions.length){
    storeSubscriptions.refresh();
  }
});

watch(prompt, (newPrompt) => {
  if(newPrompt){
    selectCard.value = null;
  } else {
    addCard.value = false
  }
});
</script>

<style lang="sass">
.my-menu-link
  color: white
  background: lightblue
</style>
