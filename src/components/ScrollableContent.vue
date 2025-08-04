<script lang="ts">
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "scrollable-content",
  props: {
    scroll: {
      type: Boolean,
      default: true,
    },
    height: {
      type: String,
      default: "auto",
    },
    maxHeight: {
      type: String,
      default: "auto",
    },
    header: {
      type: String,
      default: null,
    },
    footer: {
      type: String,
      default: null,
    },
    body: {
      type: String,
      default: null,
    },
    offset: {
      type: String,
      default: "0",
    },
  },
  setup(props) {
    const bodyId = computed(() => {
      return props.body ? `${props.body}` : null;
    });
    const getHeight = computed(() => {
      if (props.maxHeight != "auto") {
        return null;
      }
      return props.height;
    });
    const getMaxHeight = computed(() => {
      if (props.height != "auto" && props.maxHeight != "auto") {
        return props.maxHeight;
      }
      if (props.height != "auto" && props.maxHeight == "auto") {
        return null;
      }
      if (props.height == "auto" && props.maxHeight == "auto") {
        return null;
      }
      return props.maxHeight;
    });
    const dependencies = computed(() => {
      if (props.header && props.footer) {
        return `${props.header}, ${props.footer}`;
      }

      if (props.header) {
        return `${props.header}`;
      }

      if (props.footer) {
        return `${props.footer}`;
      }

      return null;
    });
    return { dependencies, bodyId, getHeight, getMaxHeight };
  },
});
</script>

<template>
  <div
    class="scroll-y"
    :data-kt-scroll="scroll"
    :data-kt-scroll-max-height="getMaxHeight"
    :data-kt-scroll-height="getHeight"
    :data-kt-scroll-offset="offset"
    :data-kt-scroll-wrappers="bodyId"
    :data-kt-scroll-dependencies="dependencies"
  >
    <slot></slot>
  </div>
</template>
