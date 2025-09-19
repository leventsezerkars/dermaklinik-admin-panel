<template>
  <div
    class="d-flex flex-column flex-column-fluid position-relative bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-cover bgi-attachment-fixed"
    :style="backgroundStyle"
  >
    <div
      class="position-absolute top-0 start-0 w-100 h-100"
      style="background: rgba(0, 20, 30, 0.35)"
    ></div>
    <!--begin::Content-->
    <div class="d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20">
      <!--begin::Logo-->
      <div class="text-center mb-12" v-if="!isSignIn">
        <img
          v-if="companyLogoUrl"
          :src="companyLogoUrl"
          alt="Logo"
          class="text-center h-100px rounded-circle bg-white p-2 shadow-sm"
        />
        <img
          v-else
          src="media/logos/logo.png"
          alt="Logo"
          class="text-center h-100px opacity-50"
        />
        <h1 class="text-center mt-3 text-white text-shadow">
          Dermatoloji Kliniği Web Control
        </h1>
      </div>
      <!--end::Logo-->

      <router-view></router-view>
    </div>
    <!--end::Content-->
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { Actions } from "@/store/enums/StoreEnums";
import CompanyInfoService from "@/services/CompanyInfoService";

export default defineComponent({
  name: "auth-page-layout",
  components: {},
  setup() {
    const store = useStore();
    const companyLogoUrl = ref<string>("");
    const route = useRoute();

    const backgroundStyle = computed(() => ({
      backgroundImage:
        "url('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2940&auto=format&fit=crop')",
      filter: "none",
    }));

    onMounted(() => {
      store.dispatch(Actions.ADD_BODY_CLASSNAME, "bg-body");
      // Şirket logosunu aktif kayıttan çek
      CompanyInfoService.getActiveSingle()
        .then((res) => {
          const url = (res?.data as any)?.logoUrl;
          if (url) companyLogoUrl.value = url;
        })
        .catch(() => {
          // ignore
        });
    });

    onUnmounted(() => {
      store.dispatch(Actions.REMOVE_BODY_CLASSNAME, "bg-body");
    });

    const isSignIn = computed(() => route.name === "sign-in");

    return { companyLogoUrl, backgroundStyle, isSignIn };
  },
});
</script>
