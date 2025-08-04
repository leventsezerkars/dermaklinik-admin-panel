<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "modal-close",
  setup() {
    return {};
  },
});
</script>

<template>
  <button type="button" class="btn btn-lg" data-bs-dismiss="modal">
    İptal
  </button>
</template>
