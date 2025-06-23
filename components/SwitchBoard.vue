<template>
  <div
    class="l:grid-cols-4 grid h-full w-full grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
  >
    <Switch v-for="sw in switches" :key="sw.name" :sw />
  </div>
</template>

<script setup lang="ts">
import Switch from "~/components/SwitchButton.vue";

import type { SwitchT } from "~/shared/types/types";

let eventSource: EventSource;

const { data: switches } = useFetch<SwitchT[]>("/api/state");

onMounted(() => {
  eventSource = new EventSource("/api/updates");

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    switches.value = data;
  };

  eventSource.onerror = (error) => {
    console.error("EventSource failed:", error);
    eventSource.close();
  };
});
</script>

<style scoped></style>
