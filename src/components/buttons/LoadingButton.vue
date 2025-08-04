<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "loading-button",
  props: {
    loading: Boolean,
    title: String,
    type: String,
    classes: String,
    onClick: {
      type: Function,
      required: false,
    },
  },
  setup() {
    return {};
  },
});
</script>

<template>
  <button
    :data-kt-indicator="loading ? 'on' : null"
    :class="classes"
    :type="type ? type : 'button'"
    @click="onClick"
    :disabled="loading"
  >
    <span v-if="!loading" class="indicator-label">
      {{ title }}
      <span class="svg-icon svg-icon-3 ms-2 me-0">
        <inline-svg src="media/icons/duotune/arrows/arr064.svg"
      /></span>
    </span>
    <span v-if="loading" class="indicator-progress">
      Bekleyiniz...
      <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
    </span>
  </button>
</template>
