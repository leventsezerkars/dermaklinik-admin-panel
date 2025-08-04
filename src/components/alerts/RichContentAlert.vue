<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
});
</script>
<template>
  <div
    class="alert alert-dismissible bg-light-danger d-flex flex-center flex-column py-10 px-10 px-lg-20 mb-10"
  >
    <span class="svg-icon svg-icon-5tx svg-icon-danger mb-5">
      <inline-svg src="media/icons/duotune/general/gen044.svg" />
    </span>
    <div class="text-center text-dark">
      <h1 class="fw-bolder mb-5">{{ title }}</h1>
      <div
        class="separator separator-dashed border-danger opacity-25 mb-5"
      ></div>
      <div class="mb-9">
        {{ text }}
      </div>
      <div class="d-flex flex-center flex-wrap">
        <slot name="buttons"></slot>
      </div>
    </div>
  </div>
</template>
