<script lang="ts">
import { defineComponent } from "vue";
import RichContentAlert from "@/components/alerts/RichContentAlert.vue";

export default defineComponent({
  components: {
    RichContentAlert,
  },
});
</script>

<template>
  <RichContentAlert
    title="Erişim Kısıtı"
    text="Erişim izniniz olmayan sayfaya erişmek istediniz"
  >
  </RichContentAlert>
</template>
