<template>
  <div
    class="modal fade"
    id="kt_modal_add_menu"
    ref="addMenuModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-1200px">
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
              <div class="row">
                <!-- Sol Taraf: Genel Bilgiler -->
                <div class="col-4 border-end border-5">
                  <h4 class="mb-4">Genel Bilgiler</h4>

                  <!-- Genel Bilgiler -->
                  <div class="row mb-8">
                    <div class="col-12">
                      <div class="fv-row mb-7">
                        <label class="required fs-6 fw-bold mb-2"
                          >Menü Tipi</label
                        >
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
                            <el-option key="2" label="Kapça" :value="2" />
                          </el-select>
                        </Field>
                        <div class="fv-plugins-message-container">
                          <div class="fv-help-block">
                            <ErrorMessage name="type" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="row mb-8">
                    <div class="col-12">
                      <div class="fv-row mb-7">
                        <label class="required fs-6 fw-bold mb-2"
                          >Sıralama</label
                        >
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

                  <!-- Target Input (Link ve Kapça için) -->
                  <div class="row mb-8">
                    <div class="col-12">
                      <div class="fv-row mb-7">
                        <label class="required fs-6 fw-bold mb-2"
                          >Hedef URL</label
                        >
                        <Field
                          name="target"
                          v-model="menuModel.target"
                          type="text"
                          class="form-control"
                          :placeholder="
                            menuModel.type === 0
                              ? 'hizmetler'
                              : menuModel.type === 1
                              ? 'https://example.com'
                              : 'Hedef URL'
                          "
                        />
                        <div class="fv-plugins-message-container">
                          <div class="fv-help-block">
                            <ErrorMessage name="target" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="row mb-8">
                    <div class="col-12">
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
                              v-for="menu in sortedParentMenus"
                              :key="menu.id"
                              :label="getMenuTitleWithLevel(menu)"
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
                          :disabled="isEdit && !menuModel.isDeletable"
                        />
                        <label class="form-check-label" for="isDeletable">
                          Silinebilir
                        </label>
                        <div
                          v-if="isEdit && !menuModel.isDeletable"
                          class="form-text text-muted"
                        >
                          Bu menü silinemez
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Sağ Taraf: Dil İçerikleri -->
                <div class="col-8">
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
                      <div class="fv-row mb-7">
                        <label class="required fs-6 fw-bold mb-2">
                          {{ language.name }} Menü Adı
                        </label>
                        <input
                          v-model="getTranslationByLanguage(language.id).title"
                          @input="
                            onTitleChange(
                              language.id,
                              ($event.target as HTMLInputElement).value
                            )
                          "
                          type="text"
                          class="form-control"
                          :placeholder="`${language.name} menü adı`"
                        />
                      </div>

                      <div class="fv-row mb-7">
                        <label class="fs-6 fw-bold mb-2">
                          {{ language.name }} Slug
                        </label>
                        <input
                          :value="getSlugDisplayValue(language.id)"
                          :key="`slug-${language.id}-${updateCounter}`"
                          type="text"
                          class="form-control"
                          :placeholder="`${language.name} slug`"
                          disabled
                        />
                      </div>

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

                      <div class="fv-row mb-7">
                        <label class="fs-6 fw-bold mb-2">
                          {{ language.name }} SEO Açıklama
                        </label>
                        <textarea
                          v-model="
                            getTranslationByLanguage(language.id).seoDescription
                          "
                          class="form-control"
                          rows="3"
                          :placeholder="`${language.name} SEO açıklama`"
                        ></textarea>
                      </div>

                      <div class="fv-row mb-7">
                        <label class="fs-6 fw-bold mb-2">
                          {{ language.name }} SEO Anahtar Kelimeler
                        </label>
                        <input
                          v-model="
                            getTranslationByLanguage(language.id).seoKeywords
                          "
                          :key="`keywords-${language.id}-${updateCounter}`"
                          @input="
                            onKeywordsChange(
                              language.id,
                              ($event.target as HTMLInputElement).value
                            )
                          "
                          type="text"
                          class="form-control"
                          :placeholder="`${language.name} anahtar kelimeler, virgülle ayrılmış`"
                        />
                      </div>

                      <!-- İçerik Editörü -->
                      <div v-if="menuModel.type !== 2" class="fv-row mb-7">
                        <label class="fs-6 fw-bold mb-2">
                          {{ language.name }} İçerik
                        </label>
                        <div class="content-editor-wrapper">
                          <TinyEditor
                            :key="`editor-${language.id}-${activeTab}`"
                            v-model="
                              getTranslationByLanguage(language.id).content
                            "
                            size="large"
                            :append-init="{
                              placeholder: `${language.name} içerik yazın...`,
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
import {
  ref,
  defineProps,
  computed,
  defineEmits,
  watch,
  onMounted,
  nextTick,
} from "vue";
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
import { generateMenuData } from "@/core/helpers/slugHelper";
import TinyEditor from "@/components/TinyEditor.vue";

const store = useStore();
const addMenuModalRef = ref<null | HTMLElement>(null);
const formRef = ref<null | HTMLElement>(null);
const loading = ref<boolean>(false);
// parentMenus artık props'tan geliyor
const activeTab = ref<number>(0);

// Manuel değişiklikleri takip etmek için state (sadece keywords için)
const manualChanges = ref<{
  [languageId: string]: { keywords: boolean };
}>({});

// Force update için counter
const updateCounter = ref(0);

const emitted = defineEmits(["submitted", "update:modelValue"]);

const props = defineProps({
  modelValue: {
    type: Object as () => MenuDto,
    default: () => ({}),
  },
  parentMenus: {
    type: Array as () => MenuDto[],
    default: () => [],
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

// Manuel değişiklik state'ini başlat
const initializeManualChanges = (languageId: string) => {
  if (!manualChanges.value[languageId]) {
    manualChanges.value[languageId] = { keywords: false };
  }
};

// Slug display value (prefix olmadan)
const getSlugDisplayValue = (languageId: string) => {
  const translation = getTranslationByLanguage(languageId);
  if (!translation.slug) return "";

  return translation.slug.replace("/hizmetler/", "");
};

// Menü adı değiştiğinde otomatik slug ve anahtar kelime oluştur
const onTitleChange = async (languageId: string, title: string) => {
  const translation = getTranslationByLanguage(languageId);

  // Title'ı güncelle
  translation.title = title;

  // Manuel değişiklik state'ini başlat
  initializeManualChanges(languageId);

  // Title değiştiğinde slug ve keywords'i güncelle
  if (title && title.trim()) {
    const { slug, keywords } = generateMenuData(title);

    translation.slug = slug;

    // Keywords'i güncelle (manuel değişiklik yapılmadıysa)
    if (!manualChanges.value[languageId].keywords) {
      translation.seoKeywords = keywords;
    }

    // Vue'nun reaktivitesini tetikle
    await nextTick();
    console.log("nextTick sonrası translation:", translation);

    // Force update
    updateCounter.value++;
    console.log("Force update tetiklendi:", updateCounter.value);
  }
};

// Anahtar kelimeler değiştiğinde manuel olarak güncellenebilir
const onKeywordsChange = (languageId: string, keywords: string) => {
  const translation = getTranslationByLanguage(languageId);
  translation.seoKeywords = keywords;

  // Manuel değişiklik yapıldığını işaretle
  initializeManualChanges(languageId);
  manualChanges.value[languageId].keywords = true;
};

const getMenuTitle = (menu: MenuDto) => {
  if (!menu.translations || menu.translations.length === 0) {
    return "Başlıksız";
  }

  // Önce Türkçe translation'ı bul
  const turkishTranslation = menu.translations.find(
    (t) => t.language?.code === "tr"
  );

  if (turkishTranslation?.title) {
    return turkishTranslation.title;
  }

  // Türkçe yoksa, title'ı olan ilk translation'ı bul
  const translationWithTitle = menu.translations.find(
    (t) => t.title && t.title.trim() !== ""
  );

  if (translationWithTitle?.title) {
    return translationWithTitle.title;
  }

  // Hiçbirinde title yoksa ilk translation'ın title'ını al (boş olsa bile)
  const firstTranslation = menu.translations[0];
  return firstTranslation?.title || "Başlıksız";
};

// Menü seviyesini hesapla
const getMenuLevel = (menu: MenuDto, allMenus: MenuDto[]): number => {
  if (!menu.parentId) return 0;

  const parent = allMenus.find((m) => m.id === menu.parentId);
  if (!parent) return 0;

  return 1 + getMenuLevel(parent, allMenus);
};

// Sıralı menü listesi oluştur
const sortedParentMenus = computed(() => {
  if (!props.parentMenus || props.parentMenus.length === 0) return [];

  // Önce seviyeye göre grupla
  const menusByLevel = props.parentMenus.reduce((acc, menu) => {
    const level = getMenuLevel(menu, props.parentMenus);
    if (!acc[level]) acc[level] = [];
    acc[level].push(menu);
    return acc;
  }, {} as Record<number, MenuDto[]>);

  // Her seviyeyi sortOrder'a göre sırala ve birleştir
  const sortedMenus: MenuDto[] = [];
  Object.keys(menusByLevel)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .forEach((level) => {
      const levelMenus = menusByLevel[parseInt(level)].sort(
        (a, b) => a.sortOrder - b.sortOrder
      );
      sortedMenus.push(...levelMenus);
    });

  return sortedMenus;
});

// Seviye ile birlikte menü başlığı oluştur
const getMenuTitleWithLevel = (menu: MenuDto): string => {
  const level = getMenuLevel(menu, props.parentMenus);
  const title = getMenuTitle(menu);
  const indent = "  ".repeat(level);
  return `${indent}${title}`;
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

// getParentMenus artık gerekli değil çünkü veri props'tan geliyor

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

// Type değiştiğinde çeviri kısmını kontrol et
watch(
  () => menuModel.value.type,
  (newType) => {
    // Target alanını type'a göre otomatik doldur
    if (newType === 0) {
      // Type 0 (Sayfa) ise target'ı "hizmetler" yap
      menuModel.value.target = "hizmetler";
    }

    if (menuModel.value.translations) {
      if (newType === 2) {
        // Type 2 (Kapça) ise sadece content'i boş yap
        menuModel.value.translations.forEach((translation) => {
          translation.content = "";
        });
      }
    } else if (newType === 0 && !menuModel.value.translations) {
      // Type 0 (Sayfa) ise ve translations yoksa oluştur
      if (languages.value.length > 0) {
        menuModel.value.translations = languages.value.map((lang) => ({
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
        }));
      }
    }
  }
);

const onSubmit = async (values: any) => {
  const apiValues = { ...menuModel.value, ...values };

  // Target'ı sadece Link ve Kapça tipi için gönder
  if (apiValues.type !== 1 && apiValues.type !== 2) {
    apiValues.target = "";
  }

  // Type 2 (Kapça) ise translations'lardaki content'leri boş yap
  if (apiValues.type === 2 && apiValues.translations) {
    apiValues.translations.forEach((translation) => {
      translation.content = "";
    });
  }

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

// Modal açıldığında manuel değişiklik state'ini sıfırla
const resetManualChanges = () => {
  manualChanges.value = {};
};

// Modal açıldığında çağrılacak
onMounted(() => {
  resetManualChanges();
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
  min-height: 500px;
  height: auto;
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
  max-width: 1200px !important;
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
