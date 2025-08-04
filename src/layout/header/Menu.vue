<template>
  <!--begin::Menu wrapper-->
  <Drawer
    class="header-menu align-items-stretch"
    id="kt_header_menu"
    name="header-menu"
    activate="{default: true, lg: false}"
    :toggleButton="'#kt_header_menu_mobile_toggle'"
    data-kt-swapper="true"
    data-kt-swapper-mode="prepend"
    data-kt-swapper-parent="{default: '#kt_body', lg: '#kt_header_nav'}"
  >
    <div
      class="menu menu-lg-rounded menu-column menu-lg-row menu-state-bg menu-title-gray-700 menu-state-title-primary menu-state-icon-primary menu-state-bullet-primary menu-arrow-gray-400 fw-bold my-5 my-lg-0 align-items-stretch"
      id="#kt_header_menu"
      data-kt-menu="true"
    >
      <div class="menu-item me-lg-1">
        <router-link class="menu-link" to="/dashboard" active-class="active">
          <span class="menu-title">Ana Sayfa</span>
        </router-link>
      </div>
      <div class="menu-item me-lg-1">
        <router-link class="menu-link" to="/database" active-class="active">
          <span class="menu-title">Veritabanı Listesi</span>
        </router-link>
      </div>
      <div class="menu-item me-lg-1">
        <router-link class="menu-link" to="/company" active-class="active">
          <span class="menu-title">Şirket Listesi</span>
        </router-link>
      </div>
      <div class="menu-item me-lg-1">
        <router-link class="menu-link" to="/restourant" active-class="active">
          <span class="menu-title">Restoran Listesi</span>
        </router-link>
      </div>
      <div class="menu-item me-lg-1">
        <router-link class="menu-link" to="/istatistik" active-class="active">
          <span class="menu-title">Restoran Istatistiği</span>
        </router-link>
      </div>
      <div class="menu-item me-lg-1">
        <router-link
          class="menu-link"
          to="/istatistik_company"
          active-class="active"
        >
          <span class="menu-title">Şirket İstatistiği</span>
        </router-link>
      </div>
      <div class="menu-item me-lg-1">
        <router-link class="menu-link" to="/income" active-class="active">
          <span class="menu-title">Ödemeler</span>
        </router-link>
      </div>
      <div class="menu-item me-lg-1">
        <router-link class="menu-link" to="/settings" active-class="active">
          <span class="menu-title">Ayarlar</span>
        </router-link>
      </div>
    </div>
  </Drawer>
  <!--end::Menu wrapper-->
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import MainMenuConfig from "@/core/config/MainMenuConfig";
import { headerMenuIcons } from "@/core/helpers/config";
import { version } from "@/core/helpers/documentation";
import Drawer from "@/components/drawer/Drawer.vue";
export default defineComponent({
  name: "KTMenu",
  components: { Drawer },
  setup() {
    const { t, te } = useI18n();
    const route = useRoute();

    const hasActiveChildren = (match) => {
      return route.path.indexOf(match) !== -1;
    };

    const translate = (text) => {
      if (te(text)) {
        return t(text);
      } else {
        return text;
      }
    };

    return {
      hasActiveChildren,
      headerMenuIcons,
      MainMenuConfig,
      translate,
      version,
    };
  },
});
</script>
