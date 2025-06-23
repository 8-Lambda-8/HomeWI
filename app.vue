<template>
  <div class="h-screen w-screen overflow-y-scroll">
    <SwitchBoard />
  </div>
</template>

<script setup lang="ts">
import SwitchBoard from "~/components/SwitchBoard.vue";

onMounted(() => {});
</script>

<style scoped>
/* width */
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: #00000000;
}
::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 5px;
}
::-webkit-scrollbar-thumb:hover {
  background: #444;
}
</style>
