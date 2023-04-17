<template>
  <q-page class="row items-center justify-evenly">
    <q-list bordered padding>

      <q-item-label header>What to Watchlist prefered subscriptions</q-item-label>

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
            <q-btn @click="selectCard = null; prompt = true" >
              <q-icon v-if="sub.card" :name="matCreditCard" color="blue" />
              <q-icon v-else :name="matAdd" color="blue" />
            </q-btn>
          </q-item-section>
        </q-item>
      </template>

    </q-list>

    <q-dialog v-model="prompt">
      <q-card style="min-width: 350px">
        <q-list bordered padding class="rounded-borders text-primary">
          <q-item
            clickable
            v-ripple
            :active="selectCard === 'inbox'"
            @click="selectCard = 'inbox'"
            active-class="my-menu-link"
          >
            <q-item-section avatar top>
              <q-avatar :icon="matCreditCard" color="primary" text-color="white" />
            </q-item-section>

            <q-item-section>
              <q-item-label caption>
                plan
                <div>
                  Linked Payment Card
                  <br/>
                  XXXX-XXXX-XXXX-0000
                </div>
                      card data...
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            @click="selectCard = null;"
          >
            <q-item-section avatar top>
              <q-avatar :icon="matAdd" color="primary" text-color="white" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Add Virtual Card</q-item-label>
            </q-item-section>

          </q-item>
        </q-list>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Link Card" @click="storeSubscriptions.refresh()" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup lang="ts">
import { matCreditCard, matAdd } from '@quasar/extras/material-icons';
import { ref } from 'vue';
import { useUserSubscriptions } from '../stores/user-subscriptions';

const prompt = ref(false);
const selectCard = ref<string | null>(null);
const storeSubscriptions = useUserSubscriptions();
</script>

<style lang="sass">
.my-menu-link
  color: white
  background: lightblue
</style>
