<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "drawer-close-button",
  props: {
    id: {
      type: String,
      default: "drawer-close-button",
      required: true,
    },
  },
  setup() {
    return {};
  },
});
</script>

<template>
  <div class="btn btn-sm btn-icon btn-active-icon-primary" :id="id">
    <span class="svg-icon svg-icon-2x">
      <inline-svg src="media/icons/duotune/arrows/arr061.svg" />
    </span>
  </div>
</template>
