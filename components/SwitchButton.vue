<template>
  <button
    class="min-h-32 rounded-xl text-4xl font-bold transition-all duration-300 ease-in-out"
    :class="sw.state ? 'bg-green-700' : 'bg-red-700'"
    @click="switchState"
  >
    {{ sw.name }}
  </button>
</template>

<script setup lang="ts">
import type { SwitchT } from "~/shared/types/types";

const props = defineProps<{
  sw: SwitchT;
}>();

function switchState() {
  $fetch("/api/switch", { method: "POST", body: { name: props.sw.name, state: !props.sw.state } });
}
</script>

<style scoped></style>
