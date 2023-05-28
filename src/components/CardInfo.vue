<template>
  <div>
    Virtual Card: {{props.card.memo}}
    <br/>
    Expires: {{props.card.exp_month}}/{{props.card.exp_year}}
    <br/>
    Status: {{ props.card.state.charAt(0) + props.card.state.substring(1).toLowerCase() }}
    <br/>
    XXXX-XXXX-XXXX-{{props.card.last_four}}
  </div>
</template>

<script setup lang="ts">
const props = defineProps(['card'])
</script>
