<template>
  <!--begin::Toolbar wrapper-->
  <div class="d-flex align-items-stretch flex-shrink-0">
    <!--begin::Company Logo-->
    <div class="d-flex align-items-center me-3">
      <div class="company-logo-wrapper">
        <img
          v-if="companyLogoUrl"
          :src="companyLogoUrl"
          alt="Şirket Logosu"
          class="company-logo"
        />
        <div v-else class="company-logo-placeholder">
          <span class="svg-icon svg-icon-2">
            <inline-svg src="media/icons/duotune/general/gen025.svg" />
          </span>
        </div>
      </div>
    </div>
    <!--end::Company Logo-->
    <!--begin::Search-->
    <!-- <div class="d-flex align-items-stretch ms-1 ms-lg-3">
      <KTSearch></KTSearch>
    </div> -->
    <!--end::Search-->

    <!-- <div class="d-flex align-items-center ms-1 ms-lg-3">
      <div
        class="btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px"
        id="kt_activities_toggle"
      >
        <span class="svg-icon svg-icon-1">
          <inline-svg src="media/icons/duotune/general/gen032.svg" />
        </span>
      </div>
    </div> -->

    <!-- <div class="d-flex align-items-center ms-1 ms-lg-3">
      <div
        class="btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px"
        data-kt-menu-trigger="click"
        data-kt-menu-attach="parent"
        data-kt-menu-placement="bottom-end"
        data-kt-menu-flip="bottom"
      >
        <span class="svg-icon svg-icon-1">
          <inline-svg src="media/icons/duotune/general/gen025.svg" />
        </span>
      </div>
      <KTQuickLinksMenu></KTQuickLinksMenu>
    </div> -->

    <!-- <div class="d-flex align-items-center ms-1 ms-lg-3">
      <div
        class="btn btn-icon btn-active-light-primary position-relative w-30px h-30px w-md-40px h-md-40px"
        id="kt_drawer_chat_toggle"
      >
        <span class="svg-icon svg-icon-1">
          <inline-svg src="media/icons/duotune/communication/com012.svg" />
        </span>

        <span
          class="bullet bullet-dot bg-success h-6px w-6px position-absolute translate-middle top-0 start-50 animation-blink"
        >
        </span>
      </div>
    </div> -->

    <!-- <div class="d-flex align-items-center ms-1 ms-lg-3">
      <div
        class="btn btn-icon btn-active-light-primary position-relative w-30px h-30px w-md-40px h-md-40px"
        data-kt-menu-trigger="click"
        data-kt-menu-attach="parent"
        data-kt-menu-placement="bottom-end"
        data-kt-menu-flip="bottom"
      >
        <span class="svg-icon svg-icon-1">
          <inline-svg src="media/icons/duotune/general/gen022.svg" />
        </span>
      </div>
      <KTNotificationsMenu></KTNotificationsMenu>
    </div> -->

    <!--begin::Language Selector-->
    <!-- <div class="d-flex align-items-center ms-1 ms-lg-3">
      <LanguageSelector />
    </div> -->
    <!--end::Language Selector-->

    <!--begin::User-->
    <div
      class="d-flex align-items-center ms-1 ms-lg-3"
      id="kt_header_user_menu_toggle"
    >
      <!--begin::Menu-->
      <div
        class="cursor-pointer symbol symbol-30px symbol-md-40px"
        data-kt-menu-trigger="click"
        data-kt-menu-attach="parent"
        data-kt-menu-placement="bottom-end"
        data-kt-menu-flip="bottom"
      >
        <NameInitials :name="userName" size="normal" />
      </div>
      <KTUserMenu></KTUserMenu>
      <!--end::Menu-->
    </div>
    <!--end::User -->

    <!--begin::Heaeder menu toggle-->
    <div
      class="d-flex align-items-center d-lg-none ms-2 me-n3"
      title="Show header menu"
    >
      <!-- <div
        class="btn btn-icon btn-active-light-primary btn-custom w-30px h-30px w-md-40px h-md-40px"
        id="kt_header_menu_mobile_toggle"
      >
        <span class="svg-icon svg-icon-1">
          <inline-svg src="media/icons/duotune/text/txt001.svg" />
        </span>
      </div> -->
    </div>
    <!--end::Heaeder menu toggle-->
  </div>
  <!--end::Toolbar wrapper-->
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import KTUserMenu from "@/layout/header/partials/UserMenu.vue";
import NameInitials from "@/components/question-note/NameInitials.vue";
// import LanguageSelector from "@/components/LanguageSelector.vue";
import JwtService from "@/core/services/JwtService";

export default defineComponent({
  name: "header-topbar",
  components: {
    KTUserMenu,
    NameInitials,
    // LanguageSelector,
  },
  setup() {
    const store = useStore();
    const userName = JwtService.getUserName() || "";

    const companyLogoUrl = computed(() => {
      return store.getters["CompanyInfoModule/logoUrl"];
    });

    return {
      userName,
      companyLogoUrl,
    };
  },
});
</script>

<style scoped>
.company-logo-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f5f8fa;
  border: 1px solid #e1e3ea;
}

.company-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  max-width: 100%;
  max-height: 100%;
}

.company-logo-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #a1a5b7;
}
</style>
