<template>
  <div
    class="modal fade"
    id="kt_modal_add_blog_category"
    ref="addBlogCategoryModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content rounded">
        <div class="modal-header" id="kt_modal_add_blog_category_header">
          <h2>
            {{
              isEdit
                ? "Blog Kategorisi Düzenle"
                : "Yeni Blog Kategorisi Oluştur"
            }}
          </h2>
          <div
            data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary"
          >
            <span class="svg-icon svg-icon-1">
              <inline-svg src="media/icons/duotune/arrows/arr061.svg" />
            </span>
          </div>
        </div>
        <Form @submit="onSubmit" class="form" ref="formRef">
          <div class="modal-body py-10 px-lg-17">
            <div class="me-n7 pe-7" id="kt_modal_add_blog_category_scroll">
              <!-- Genel Bilgiler -->
              <div class="row mb-8">
                <div class="col-12">
                  <div class="form-check form-switch">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="blogCategoryModel.isActive"
                      id="isActive"
                    />
                    <label class="form-check-label" for="isActive">
                      Aktif
                    </label>
                  </div>
                </div>
              </div>

              <!-- Dil Tabları -->
              <div class="row">
                <div class="col-12">
                  <h4 class="mb-4">Dil İçerikleri</h4>

                  <!-- Tab Navigation -->
                  <ul
                    class="nav nav-tabs nav-line-tabs mb-5 fs-6"
                    role="tablist"
                  >
                    <li
                      v-for="(language, index) in languages"
                      :key="language.id"
                      class="nav-item"
                      role="presentation"
                    >
                      <button
                        class="nav-link"
                        :class="{ active: activeTab === index }"
                        @click="setActiveTab(index)"
                        type="button"
                        role="tab"
                      >
                        <img
                          :src="getFlagUrl(language.code)"
                          :alt="language.name"
                          class="flag-icon me-2"
                          width="16"
                          height="12"
                        />
                        {{ language.name }}
                      </button>
                    </li>
                  </ul>

                  <!-- Tab Content -->
                  <div class="tab-content">
                    <div
                      v-for="(language, index) in languages"
                      :key="language.id"
                      class="tab-pane fade"
                      :class="{ 'show active': activeTab === index }"
                      role="tabpanel"
                    >
                      <div class="row">
                        <div class="col-12">
                          <div class="fv-row mb-7">
                            <label class="required fs-6 fw-bold mb-2">
                              {{ language.name }} Kategori Adı
                            </label>
                            <input
                              v-model="
                                getTranslationByLanguage(language.id).name
                              "
                              type="text"
                              class="form-control"
                              :placeholder="`${language.name} kategori adı`"
                            />
                            <small class="text-muted">
                              Minimum 3 karakter olmalıdır
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer flex-center">
            <button type="button" class="btn btn-lg" data-bs-dismiss="modal">
              İptal
            </button>
            <button
              :data-kt-indicator="loading ? 'on' : null"
              class="btn btn-lg btn-primary"
              type="submit"
              :disabled="loading"
            >
              <span v-if="!loading" class="indicator-label">
                {{ isEdit ? "Güncelle" : "Kaydet" }}
                <span class="svg-icon svg-icon-3 ms-2 me-0">
                  <inline-svg src="media/icons/duotune/arrows/arr064.svg" />
                </span>
              </span>
              <span v-if="loading" class="indicator-progress">
                Bekleyiniz...
                <span
                  class="spinner-border spinner-border-sm align-middle ms-2"
                ></span>
              </span>
            </button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, computed, defineEmits, watch, onMounted } from "vue";
import { Form } from "vee-validate";
import { useStore } from "vuex";
import SwalAlert from "@/core/helpers/swalalert";
import { hideModal } from "@/core/helpers/dom";
import BlogCategoryService, {
  BlogCategoryDto,
  CreateBlogCategoryDto,
  UpdateBlogCategoryDto,
} from "@/services/BlogCategoryService";
import { getFlagUrl } from "@/core/helpers/languageHelper";

const store = useStore();
const addBlogCategoryModalRef = ref<null | HTMLElement>(null);
const formRef = ref<null | HTMLElement>(null);
const loading = ref<boolean>(false);
const activeTab = ref<number>(0);

const emitted = defineEmits(["submitted", "update:modelValue"]);

const props = defineProps({
  modelValue: {
    type: Object as () => BlogCategoryDto,
    default: () => ({}),
  },
});

const isEdit = computed(() => !!blogCategoryModel.value.id);
const languages = computed(() => store.getters["LanguageModule/languages"]);

const blogCategoryModel = computed({
  get: () => {
    const model = { ...props.modelValue };

    if (!model.translations || model.translations.length === 0) {
      model.translations = languages.value.map((lang) => ({
        id: undefined,
        isActive: true,
        isDeleted: false,
        blogCategoryId: model.id || null,
        languageId: lang.id || "",
        name: "",
      }));
    }
    return model;
  },
  set: (value) => emitted("update:modelValue", value),
});

const getTranslationByLanguage = (languageId: string) => {
  let translation = blogCategoryModel.value.translations?.find(
    (t) => t.languageId === languageId
  );
  if (!translation) {
    translation = {
      id: undefined,
      isActive: true,
      isDeleted: false,
      blogCategoryId: blogCategoryModel.value.id || null,
      languageId: languageId,
      name: "",
    };
    if (!blogCategoryModel.value.translations) {
      blogCategoryModel.value.translations = [];
    }
    blogCategoryModel.value.translations.push(translation);
  }
  return translation;
};

const setActiveTab = (index: number) => {
  activeTab.value = index;
};

watch(
  () => props.modelValue,
  () => {
    if (!blogCategoryModel.value.id) {
      activeTab.value = 0;
    }
  }
);

watch(
  () => languages.value,
  () => {
    if (languages.value.length > 0) {
      const existingTranslations = blogCategoryModel.value.translations || [];
      const newTranslations = languages.value.map((lang) => {
        const existing = existingTranslations.find(
          (t) => t.languageId === lang.id
        );
        return (
          existing || {
            id: undefined,
            isActive: true,
            isDeleted: false,
            blogCategoryId: blogCategoryModel.value.id || null,
            languageId: lang.id || "",
            name: "",
          }
        );
      });
      blogCategoryModel.value.translations = newTranslations;
    }
  },
  { immediate: true }
);

// Form validasyon fonksiyonu
const validateForm = (): boolean => {
  // Dil bazlı içerik kontrolleri
  const missingLanguagesSet = new Set<string>();
  const shortNames: string[] = [];

  languages.value.forEach((language) => {
    const translation = getTranslationByLanguage(language.id);

    // Kategori adı kontrolü (minimum 3 karakter)
    if (!translation.name || translation.name.trim().length < 3) {
      shortNames.push(language.name);
    }

    // Eğer kategori adı boşsa eksik dil olarak işaretle
    if (!translation.name || translation.name.trim() === "") {
      missingLanguagesSet.add(language.name);
    }
  });

  // Set'i array'e çevir
  const missingLanguages = Array.from(missingLanguagesSet);

  // Eksik dil içerikleri kontrolü
  if (missingLanguages.length > 0) {
    SwalAlert.toast(
      `Aşağıdaki dillerde kategori adı eksik: ${missingLanguages.join(", ")}`,
      "warning"
    );
    return false;
  }

  // Kısa kategori adı kontrolü
  if (shortNames.length > 0) {
    SwalAlert.toast(
      `Aşağıdaki dillerde kategori adı en az 3 karakter olmalı: ${shortNames.join(
        ", "
      )}`,
      "warning"
    );
    return false;
  }

  return true;
};

const onSubmit = async (values: any) => {
  // Validasyon kontrolleri
  if (!validateForm()) {
    return;
  }

  const apiValues = { ...blogCategoryModel.value, ...values };
  loading.value = true;

  try {
    let data;
    if (isEdit.value) {
      data = await BlogCategoryService.update(
        apiValues as UpdateBlogCategoryDto
      );
    } else {
      data = await BlogCategoryService.create(
        apiValues as CreateBlogCategoryDto
      );
    }

    if (data.result) {
      SwalAlert.toast("İşlem Başarılı", "success");
      hideModal(addBlogCategoryModalRef.value);
      emitted("submitted");
    } else {
      SwalAlert.toast("Hata Oluştu! " + data.errorMessage, "error");
    }
  } catch (error) {
    SwalAlert.toast("İşlem sırasında hata oluştu", "error");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  // Component mounted
});
</script>

<style scoped>
.flag-icon {
  border-radius: 2px;
  object-fit: cover;
}

.nav-tabs .nav-link {
  border: none;
  border-bottom: 2px solid transparent;
  color: #6c757d;
  font-weight: 500;
}

.nav-tabs .nav-link.active {
  border-bottom-color: #009ef7;
  color: #009ef7;
}

.nav-tabs .nav-link:hover {
  border-bottom-color: #009ef7;
  color: #009ef7;
}

/* Modal boyutunu ayarla */
.modal-dialog {
  max-width: 650px !important;
}

/* Tab içeriği için scroll */
.tab-content {
  max-height: 400px;
  overflow-y: auto;
}

.tab-content::-webkit-scrollbar {
  width: 6px;
}

.tab-content::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.tab-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.tab-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
