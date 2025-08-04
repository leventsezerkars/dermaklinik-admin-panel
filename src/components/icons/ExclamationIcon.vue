<template>
  <span class="svg-icon svg-icon-2tx svg-icon-primary me-4">
    <svg
      fill="none"
      viewBox="0 0 24 24"
      height="24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        xmlns="http://www.w3.org/2000/svg"
        opacity="0.3"
        x="2"
        y="2"
        width="20"
        height="20"
        rx="10"
        fill="currentColor"
      ></rect>
      <rect
        xmlns="http://www.w3.org/2000/svg"
        x="11"
        y="14"
        width="7"
        height="2"
        rx="1"
        transform="rotate(-90 11 14)"
        fill="currentColor"
      ></rect>
      <rect
        xmlns="http://www.w3.org/2000/svg"
        x="11"
        y="17"
        width="2"
        height="2"
        rx="1"
        transform="rotate(-90 11 17)"
        fill="currentColor"
      ></rect>
    </svg>
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "exclamation-icon",
  props: {},
});
</script>
