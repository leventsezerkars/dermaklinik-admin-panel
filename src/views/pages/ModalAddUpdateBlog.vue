<template>
  <div
    class="modal fade"
    id="kt_modal_add_blog"
    ref="addBlogModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-1000px">
      <div class="modal-content rounded">
        <div class="modal-header" id="kt_modal_add_blog_header">
          <h2>
            {{ isEdit ? "Blog Yazısı Düzenle" : "Yeni Blog Yazısı Oluştur" }}
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
            <div class="me-n7 pe-7" id="kt_modal_add_blog_scroll">
              <!-- Genel Bilgiler -->
              <div class="row mb-8">
                <div class="col-6">
                  <div class="fv-row mb-7">
                    <label class="required fs-6 fw-bold mb-2">Kategori</label>
                    <Field
                      name="categoryId"
                      v-model="blogModel.categoryId"
                      v-slot="{ field, value, handleChange }"
                    >
                      <el-select
                        placeholder="Kategori seçiniz"
                        no-data-text="Veri Yok"
                        v-bind="field"
                        :model-value="value"
                        @update:model-value="handleChange"
                      >
                        <el-option
                          v-for="category in blogCategories"
                          :key="category.id"
                          :label="getCategoryName(category)"
                          :value="category.id"
                        />
                      </el-select>
                    </Field>
                    <div class="fv-plugins-message-container">
                      <div class="fv-help-block">
                        <ErrorMessage name="categoryId" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="form-check form-switch">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="blogModel.isActive"
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
                        <div class="col-6">
                          <div class="fv-row mb-7">
                            <label class="required fs-6 fw-bold mb-2">
                              {{ language.name }} Başlık
                            </label>
                            <input
                              v-model="
                                getTranslationByLanguage(language.id).title
                              "
                              type="text"
                              class="form-control"
                              :placeholder="`${language.name} başlık`"
                            />
                          </div>
                        </div>
                        <div class="col-6">
                          <div class="fv-row mb-7">
                            <label class="required fs-6 fw-bold mb-2">
                              {{ language.name }} Slug
                            </label>
                            <input
                              v-model="
                                getTranslationByLanguage(language.id).slug
                              "
                              type="text"
                              class="form-control"
                              :placeholder="`${language.name} slug`"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-12">
                          <div class="fv-row mb-7">
                            <label class="fs-6 fw-bold mb-2">
                              {{ language.name }} SEO Başlık
                            </label>
                            <input
                              v-model="
                                getTranslationByLanguage(language.id).seoTitle
                              "
                              type="text"
                              class="form-control"
                              :placeholder="`${language.name} SEO başlık`"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-12">
                          <div class="fv-row mb-7">
                            <label class="fs-6 fw-bold mb-2">
                              {{ language.name }} SEO Açıklama
                            </label>
                            <textarea
                              v-model="
                                getTranslationByLanguage(language.id)
                                  .seoDescription
                              "
                              class="form-control"
                              rows="3"
                              :placeholder="`${language.name} SEO açıklama`"
                            ></textarea>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-12">
                          <div class="fv-row mb-7">
                            <label class="fs-6 fw-bold mb-2">
                              {{ language.name }} SEO Anahtar Kelimeler
                            </label>
                            <input
                              v-model="
                                getTranslationByLanguage(language.id)
                                  .seoKeywords
                              "
                              type="text"
                              class="form-control"
                              :placeholder="`${language.name} anahtar kelimeler, virgülle ayrılmış`"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-4">
                          <div class="fv-row mb-7">
                            <label class="fs-6 fw-bold mb-2">
                              {{ language.name }} Öne Çıkan Resim
                            </label>
                            <input
                              v-model="
                                getTranslationByLanguage(language.id)
                                  .featuredImage
                              "
                              type="text"
                              class="form-control"
                              :placeholder="`${language.name} resim URL`"
                            />
                          </div>
                        </div>
                        <div class="col-4">
                          <div class="fv-row mb-7">
                            <label class="fs-6 fw-bold mb-2">
                              {{ language.name }} Video URL
                            </label>
                            <input
                              v-model="
                                getTranslationByLanguage(language.id).videoUrl
                              "
                              type="text"
                              class="form-control"
                              :placeholder="`${language.name} video URL`"
                            />
                          </div>
                        </div>
                        <div class="col-4">
                          <div class="fv-row mb-7">
                            <label class="fs-6 fw-bold mb-2">
                              {{ language.name }} Doküman URL
                            </label>
                            <input
                              v-model="
                                getTranslationByLanguage(language.id)
                                  .documentUrl
                              "
                              type="text"
                              class="form-control"
                              :placeholder="`${language.name} doküman URL`"
                            />
                          </div>
                        </div>
                      </div>

                      <!-- İçerik Editörü -->
                      <div class="row">
                        <div class="col-12">
                          <div class="fv-row mb-7">
                            <label class="required fs-6 fw-bold mb-2">
                              {{ language.name }} İçerik
                            </label>
                            <div class="content-editor-wrapper">
                              <TinyEditor
                                :key="`editor-${language.id}-${activeTab}`"
                                v-model="
                                  getTranslationByLanguage(language.id).content
                                "
                                size="medium"
                                :append-init="{
                                  placeholder: `${language.name} içerik yazın...`,
                                  branding: false,
                                  elementpath: false,
                                  resize: false,
                                  statusbar: false,
                                }"
                              />
                            </div>
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
import { ErrorMessage, Field, Form } from "vee-validate";
import { useStore } from "vuex";
import SwalAlert from "@/core/helpers/swalalert";
import { hideModal } from "@/core/helpers/dom";
import BlogService, {
  BlogDto,
  CreateBlogDto,
  UpdateBlogDto,
  CreateBlogTranslationDto,
} from "@/services/BlogService";
import BlogCategoryService, {
  BlogCategoryDto,
} from "@/services/BlogCategoryService";
import { LanguageDto } from "@/services/LanguageService";
import { getFlagUrl } from "@/core/helpers/languageHelper";
import TinyEditor from "@/components/TinyEditor.vue";

const store = useStore();
const addBlogModalRef = ref<null | HTMLElement>(null);
const formRef = ref<null | HTMLElement>(null);
const loading = ref<boolean>(false);
const blogCategories = ref<BlogCategoryDto[]>([]);
const activeTab = ref<number>(0);

const emitted = defineEmits(["submitted", "update:modelValue"]);

const props = defineProps({
  modelValue: {
    type: Object as () => BlogDto,
    default: () => ({}),
  },
});

const isEdit = computed(() => !!blogModel.value.id);
const languages = computed(() => store.getters["LanguageModule/languages"]);

const blogModel = computed({
  get: () => {
    const model = { ...props.modelValue };

    if (!model.translations || model.translations.length === 0) {
      model.translations = languages.value.map((lang) => ({
        id: undefined,
        isActive: true,
        isDeleted: false,
        blogId: model.id || null,
        languageId: lang.id || "",
        title: "",
        content: "",
        slug: "",
        seoTitle: "",
        seoDescription: "",
        seoKeywords: "",
        featuredImage: "",
        videoUrl: "",
        documentUrl: "",
      }));
    }
    return model;
  },
  set: (value) => emitted("update:modelValue", value),
});

const getTranslationByLanguage = (languageId: string) => {
  let translation = blogModel.value.translations?.find(
    (t) => t.languageId === languageId
  );
  if (!translation) {
    translation = {
      id: undefined,
      isActive: true,
      isDeleted: false,
      blogId: blogModel.value.id || null,
      languageId: languageId,
      title: "",
      content: "",
      slug: "",
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
      featuredImage: "",
      videoUrl: "",
      documentUrl: "",
    };
    if (!blogModel.value.translations) {
      blogModel.value.translations = [];
    }
    blogModel.value.translations.push(translation);
  }
  return translation;
};

const getCategoryName = (category: BlogCategoryDto) => {
  const translation = category.translations?.[0];
  return translation?.name || "Başlıksız";
};

const setActiveTab = (index: number) => {
  activeTab.value = index;
  setTimeout(() => {
    activeTab.value = index;
  }, 100);
};

const getBlogCategories = async () => {
  try {
    const result = await BlogCategoryService.getAll();
    if (result.result) {
      blogCategories.value = result.data || [];
    }
  } catch (error) {
    console.error("Blog kategorileri yüklenirken hata:", error);
  }
};

watch(
  () => props.modelValue,
  () => {
    if (!blogModel.value.id) {
      activeTab.value = 0;
    }
  }
);

watch(
  () => languages.value,
  () => {
    if (languages.value.length > 0) {
      const existingTranslations = blogModel.value.translations || [];
      const newTranslations = languages.value.map((lang) => {
        const existing = existingTranslations.find(
          (t) => t.languageId === lang.id
        );
        return (
          existing || {
            id: undefined,
            isActive: true,
            isDeleted: false,
            blogId: blogModel.value.id || null,
            languageId: lang.id || "",
            title: "",
            content: "",
            slug: "",
            seoTitle: "",
            seoDescription: "",
            seoKeywords: "",
            featuredImage: "",
            videoUrl: "",
            documentUrl: "",
          }
        );
      });
      blogModel.value.translations = newTranslations;
    }
  },
  { immediate: true }
);

const onSubmit = async (values: any) => {
  const apiValues = { ...blogModel.value, ...values };
  loading.value = true;

  try {
    let data;
    if (isEdit.value) {
      data = await BlogService.update(apiValues as UpdateBlogDto);
    } else {
      data = await BlogService.create(apiValues as CreateBlogDto);
    }

    if (data.result) {
      SwalAlert.toast("İşlem Başarılı");
      hideModal(addBlogModalRef.value);
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
  getBlogCategories();
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

.content-editor-wrapper {
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.content-editor-wrapper :deep(.tox-tinymce) {
  border: none !important;
  border-radius: 8px !important;
}

.content-editor-wrapper :deep(.tox .tox-toolbar) {
  background: #f8f9fa !important;
  border-bottom: 1px solid #e1e5e9 !important;
}

.content-editor-wrapper :deep(.tox .tox-edit-area) {
  background: #fff !important;
}

.content-editor-wrapper :deep(.tox .tox-edit-area__iframe) {
  background: #fff !important;
}

.content-editor-wrapper :deep(.tox .tox-statusbar) {
  display: none !important;
}

/* Modal boyutunu büyüt */
.modal-dialog {
  max-width: 1000px !important;
}

/* Tab içeriği için scroll */
.tab-content {
  max-height: 600px;
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
