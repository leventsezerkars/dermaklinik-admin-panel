<template>
  <button
    type="button"
    class="btn pulse-button btn-lg btn-color-primary btn-active-light-primary me-5 pulse pulse-danger"
    data-kt-menu-trigger="click"
    data-kt-menu-placement="bottom-end"
    data-kt-menu-flip="top-end"
  >
    <span class="svg-icon svg-icon-2">
      <inline-svg src="media/icons/duotune/general/gen024.svg" /> Filtrele
    </span>
    <span v-if="filterStatus" class="pulse-ring"></span>
  </button>
  <!--begin::Menu 1-->
  <div
    class="menu menu-sub menu-sub-dropdown w-250px w-md-300px"
    data-kt-menu="true"
  >
    <!--begin::Header-->
    <div class="px-7 py-5">
      <div class="fs-5 text-dark fw-bolder">Filtreler</div>
    </div>
    <!--end::Header-->
    <Seperator />

    <!--begin::Form-->
    <div class="px-7 py-5">
      <!--begin::Input group-->
      <slot></slot>

      <!--begin::Actions-->
      <div class="d-flex justify-content-end">
        <button
          type="reset"
          class="btn btn-sm btn-white btn-active-light-primary me-2"
          @click="$emit('onReset')"
        >
          Resetle
        </button>

        <button
          type="button"
          class="btn btn-sm btn-primary"
          data-kt-menu-dismiss="true"
          @click="$emit('onSubmit')"
        >
          Onayla
        </button>
      </div>
      <!--end::Actions-->
    </div>
    <!--end::Form-->
  </div>
  <!--end::Menu 1-->
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Seperator from "./Seperator.vue";

export default defineComponent({
  name: "filter-dropdown",
  components: { Seperator },
  props: {
    filterStatus: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    return {};
  },
});
</script>
<style scoped>
.pulse-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
