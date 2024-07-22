<script lang="ts">
import { defineComponent } from 'vue';
import BingoBoard from './BingoBoard.vue';

export default defineComponent({
  name: 'App',
  components: {
    BingoBoard,
  },
});
</script>

<template>
  <v-app>
    <v-main class="w-auto">
      <v-container class="h-screen w-auto d-flex flex-column justify-center align-center">
        <BingoBoard />
      </v-container>
    </v-main>
  </v-app>
</template>
