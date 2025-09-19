<template>
  <div
    class="d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-cover bgi-attachment-fixed"
    :style="backgroundStyle"
  >
    <!--begin::Content-->
    <div class="d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20">
      <!--begin::Logo-->
      <div class="text-center mb-12">
        <img
          v-if="companyLogoUrl"
          :src="companyLogoUrl"
          alt="Logo"
          class="text-center h-100px"
        />
        <img
          v-else
          src="media/logos/logo.png"
          alt="Logo"
          class="text-center h-100px opacity-50"
        />
        <h1 class="text-center mt-3">Dermatoloji Kliniği Web Control</h1>
      </div>
      <!--end::Logo-->

      <router-view></router-view>
    </div>
    <!--end::Content-->
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, computed } from "vue";
import { useStore } from "vuex";
import { Actions } from "@/store/enums/StoreEnums";
import CompanyInfoService from "@/services/CompanyInfoService";

export default defineComponent({
  name: "auth-page-layout",
  components: {},
  setup() {
    const store = useStore();
    const companyLogoUrl = ref<string>("");

    const backgroundStyle = computed(() => ({
      backgroundImage:
        "url('https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=2940&auto=format&fit=crop')",
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

    return { companyLogoUrl, backgroundStyle };
  },
});
</script>
