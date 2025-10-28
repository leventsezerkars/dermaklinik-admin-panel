<template>
  <div class="d-flex flex-column flex-root app-root" id="kt_app_root">
    <div class="app-page flex-column flex-column-fluid" id="kt_app_page">
      <div class="app-wrapper flex-column flex-row-fluid" id="kt_app_wrapper">
        <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
          <div class="d-flex flex-column flex-column-fluid">
            <div id="kt_app_content" class="app-content flex-column-fluid">
              <div
                id="kt_app_content_container"
                class="app-container container-fluid"
              >
                <div class="card">
                  <div class="card-header border-0 pt-6">
                    <div class="card-title">
                      <h2>Blog Kategorileri</h2>
                    </div>
                    <div class="card-toolbar">
                      <div
                        class="d-flex justify-content-end"
                        data-kt-user-table-toolbar="base"
                      >
                        <button
                          type="button"
                          class="btn btn-primary"
                          @click="createNewBlogCategory"
                        >
                          <span class="svg-icon svg-icon-2">
                            <inline-svg
                              src="media/icons/duotune/arrows/arr075.svg"
                            />
                          </span>
                          Yeni Kategori Ekle
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="card-body">
                    <AsDataTable
                      ref="blogCategoryDataTableRef"
                      :items="getBlogCategories"
                      :header="blogCategoryTableHeader"
                      :loading="loading"
                      :pagination="pagination"
                      :searchable="true"
                      :exportable="false"
                      @onReset="onFilterReset"
                      @onSort="onSort"
                      @onRowClick="onRowClick"
                      @onPageChange="onPageChange"
                      @onItemsPerPageChange="onItemsPerPageChange"
                    >
                      <template v-slot:cell-actions="{ row }">
                        <div class="d-flex justify-content-end flex-shrink-0">
                          <button
                            type="button"
                            class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                            @click="editBlogCategory(row)"
                            title="Düzenle"
                          >
                            <span class="svg-icon svg-icon-3">
                              <inline-svg
                                src="media/icons/duotune/art/art005.svg"
                              />
                            </span>
                          </button>
                          <button
                            type="button"
                            class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1"
                            @click="deleteBlogCategory(row)"
                            title="Sil"
                          >
                            <span class="svg-icon svg-icon-3">
                              <inline-svg
                                src="media/icons/duotune/general/gen027.svg"
                              />
                            </span>
                          </button>
                        </div>
                      </template>
                      <template v-slot:cell-name="{ row }">
                        <span>{{ getBlogCategoryName(row) }}</span>
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
                      <template v-slot:cell-createdAt="{ row }">
                        <span class="fw-bold">{{
                          formatDate(row.createdAt)
                        }}</span>
                      </template>
                    </AsDataTable>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <ModalAddUpdateBlogCategory
      v-model="selectedBlogCategory"
      @submitted="onBlogCategorySubmitted"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
import AsDataTable from "@/components/AsDataTable.vue";
import SwalAlert from "@/core/helpers/swalalert";
import BlogCategoryService, {
  BlogCategoryDto,
} from "@/services/BlogCategoryService";
import { IPagination, defaultPagination } from "@/core/models/PageModel";
import ModalAddUpdateBlogCategory from "./ModalAddUpdateBlogCategory.vue";
import { Modal } from "bootstrap";

// Table Header
const blogCategoryTableHeader = ref([
  {
    name: "Kategori Adı",
    key: "name",
    sortable: true,
  },
  {
    name: "Durum",
    key: "isActive",
    sortable: true,
  },
  {
    name: "Oluşturulma Tarihi",
    key: "createdAt",
    sortable: true,
  },
  {
    name: "İşlemler",
    key: "actions",
    exportable: false,
  },
]);

// Reactive Data
const blogCategoryDataTableRef = ref<null | typeof AsDataTable>(null);
const loading = ref<boolean>(false);
const blogCategoryTableData = ref<BlogCategoryDto[]>([]);
const selectedBlogCategory = ref<BlogCategoryDto>({
  isActive: true,
  isDeleted: false,
  translations: [],
});
const refreshTrigger = ref<number>(0);

// Pagination
const pagination = ref<IPagination>(defaultPagination);

// Methods
const getBlogCategories = async (model: IPagination = defaultPagination) => {
  try {
    const result = await BlogCategoryService.getAll(model);
    if (result.result) {
      blogCategoryTableData.value = result.data || [];
      pagination.value.total = result.totalCount || 0;
      return result || [];
    } else {
      SwalAlert.toast(
        "Blog kategorileri yüklenirken hata oluştu: " + result.errorMessage,
        "error"
      );
    }
  } catch (error) {
    SwalAlert.toast("Blog kategorileri yüklenirken hata oluştu", "error");
  }
};

const getBlogCategoryName = (blogCategory: BlogCategoryDto) => {
  if (blogCategory.translations && blogCategory.translations.length > 0) {
    const firstTranslation = blogCategory.translations[0];
    return firstTranslation.name || "İsimsiz Kategori";
  }
  return "İsimsiz Kategori";
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("tr-TR");
};

const onFilterReset = () => {
  refresh();
};

const onRowClick = (row: BlogCategoryDto) => {
  editBlogCategory(row);
};

const createNewBlogCategory = () => {
  selectedBlogCategory.value = {
    isActive: true,
    isDeleted: false,
    translations: [],
  };
  showModal();
};

const editBlogCategory = (blogCategory: BlogCategoryDto) => {
  selectedBlogCategory.value = { ...blogCategory };
  showModal();
};

const deleteBlogCategory = async (blogCategory: BlogCategoryDto) => {
  const result = await SwalAlert.confirm({
    title: "Bu blog kategorisini silmek istediğinizden emin misiniz?",
    type: "question",
  });

  if (result.isConfirmed) {
    loading.value = true;
    try {
      const deleteResult = await BlogCategoryService.delete(
        blogCategory.id || ""
      );

      // API'den gelen response'u kontrol et
      // Boş result veya result: true ise başarılı
      if (!deleteResult || deleteResult.result !== false) {
        SwalAlert.toast("Blog kategorisi başarıyla silindi", "success");
        refreshTrigger.value++;
        await refresh();
        // AsDataTable'ı manuel olarak refresh et
        if (blogCategoryDataTableRef.value) {
          blogCategoryDataTableRef.value.refresh();
        }
      } else {
        SwalAlert.toast(
          "Blog kategorisi silinirken hata oluştu: " +
            (deleteResult?.errorMessage || "Bilinmeyen hata"),
          "error"
        );
      }
    } catch (error) {
      console.error("Delete error:", error);
      SwalAlert.toast(
        "Blog kategorisi silinirken hata oluştu: " + error,
        "error"
      );
    } finally {
      loading.value = false;
    }
  }
};

const showModal = () => {
  const modal = new Modal(
    document.getElementById("kt_modal_add_blog_category")
  );
  modal.show();
};

const onBlogCategorySubmitted = async () => {
  console.log("onBlogCategorySubmitted çağrıldı");
  refreshTrigger.value++;
  await refresh();
  // AsDataTable'ı manuel olarak refresh et
  if (blogCategoryDataTableRef.value) {
    blogCategoryDataTableRef.value.refresh();
  }
};

const onPageChange = (page: number) => {
  pagination.value.page = page;
  refresh();
};

const onItemsPerPageChange = (itemsPerPage: number) => {
  pagination.value.take = itemsPerPage;
  pagination.value.page = 1;
  refresh();
};

const onSort = (sortBy: string, sortDesc: boolean) => {
  pagination.value.orderBy = sortBy;
  pagination.value.direction = sortDesc ? "desc" : "asc";
  refresh();
};

const onSearch = (search: string) => {
  pagination.value.search = search;
  pagination.value.page = 1;
  refresh();
};

const refresh = async () => {
  await getBlogCategories(pagination.value);
};

// Lifecycle
onMounted(() => {
  setCurrentPageBreadcrumbs("Blog Kategorileri", ["Blog", "Kategoriler"]);
  getBlogCategories();
});
</script>

<style scoped>
.card {
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 20px 24px;
}

.card-title h2 {
  color: white;
  margin: 0;
  font-weight: 600;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}
</style>
