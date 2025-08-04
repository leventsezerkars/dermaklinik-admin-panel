<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "drawer-content",
  props: {
    name: {
      type: Boolean,
      default: true,
      required: true,
    },
    direction: {
      type: String,
      default: "end",
    },
    toggleButton: {
      type: String,
      required: true,
    },
    closeButton: {
      type: String,
      required: true,
    },
    width: {
      type: String,
      default: "{default:'70%', 'md': '50%'}",
    },
    activate: {
      type: String,
      default: "true",
    },
  },
  setup() {
    return {};
  },
});
</script>

<template>
  <div
    data-kt-drawer="true"
    data-kt-drawer-overlay="true"
    :data-kt-drawer-activate="activate"
    :data-kt-drawer-width="width"
    :data-kt-drawer-name="name"
    :data-kt-drawer-direction="direction"
    :data-kt-drawer-toggle="toggleButton"
    :data-kt-drawer-close="closeButton"
  >
    <slot></slot>
  </div>
</template>
