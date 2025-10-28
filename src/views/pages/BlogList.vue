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
                      <h2>Blog Yazıları</h2>
                    </div>
                    <div class="card-toolbar">
                      <div
                        class="d-flex justify-content-end"
                        data-kt-user-table-toolbar="base"
                      >
                        <button
                          type="button"
                          class="btn btn-primary"
                          @click="createNewBlog"
                        >
                          <span class="svg-icon svg-icon-2">
                            <inline-svg
                              src="media/icons/duotune/arrows/arr075.svg"
                            />
                          </span>
                          Yeni Blog Ekle
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="card-body">
                    <AsDataTable
                      ref="blogDataTableRef"
                      :items="getBlogs"
                      :header="blogTableHeader"
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
                            @click="editBlog(row)"
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
                            @click="deleteBlog(row)"
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
                      <template v-slot:cell-title="{ row }">
                        <span>{{ getBlogTitle(row) }}</span>
                      </template>
                      <template v-slot:cell-categoryName="{ row }">
                        <span class="fw-bold">{{
                          row.categoryName || "Kategorisiz"
                        }}</span>
                      </template>
                      <template v-slot:cell-viewCount="{ row }">
                        <span class="fw-bold">{{ row.viewCount || 0 }}</span>
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
    <ModalAddUpdateBlog v-model="selectedBlog" @submitted="onBlogSubmitted" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
import AsDataTable from "@/components/AsDataTable.vue";
import SwalAlert from "@/core/helpers/swalalert";
import BlogService, { BlogDto } from "@/services/BlogService";
import { IPagination, defaultPagination } from "@/core/models/PageModel";
import ModalAddUpdateBlog from "./ModalAddUpdateBlog.vue";
import { Modal } from "bootstrap";
import { useStore } from "vuex";

// Store
const store = useStore();

// Table Header
const blogTableHeader = ref([
  {
    name: "Başlık",
    key: "title",
    sortable: true,
  },
  {
    name: "Kategori",
    key: "categoryName",
    sortable: true,
  },
  {
    name: "Görüntülenme",
    key: "viewCount",
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
const blogDataTableRef = ref<null | typeof AsDataTable>(null);
const loading = ref<boolean>(false);
const blogTableData = ref<BlogDto[]>([]);
const selectedBlog = ref<BlogDto>({
  categoryId: "",
  isActive: true,
  isDeleted: false,
  translations: [],
});
const refreshTrigger = ref<number>(0);

// Pagination
const pagination = ref<IPagination>(defaultPagination);

// Methods
const getBlogs = async (model: IPagination = defaultPagination) => {
  try {
    const result = await BlogService.getAll(model);
    if (result.result) {
      blogTableData.value = result.data || [];
      pagination.value.total = result.totalCount || 0;
      return result || [];
    } else {
      SwalAlert.toast(
        "Blog yazıları yüklenirken hata oluştu: " + result.errorMessage,
        "error"
      );
    }
  } catch (error) {
    SwalAlert.toast("Blog yazıları yüklenirken hata oluştu", "error");
  }
};

const getBlogTitle = (blog: BlogDto) => {
  if (blog.translations && blog.translations.length > 0) {
    const firstTranslation = blog.translations[0];
    return firstTranslation.title || "İsimsiz Blog";
  }
  return "İsimsiz Blog";
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("tr-TR");
};

const onFilterReset = () => {
  refresh();
};

const onRowClick = (row: BlogDto) => {
  editBlog(row);
};

const createNewBlog = () => {
  selectedBlog.value = {
    categoryId: "",
    isActive: true,
    isDeleted: false,
    translations: [],
  };
  showModal();
};

const editBlog = (blog: BlogDto) => {
  selectedBlog.value = { ...blog };
  showModal();
};

const deleteBlog = async (blog: BlogDto) => {
  const result = await SwalAlert.confirm({
    title: "Bu blog yazısını silmek istediğinizden emin misiniz?",
    type: "question",
  });

  if (result.isConfirmed) {
    loading.value = true;
    try {
      const deleteResult = await BlogService.delete(blog.id || "");

      // API'den gelen response'u kontrol et
      // Boş result veya result: true ise başarılı
      if (!deleteResult || deleteResult.result !== false) {
        SwalAlert.toast("Blog yazısı başarıyla silindi", "success");
        refreshTrigger.value++;
        await refresh();
      } else {
        SwalAlert.toast(
          "Blog yazısı silinirken hata oluştu: " +
            (deleteResult?.errorMessage || "Bilinmeyen hata"),
          "error"
        );
      }
    } catch (error) {
      console.error("Delete error:", error);
      SwalAlert.toast("Blog yazısı silinirken hata oluştu: " + error, "error");
    } finally {
      loading.value = false;
    }
  }
};

const showModal = () => {
  const modal = new Modal(document.getElementById("kt_modal_add_blog"));
  modal.show();
};

const onBlogSubmitted = async () => {
  console.log("onBlogSubmitted çağrıldı");
  refreshTrigger.value++;
  await refresh();
  // AsDataTable'ı manuel olarak refresh et
};

const onPageChange = (page: number) => {
  pagination.value.page = page;
  refresh();
};

const onSort = (sortBy: string, sortDesc: boolean) => {
  pagination.value.orderBy = sortBy;
  pagination.value.direction = sortDesc ? "desc" : "asc";
  refresh();
};

const onSearch = (search: string) => {
  pagination.value.search = search;
  pagination.value.page = 0; // Sayfa 0'dan başlamalı
  refresh();
};

const onItemsPerPageChange = (itemsPerPage: number) => {
  pagination.value.take = itemsPerPage;
  pagination.value.page = 0; // Sayfa 0'dan başlamalı
  refresh();
};

const refresh = async () => {
  if (blogDataTableRef.value) {
    blogDataTableRef.value.refresh();
  }
};

// Lifecycle
onMounted(async () => {
  setCurrentPageBreadcrumbs("Blog Yazıları", ["Blog", "Yazılar"]);

  // Language store'u başlat
  await store.dispatch("LanguageModule/initializeLanguage");

  // Blog yazılarını yükle
  await getBlogs();
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
