<template>
  <div class="row">
    <div class="col-12">
      <!-- Menü Ağaç Yapısı -->
      <MenuTreeView
        :refresh-trigger="refreshTrigger"
        @edit="editMenu"
        @delete="deleteMenu"
      />

      <div class="card">
        <div class="card-header border-0 pt-6">
          <div class="card-title">Menüler</div>
          <div class="card-toolbar">
            <div class="d-flex justify-content-end">
              <button
                type="button"
                class="btn btn-color-success btn-active-light-success"
                @click="createNewMenu()"
              >
                <i class="fas fa-plus"></i>
                Yeni Menü Ekle
              </button>
            </div>
            <div class="d-flex justify-content-end">
              <FilterDropDown
                @onSubmit="onFilter"
                @onReset="onFilterReset"
                :filterStatus="filtered"
              >
                <div class="mb-10">
                  <label class="form-label fw-bold">Aktif:</label>
                  <div>
                    <el-select
                      placeholder="Aktiflik Filtresi"
                      no-data-text="Veri Yok"
                      style="margin-right: 10px"
                      v-model="menuFilterData.isActive"
                    >
                      <el-option label="Seçiniz.." :value="null"></el-option>
                      <el-option key="0" :label="'Aktif'" :value="true" />
                      <el-option key="1" :label="'Pasif'" :value="false" />
                    </el-select>
                  </div>
                </div>
                <div class="mb-10">
                  <label class="form-label fw-bold">Tip:</label>
                  <div>
                    <el-select
                      placeholder="Menü Tipi Filtresi"
                      no-data-text="Veri Yok"
                      style="margin-right: 10px"
                      v-model="menuFilterData.type"
                    >
                      <el-option label="Seçiniz.." :value="null"></el-option>
                      <el-option key="0" label="Sayfa" :value="0" />
                      <el-option key="1" label="Link" :value="1" />
                      <el-option key="2" label="Content" :value="2" />
                      <el-option key="3" label="Kapça" :value="3" />
                    </el-select>
                  </div>
                </div>
              </FilterDropDown>
            </div>
          </div>
        </div>
        <div class="card-body">
          <AsDataTable
            ref="menuDataTableRef"
            :items="getMenus"
            :header="menuTableHeader"
            :loading="loading"
            :pagination="pagination"
            :searchable="true"
            :exportable="true"
            :exportFields="exportFields"
            @onReset="onFilterReset"
            @onSort="onSort"
            @onRowClick="onRowClick"
          >
            <template v-slot:cell-actions="{ row }">
              <div class="d-flex justify-content-end flex-shrink-0">
                <button
                  type="button"
                  class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                  @click="editMenu(row)"
                  title="Düzenle"
                >
                  <span class="svg-icon svg-icon-3">
                    <inline-svg src="media/icons/duotune/art/art005.svg" />
                  </span>
                </button>
                <button
                  v-if="row.isDeletable"
                  type="button"
                  class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1"
                  @click="deleteMenu(row)"
                  title="Sil"
                >
                  <span class="svg-icon svg-icon-3">
                    <inline-svg src="media/icons/duotune/general/gen027.svg" />
                  </span>
                </button>
              </div>
            </template>
            <template v-slot:cell-title="{ row }">
              <span>{{ getMenuTitle(row) }}</span>
            </template>
            <template v-slot:cell-type="{ row }">
              <span
                :class="{
                  'badge badge-light-primary': row.type === 0,
                  'badge badge-light-success': row.type === 1,
                  'badge badge-light-warning': row.type === 2,
                  'badge badge-light-info': row.type === 3,
                }"
              >
                {{ getMenuTypeName(row.type) }}
              </span>
            </template>
            <template v-slot:cell-isActive="{ row }">
              <span
                :class="{
                  'badge badge-light-success': row.isActive,
                  'badge badge-light-danger': !row.isActive,
                }"
              >
                {{ row.isActive ? "Aktif" : "Pasif" }}
              </span>
            </template>
            <template v-slot:cell-sortOrder="{ row }">
              <span class="fw-bold">{{ row.sortOrder }}</span>
            </template>
            <template v-slot:cell-isDeletable="{ row }">
              <span
                :class="{
                  'badge badge-light-success': row.isDeletable,
                  'badge badge-light-danger': !row.isDeletable,
                }"
              >
                {{ row.isDeletable ? "Evet" : "Hayır" }}
              </span>
            </template>
            <template v-slot:cell-content="{ row }">
              <div class="content-preview">
                <div
                  v-if="getMenuContent(row)"
                  v-html="getMenuContent(row)"
                  class="content-html"
                ></div>
                <span v-else class="text-muted">İçerik yok</span>
              </div>
            </template>
          </AsDataTable>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <ModalAddUpdateMenu v-model="selectedMenu" @submitted="onMenuSubmitted" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
import AsDataTable from "@/components/AsDataTable.vue";
import SwalAlert from "@/core/helpers/swalalert";
import MenuService, { MenuDto } from "@/services/MenuService";
import { IPagination, defaultPagination } from "@/core/models/PageModel";
import FilterDropDown from "@/components/data-filter/FilterDropDown.vue";
import ModalAddUpdateMenu from "./ModalAddUpdateMenu.vue";
import MenuTreeView from "@/components/MenuTreeView.vue";
import { Modal } from "bootstrap";

// Table Header
const menuTableHeader = ref([
  {
    name: "Menü Adı",
    key: "title",
    sortable: true,
  },
  {
    name: "Tip",
    key: "type",
    sortable: true,
  },
  {
    name: "Sıralama",
    key: "sortOrder",
    sortable: true,
  },
  {
    name: "Hedef",
    key: "target",
    sortable: true,
  },
  {
    name: "Durum",
    key: "isActive",
    sortable: true,
  },
  {
    name: "Silinebilir",
    key: "isDeletable",
    sortable: true,
  },
  {
    name: "İçerik",
    key: "content",
    sortable: false,
  },
  {
    name: "İşlemler",
    key: "actions",
    exportable: false,
  },
]);

// Export Fields
const exportFields = ref([
  { key: "title", label: "Menü Adı" },
  { key: "type", label: "Tip" },
  { key: "sortOrder", label: "Sıralama" },
  { key: "target", label: "Hedef" },
  { key: "isActive", label: "Durum" },
  { key: "isDeletable", label: "Silinebilir" },
]);

// Reactive Data
const menuDataTableRef = ref<null | typeof AsDataTable>(null);
const loading = ref<boolean>(false);
const menuTableData = ref<MenuDto[]>([]);
const selectedMenu = ref<MenuDto>({
  isActive: true,
  isDeleted: false,
  sortOrder: 0,
  isDeletable: true,
  type: 0,
  translations: [],
});
const filtered = ref<boolean>(false);
const refreshTrigger = ref<number>(0);

// Pagination
const pagination = ref<IPagination>(defaultPagination);

// Filter Data
const menuFilterData = ref({
  isActive: null,
  type: null,
});

// Methods
const getMenus = async (model: IPagination = defaultPagination) => {
  try {
    const result = await MenuService.getAll();
    if (result.result) {
      menuTableData.value = result.entity || [];
      pagination.value.total = result.totalCount || 0;
      return result || [];
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
  selectedMenu.value = { ...menu };
  showModal();
};

const deleteMenu = async (menu: MenuDto) => {
  const result = await SwalAlert.confirm({
    title: "Bu menüyü silmek istediğinizden emin misiniz?",
    type: "question",
  });

  if (result.isConfirmed) {
    loading.value = true;
    try {
      const deleteResult = await MenuService.delete(menu.id || "");
      if (deleteResult.result) {
        SwalAlert.toast("Menü başarıyla silindi");
        refreshTrigger.value++;
        refresh();
      } else {
        SwalAlert.toast(
          "Menü silinirken hata oluştu: " + deleteResult.errorMessage,
          "error"
        );
      }
    } catch (error) {
      SwalAlert.toast("Menü silinirken hata oluştu", "error");
    } finally {
      loading.value = false;
    }
  }
};

const showModal = () => {
  const modal = new Modal(document.getElementById("kt_modal_add_menu"));
  modal.show();
};

const onMenuSubmitted = async () => {
  refreshTrigger.value++;
  await refresh();
};

const onFilter = (filters: any) => {
  menuFilterData.value = { ...filters };
  filtered.value = true;
  refresh();
};

const onFilterReset = () => {
  menuFilterData.value = {
    isActive: null,
    type: null,
  };
  filtered.value = false;
  refresh();
};

const onSort = (sort: any) => {
  pagination.value.orderBy = sort.key;
  pagination.value.direction = sort.direction;
  refresh();
};

const onRowClick = (row: MenuDto) => {
  editMenu(row);
};
const getMenuTitle = (menu: MenuDto) => {
  // API'den gelen menuTranslations'ı kontrol et
  const translations = menu.translations;
  const translation = translations?.[0];
  return translation?.title || "Başlıksız";
};

const getMenuTypeName = (type: number): string => {
  switch (type) {
    case 0:
      return "Sayfa";
    case 1:
      return "Link";
    case 2:
      return "Content";
    case 3:
      return "Kapça";
    default:
      return "Bilinmiyor";
  }
};

const getMenuContent = (menu: MenuDto): string => {
  const translations = menu.translations;
  const translation = translations?.[0];
  if (translation?.content) {
    // HTML tag'lerini kaldır ve sadece metni al
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = translation.content;
    const textContent = tempDiv.textContent || tempDiv.innerText || "";
    return textContent.length > 100
      ? textContent.substring(0, 100) + "..."
      : textContent;
  }
  return "";
};

const refresh = () => {
  if (menuDataTableRef.value) menuDataTableRef.value.refresh();
};
// Lifecycle
onMounted(() => {
  setCurrentPageBreadcrumbs("Menüler", ["Menü Yönetimi"]);
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
