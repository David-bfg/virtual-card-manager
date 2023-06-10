<template>
  <q-card style="min-width: 350px">
    <q-form @submit="editCard" @reset="resetCardValues">
      <q-input
        filled
        v-model.trim="cardEdits.memo"
        label="Card Name"
        :hint="isFieldChanged('memo') ? 'Default: ' + getFieldDefault('memo') : ''"
      />
      <q-input
        filled
        v-model.number="cardEdits.tax"
        min="1" max="25"
        :rules="[
          value => value > 0 || 'Tax percentage must be greater than zero.',
          value => value <= 25 || 'Check tax percentage. It\'s unusually high.',
        ]"
        type="number"
        label="Tax"
        suffix="%"
        input-class="text-right"
        :disable="!cardEdits.addTax"
      >
        <template v-slot:after>
          <q-toggle v-model="cardEdits.addTax" />
        </template>
      </q-input>
      <q-input
        filled
        v-model="cardEdits.spend_limit"
        label="Spending Limit"
        prefix="$"
        mask="#.##"
        fill-mask="0"
        reverse-fill-mask
        :rules="[
          value => parseFloat(value) > 0 || 'Spending limit should be greater than zero.',
        ]"
        :hint="!cardEdits.addTax && isFieldChanged('spend_limit') ? 'Default: ' + (getFieldDefault('spend_limit')/100).toFixed(2) : ''"
        input-class="text-right"
        :disable="cardEdits.addTax"
      />
      <q-select
        v-model="cardEdits.spend_limit_duration"
        :options="spendingPeriods"
        map-options
        label="Spending Limit Period"
        :hint="isFieldChanged('spend_limit_duration') ? 'Default: ' + spendingPeriodsNameMap[getFieldDefault('spend_limit_duration')] : ''"
        emit-value
      />
      <q-select
        v-model="cardEdits.state"
        :options="CardStates"
        map-options
        label="Card State"
        :hint="isFieldChanged('state') ? 'Default: ' + CardStatesNameMap[getFieldDefault('state')] : ''"
        emit-value
      />

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn flat label="Reset" type="reset" />
        <q-btn flat label="Apply" type="submit" v-close-popup />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue';
import { useVirtualCards } from '../stores/virtual-cards';


const props = defineProps<{
  editingCardToken?: string
  cardDefaults?: {
  memo: string,
  spend_limit: string,
  spend_limit_duration: string,
  }
  service_id?: string
}>()

const storeCards = useVirtualCards();
const cardEdits = reactive({
  memo: '',
  spend_limit: '',
  spend_limit_duration: '',
  state: 'OPEN',
  addTax: false,
  tax: 6,
});

const storeCard = storeCards.getCard(props.editingCardToken);
const lithicKeys = [
  'memo', 'spend_limit', 'state', 'spend_limit_duration',
];
// get card defaults from store
function resetCardValues(){
  if(props.editingCardToken){
    lithicKeys.forEach(key => {
      const val = storeCard[key];
      cardEdits[key] = key === 'spend_limit' ? (cardEdits.addTax ? 
          calcTax(val/100) : (val/100).toFixed(2)) : val;
    });
  } else {
    // TODO: revisit once user has default tax property
    Object.keys(props.cardDefaults).forEach(key => {
      cardEdits[key] = key === 'spend_limit' ? (props.cardDefaults[key]/100
          ).toFixed(2) : props.cardDefaults[key];
    });
  }
  cardEdits.addTax = false;
}
resetCardValues();

const changedFields = computed(() => {
  return lithicKeys.filter(key => {
    if(props.editingCardToken){
      return (key === 'spend_limit' ? parseFloat(cardEdits[key])*100 :
          cardEdits[key]) !== storeCard[key];
    } else {
      return key === 'state' ? false : (key === 'spend_limit' ? parseFloat(
          cardEdits[key])*100 : cardEdits[key]) !== props.cardDefaults[key];
    }
  });
});

const spendingPeriods = [
  {
    value: 'MONTHLY',
    label: 'Monthly'
  },
  {
    value: 'ANNUALLY',
    label: 'Annually'
  },
  {
    value: 'TRANSACTION',
    label: 'Each Transaction',
    disable: true,
  },
  {
    value: 'FOREVER',
    label: 'Card Lifetime',
    disable: true,
  },
];
const spendingPeriodsNameMap = {
  'MONTHLY': 'Monthly',
  'ANNUALLY' : 'Annually',
  'TRANSACTION' : 'Each Transaction',
  'FOREVER' : 'Card Lifetime',
};

const CardStates = [
  {
    value: 'OPEN',
    label: 'Open'
  },
  {
    value: 'PAUSED',
    label: 'Paused',
    disable: props.editingCardToken ? false : true,
  },
  {
    value: 'CLOSED',
    label: 'Closed',
    // TODO: have a better way to close a card or explicitly say do it from lithic dashboard
    disable: true,//props.editingCardToken ? false : true,
  }
];
const CardStatesNameMap = {
  'OPEN' : 'Open',
  'PAUSED' : 'Paused',
  'CLOSED' : 'Closed',
};

function getFieldDefault(fieldName: string) {
  if(props.editingCardToken){
    return storeCard[fieldName];
  } else {
    return fieldName === 'state' ? 'OPEN' : props.cardDefaults[fieldName];
  }
}
function isFieldChanged(fieldName: string) {
  return !!changedFields.value.includes(fieldName);
}

watch(() => cardEdits.addTax, (newBoolAddTax) => {
  cardEdits.spend_limit = !newBoolAddTax ? getFieldDefault('spend_limit')/100 :
      calcTax(getFieldDefault('spend_limit')/100);
});

watch(() => cardEdits.tax, () => {
  cardEdits.spend_limit = calcTax(getFieldDefault('spend_limit')/100);
});

function calcTax(initialPrice: string | number) {
  let spendLimit = parseFloat(initialPrice + '');
  let hundredPlusTax = 100 + cardEdits.tax;

  return (spendLimit * hundredPlusTax / 100 ).toFixed(2);
}

function editCard() {
  if(props.editingCardToken){
    storeCards.editCard(props.editingCardToken, cardEdits.spend_limit_duration,
        parseInt(cardEdits.spend_limit.replace('.','')), cardEdits.memo, cardEdits.state);
  } else {
    storeCards.addCard(cardEdits.spend_limit_duration, parseInt(cardEdits.spend_limit.replace('.','')),
        cardEdits.memo, cardEdits.state, props.service_id);
  }
}

</script>
