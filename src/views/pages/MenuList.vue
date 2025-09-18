<template>
  <div class="row">
    <div class="col-12">
      <!-- Menü Ağaç Yapısı -->
      <MenuTreeView
        v-if="allMenus.length > 0"
        :refresh-trigger="refreshTrigger"
        :menu-data="allMenus"
        @edit="editMenu"
        @delete="deleteMenu"
        @add="createNewMenu"
        @addChild="addChildMenu"
      />

      <!-- Loading State -->
      <div v-else class="d-flex justify-content-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Menüler yükleniyor...</span>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <ModalAddUpdateMenu
      v-if="allMenus.length > 0"
      v-model="selectedMenu"
      :parent-menus="allMenus"
      @submitted="onMenuSubmitted"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
import SwalAlert from "@/core/helpers/swalalert";
import MenuService, { MenuDto } from "@/services/MenuService";
import ModalAddUpdateMenu from "./ModalAddUpdateMenu.vue";
import MenuTreeView from "@/components/MenuTreeView.vue";
import { Modal } from "bootstrap";

// Reactive Data
const allMenus = ref<MenuDto[]>([]);
const selectedMenu = ref<MenuDto>({
  isActive: true,
  isDeleted: false,
  sortOrder: 0,
  isDeletable: true,
  type: 0,
  translations: [],
});
const refreshTrigger = ref<number>(0);

// Methods
const loadAllMenus = async () => {
  try {
    const result = await MenuService.getAll();
    if (result.result) {
      allMenus.value = result.data || [];
    } else {
      SwalAlert.toast(
        "Menüler yüklenirken hata oluştu: " + result.errorMessage,
        "error"
      );
    }
  } catch (error) {
    SwalAlert.toast("Menüler yüklenirken hata oluştu", "error");
  }
};

const createNewMenu = () => {
  if (allMenus.value.length === 0) {
    SwalAlert.toast("Menüler henüz yüklenmedi, lütfen bekleyiniz", "warning");
    return;
  }

  selectedMenu.value = {
    isActive: true,
    isDeleted: false,
    sortOrder: 0,
    isDeletable: true,
    type: 0,
    translations: [],
  };
  showModal();
};

const editMenu = (menu: MenuDto) => {
  if (allMenus.value.length === 0) {
    SwalAlert.toast("Menüler henüz yüklenmedi, lütfen bekleyiniz", "warning");
    return;
  }

  selectedMenu.value = { ...menu };
  showModal();
};

const addChildMenu = (parentMenu: MenuDto) => {
  if (allMenus.value.length === 0) {
    SwalAlert.toast("Menüler henüz yüklenmedi, lütfen bekleyiniz", "warning");
    return;
  }

  selectedMenu.value = {
    isActive: true,
    isDeleted: false,
    sortOrder: 0,
    isDeletable: true,
    type: 0,
    parentId: parentMenu.id,
    translations: [],
  };
  showModal();
};

const deleteMenu = async (menu: MenuDto) => {
  const result = await SwalAlert.confirm({
    title: "Bu menüyü silmek istediğinizden emin misiniz?",
    type: "question",
  });

  if (result.isConfirmed) {
    try {
      const deleteResult = await MenuService.delete(menu.id || "");
      if (deleteResult.result) {
        SwalAlert.toast("Menü başarıyla silindi");
        refreshTrigger.value++;
        await loadAllMenus();
      } else {
        SwalAlert.toast(
          "Menü silinirken hata oluştu: " + deleteResult.errorMessage,
          "error"
        );
      }
    } catch (error) {
      SwalAlert.toast("Menü silinirken hata oluştu", "error");
    }
  }
};

const showModal = () => {
  const modal = new Modal(document.getElementById("kt_modal_add_menu"));
  modal.show();
};

const onMenuSubmitted = async () => {
  refreshTrigger.value++;
  await loadAllMenus();
};

// Lifecycle
onMounted(async () => {
  setCurrentPageBreadcrumbs("Menüler", ["Menü Yönetimi"]);
  await loadAllMenus();
});
</script>

<style scoped>
.content-preview {
  max-width: 300px;
}

.content-html {
  max-height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  font-size: 12px;
  line-height: 1.4;
  color: #6c757d;
}

.content-html :deep(p) {
  margin: 0;
}

.content-html :deep(h1, h2, h3, h4, h5, h6) {
  margin: 0;
  font-size: 12px;
  font-weight: 600;
}

.content-html :deep(ul, ol) {
  margin: 0;
  padding-left: 16px;
}

.content-html :deep(li) {
  margin: 0;
}
</style>
