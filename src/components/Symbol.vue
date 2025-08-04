<template>
  <div
    class="symbol symbol-fixed"
    :class="[
      { 'symbol-160px symbol-xl-200px': size == 'large' },
      { 'symbol-100px symbol-lg-160px': size == 'medium' },
      { 'symbol-50px': size == 'small' },
      { [customClass]: true },
    ]"
  >
    <div
      v-if="text"
      class="symbol-label fw-bold text-success"
      :style="{ 'font-size': (size == 'small' ? 1 : sizeCalc) + 'em' }"
    >
      {{ text }}
    </div>
    <img v-if="img" :src="img" alt="image" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "symbol-view",
  props: {
    text: {
      type: String,
      default: "",
    },
    img: String,
    size: {
      type: String as () => "small" | "medium" | "large",
      default: "medium",
    },
    customClass: String,
  },
  setup(props) {
    const sizeCalc = computed(() => {
      return props.text.length > 5 ? "2" : "3";
    });
    return { sizeCalc };
  },
});
</script>
