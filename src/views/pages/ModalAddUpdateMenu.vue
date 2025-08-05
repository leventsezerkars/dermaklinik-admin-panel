<template>
  <div
    class="modal fade"
    id="kt_modal_add_menu"
    ref="addMenuModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-1000px">
      <div class="modal-content rounded">
        <div class="modal-header" id="kt_modal_add_menu_header">
          <h2>{{ isEdit ? "Menü Düzenle" : "Yeni Menü Oluştur" }}</h2>
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
            <div class="me-n7 pe-7" id="kt_modal_add_menu_scroll">
              <!-- Genel Bilgiler -->
              <div class="row mb-8">
                <div class="col-6">
                  <div class="fv-row mb-7">
                    <label class="required fs-6 fw-bold mb-2">Menü Tipi</label>
                    <Field
                      name="type"
                      v-model="menuModel.type"
                      v-slot="{ field, value, handleChange }"
                    >
                      <el-select
                        placeholder="Menü tipi seçiniz"
                        no-data-text="Veri Yok"
                        v-bind="field"
                        :model-value="value"
                        @update:model-value="handleChange"
                      >
                        <el-option key="0" label="Sayfa" :value="0" />
                        <el-option key="1" label="Link" :value="1" />
                        <el-option key="2" label="Content" :value="2" />
                        <el-option key="3" label="Kapça" :value="3" />
                      </el-select>
                    </Field>
                    <div class="fv-plugins-message-container">
                      <div class="fv-help-block">
                        <ErrorMessage name="type" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="fv-row mb-7">
                    <label class="required fs-6 fw-bold mb-2">Sıralama</label>
                    <Field
                      name="sortOrder"
                      v-model="menuModel.sortOrder"
                      type="number"
                      class="form-control"
                    />
                    <div class="fv-plugins-message-container">
                      <div class="fv-help-block">
                        <ErrorMessage name="sortOrder" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="row mb-8">
                <div class="col-6">
                  <div class="fv-row mb-7">
                    <label class="fs-6 fw-bold mb-2">Hedef URL</label>
                    <Field
                      name="target"
                      v-model="menuModel.target"
                      type="text"
                      class="form-control"
                      placeholder="https://example.com"
                    />
                    <div class="fv-plugins-message-container">
                      <div class="fv-help-block">
                        <ErrorMessage name="target" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="fv-row mb-7">
                    <label class="fs-6 fw-bold mb-2">Üst Menü</label>
                    <Field
                      name="parentId"
                      v-model="menuModel.parentId"
                      v-slot="{ field, value, handleChange }"
                    >
                      <el-select
                        placeholder="Üst menü seçiniz"
                        no-data-text="Veri Yok"
                        v-bind="field"
                        :model-value="value"
                        @update:model-value="handleChange"
                        clearable
                      >
                        <el-option
                          v-for="menu in parentMenus"
                          :key="menu.id"
                          :label="getMenuTitle(menu)"
                          :value="menu.id"
                        />
                      </el-select>
                    </Field>
                    <div class="fv-plugins-message-container">
                      <div class="fv-help-block">
                        <ErrorMessage name="parentId" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="row mb-8">
                <div class="col-6">
                  <div class="form-check form-switch">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="menuModel.isActive"
                      id="isActive"
                    />
                    <label class="form-check-label" for="isActive">
                      Aktif
                    </label>
                  </div>
                </div>
                <div class="col-6">
                  <div class="form-check form-switch mb-8">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="menuModel.isDeletable"
                      id="isDeletable"
                    />
                    <label class="form-check-label" for="isDeletable">
                      Silinebilir
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
                              {{ language.name }} Menü Adı
                            </label>
                            <input
                              v-model="
                                getTranslationByLanguage(language.id).title
                              "
                              type="text"
                              class="form-control"
                              :placeholder="`${language.name} menü adı`"
                            />
                          </div>
                        </div>
                        <div class="col-6">
                          <div class="fv-row mb-7">
                            <label class="fs-6 fw-bold mb-2">
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

                      <!-- İçerik Editörü -->
                      <div class="row">
                        <div class="col-12">
                          <div class="fv-row mb-7">
                            <label class="fs-6 fw-bold mb-2">
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
import MenuService, {
  MenuDto,
  CreateMenuDto,
  UpdateMenuDto,
  CreateMenuTranslationDto,
} from "@/services/MenuService";
import { LanguageDto } from "@/services/LanguageService";
import { getFlagUrl } from "@/core/helpers/languageHelper";
import TinyEditor from "@/components/TinyEditor.vue";

const store = useStore();
const addMenuModalRef = ref<null | HTMLElement>(null);
const formRef = ref<null | HTMLElement>(null);
const loading = ref<boolean>(false);
const parentMenus = ref<MenuDto[]>([]);
const activeTab = ref<number>(0);

const emitted = defineEmits(["submitted", "update:modelValue"]);

const props = defineProps({
  modelValue: {
    type: Object as () => MenuDto,
    default: () => ({}),
  },
});

const isEdit = computed(() => !!menuModel.value.id);
const languages = computed(() => store.getters["LanguageModule/languages"]);

const menuModel = computed({
  get: () => {
    const model = { ...props.modelValue };

    // API'den gelen veriyi kontrol et

    if (!model.translations || model.translations.length === 0) {
      model.translations = languages.value.map((lang) => ({
        id: undefined,
        isActive: true,
        isDeleted: false,
        menuId: model.id || null,
        languageId: lang.id || "",
        title: "",
        content: "",
        slug: "",
        seoTitle: "",
        seoDescription: "",
        seoKeywords: "",
      }));
    }
    return model;
  },
  set: (value) => emitted("update:modelValue", value),
});

const getTranslationByLanguage = (languageId: string) => {
  let translation = menuModel.value.translations?.find(
    (t) => t.languageId === languageId
  );
  if (!translation) {
    translation = {
      id: undefined,
      isActive: true,
      isDeleted: false,
      menuId: menuModel.value.id || null,
      languageId: languageId,
      title: "",
      content: "",
      slug: "",
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
    };
    if (!menuModel.value.translations) {
      menuModel.value.translations = [];
    }
    menuModel.value.translations.push(translation);
  }
  return translation;
};

const getMenuTitle = (menu: MenuDto) => {
  const translation = menu.translations?.[0];
  return translation?.title || "Başlıksız";
};

// getFlagUrl fonksiyonu artık helper'dan geliyor

const setActiveTab = (index: number) => {
  activeTab.value = index;
  // Tab değiştiğinde editörlerin yeniden initialize olması için kısa bir delay
  setTimeout(() => {
    // Force re-render
    activeTab.value = index;
  }, 100);
};

const getParentMenus = async () => {
  try {
    const result = await MenuService.getAll();
    if (result.result) {
      parentMenus.value = result.entity || [];
    }
  } catch (error) {
    console.error("Üst menüler yüklenirken hata:", error);
  }
};

watch(
  () => props.modelValue,
  () => {
    if (!menuModel.value.id) {
      // Form reset işlemi kaldırıldı çünkü formRef HTMLElement tipinde
      activeTab.value = 0;
    }
  }
);

watch(
  () => languages.value,
  () => {
    // Diller değiştiğinde translation'ları güncelle
    if (languages.value.length > 0) {
      const existingTranslations = menuModel.value.translations || [];
      const newTranslations = languages.value.map((lang) => {
        const existing = existingTranslations.find(
          (t) => t.languageId === lang.id
        );
        return (
          existing || {
            id: undefined,
            isActive: true,
            isDeleted: false,
            menuId: menuModel.value.id || null,
            languageId: lang.id || "",
            title: "",
            content: "",
            slug: "",
            seoTitle: "",
            seoDescription: "",
            seoKeywords: "",
          }
        );
      });
      menuModel.value.translations = newTranslations;
    }
  },
  { immediate: true }
);

const onSubmit = async (values: any) => {
  const apiValues = { ...menuModel.value, ...values };
  loading.value = true;

  try {
    let data;
    if (isEdit.value) {
      data = await MenuService.update(apiValues as UpdateMenuDto);
    } else {
      data = await MenuService.create(apiValues as CreateMenuDto);
    }

    if (data.result) {
      SwalAlert.toast("İşlem Başarılı");
      hideModal(addMenuModalRef.value);
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
  getParentMenus();
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
