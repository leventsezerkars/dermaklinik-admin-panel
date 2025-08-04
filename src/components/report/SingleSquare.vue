<template>
  <div
    class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3"
  >
    <div class="d-flex align-items-center">
      <div class="fs-2 fw-bold">
        {{ value }}
      </div>
    </div>
    <div class="fw-semobold fs-6 text-gray-400">{{ text }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "single-square",
  props: {
    text: String,
    value: String,
  },
  setup() {
    return {};
  },
});
</script>
