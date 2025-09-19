<template>
  <!--begin::Header-->
  <div id="kt_header" style="" class="header align-items-stretch">
    <!--begin::Container-->
    <div
      :class="{
        'container-fluid': headerWidthFluid,
        'container-xxl': !headerWidthFluid,
      }"
      class="d-flex align-items-stretch justify-content-between"
    >
      <!--begin::Aside mobile toggle-->
      <div
        class="d-flex align-items-center d-lg-none ms-n3 me-1"
        title="Show aside menu"
      >
        <div
          class="btn btn-icon btn-active-light-primary"
          id="kt_aside_mobile_toggle"
        >
          <span class="svg-icon svg-icon-2x mt-1">
            <inline-svg src="media/icons/duotune/abstract/abs015.svg" />
          </span>
        </div>
      </div>
      <!--end::Aside mobile toggle-->

      <!--begin::Mobile logo (hidden as requested) -->
      <div class="d-flex align-items-center flex-grow-1 flex-lg-grow-0 d-none">
        <a href="#">
          <img
            :alt="companyName"
            :src="logoUrl || 'media/logos/logo.png'"
            class="h-30px"
          />
        </a>
      </div>
      <!--end::Mobile logo-->

      <!--begin::Wrapper-->
      <div
        class="d-flex align-items-stretch justify-content-between flex-lg-grow-1"
      >
        <!--begin::Navbar-->
        <div class="d-flex align-items-stretch" id="kt_header_nav">
          <KTMenu></KTMenu>
        </div>
        <!--end::Navbar-->

        <!--begin::Topbar-->
        <div class="d-flex flex-shrink-0">
          <button class="btn btn-light-danger" @click="confirmLogout">
            Çıkış Yap
          </button>
        </div>
        <!--end::Topbar-->
      </div>
      <!--end::Wrapper-->
    </div>
    <!--end::Container-->
  </div>
  <!--end::Header-->
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import KTTopbar from "@/layout/header/Topbar.vue";
import KTMenu from "@/layout/header/Menu.vue";
import { Actions } from "@/store/enums/StoreEnums";
import Swal from "sweetalert2/dist/sweetalert2.min.js";

import {
  headerWidthFluid,
  headerLeft,
  asideDisplay,
} from "@/core/helpers/config";

export default defineComponent({
  name: "KTHeader",
  props: {
    title: String,
  },
  components: {
    KTMenu,
  },
  setup() {
    const store = useStore();

    const logoUrl = computed(() => store.getters["CompanyInfoModule/logoUrl"]);
    const companyName = computed(
      () => store.getters["CompanyInfoModule/companyName"]
    );

    const logout = async () => {
      await store.dispatch(Actions.LOGOUT, true);
    };

    const confirmLogout = async () => {
      const result = await Swal.fire({
        title: "Çıkış yapılsın mı?",
        text: "Oturumunuz kapatılacak.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Evet",
        cancelButtonText: "Vazgeç",
        buttonsStyling: false,
        customClass: {
          confirmButton: "btn btn-danger me-3",
          cancelButton: "btn btn-light",
        },
      });
      if (result.isConfirmed) {
        await logout();
      }
    };

    return {
      headerWidthFluid,
      headerLeft,
      asideDisplay,
      logoUrl,
      companyName,
      logout,
      confirmLogout,
    };
  },
});
</script>
