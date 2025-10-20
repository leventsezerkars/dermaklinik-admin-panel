<template>
  <div class="card">
    <div class="card-header border-0 pt-5">
      <div class="d-flex justify-content-between align-items-center">
        <h3 class="card-title align-items-start flex-column">
          <span class="card-label fw-bold fs-3 mb-1">
            {{
              companyInfo.id
                ? "Şirket Bilgilerini Güncelle"
                : "Yeni Şirket Bilgileri"
            }}
          </span>
          <span class="text-muted mt-1 fw-semibold fs-7"
            >Şirket bilgilerini düzenleyin</span
          >
        </h3>
        <div class="card-toolbar"></div>
      </div>
    </div>

    <div class="card-body">
      <form @submit.prevent="saveCompanyInfo" ref="formRef">
        <div class="row">
          <!-- Logo Upload -->
          <div class="col-12 mb-5">
            <div class="d-flex align-items-center">
              <div class="symbol symbol-120px me-5 logo-preview-container">
                <img
                  v-if="companyInfo.logoUrl"
                  :src="companyInfo.logoUrl"
                  alt="Şirket Logosu"
                  class="logo-preview-image"
                />
                <div
                  v-else
                  class="symbol-label fs-3 fw-bold text-muted bg-light-primary"
                >
                  Logo Yok
                </div>
              </div>
              <div class="flex-grow-1">
                <label class="form-label fw-bold">Şirket Logosu</label>
                <div class="d-flex align-items-center">
                  <input
                    type="file"
                    ref="logoInput"
                    @change="handleLogoUpload"
                    accept="image/*"
                    class="form-control form-control-solid me-3"
                    style="max-width: 300px"
                  />
                  <button
                    v-if="companyInfo.logoUrl"
                    type="button"
                    @click="removeLogo"
                    class="btn btn-sm btn-light-danger"
                  >
                    Logoyu Kaldır
                  </button>
                </div>
                <div class="form-text">
                  Logo favicon ve header kısmında kullanılacaktır. Önerilen
                  boyut: 200x200px. Daha büyük resimler önizlemede 120x120px
                  olarak gösterilecek ancak orijinal boyutları korunacaktır.
                </div>
              </div>
            </div>
          </div>

          <!-- Temel Bilgiler -->
          <div class="col-md-6 mb-5">
            <label class="form-label fw-bold">Şirket Adı *</label>
            <input
              v-model="companyInfo.name"
              type="text"
              class="form-control form-control-solid"
              placeholder="Şirket adını giriniz"
              required
            />
          </div>

          <div class="col-md-6 mb-5">
            <label class="form-label fw-bold">Email *</label>
            <input
              v-model="companyInfo.email"
              type="email"
              class="form-control form-control-solid"
              placeholder="Email adresini giriniz"
              required
            />
          </div>

          <div class="col-md-6 mb-5">
            <label class="form-label fw-bold">Telefon *</label>
            <input
              v-model="companyInfo.phone"
              type="text"
              class="form-control form-control-solid"
              placeholder="Telefon numarasını giriniz"
              required
            />
          </div>

          <div class="col-md-6 mb-5">
            <label class="form-label fw-bold">Çalışma Saatleri</label>
            <input
              v-model="companyInfo.workingHours"
              type="text"
              class="form-control form-control-solid"
              placeholder="Örn: Pazartesi-Cuma 09:00-18:00"
            />
          </div>

          <div class="col-12 mb-5">
            <label class="form-label fw-bold">Adres *</label>
            <textarea
              v-model="companyInfo.address"
              class="form-control form-control-solid"
              rows="3"
              placeholder="Şirket adresini giriniz"
              required
            ></textarea>
          </div>

          <!-- Sosyal Medya -->
          <div class="col-12 mb-5">
            <h4 class="fw-bold mb-4">Sosyal Medya Linkleri</h4>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Facebook</label>
                <input
                  v-model="companyInfo.facebook"
                  type="url"
                  class="form-control form-control-solid"
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Twitter</label>
                <input
                  v-model="companyInfo.twitter"
                  type="url"
                  class="form-control form-control-solid"
                  placeholder="https://twitter.com/..."
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Instagram</label>
                <input
                  v-model="companyInfo.instagram"
                  type="url"
                  class="form-control form-control-solid"
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">LinkedIn</label>
                <input
                  v-model="companyInfo.linkedIn"
                  type="url"
                  class="form-control form-control-solid"
                  placeholder="https://linkedin.com/..."
                />
              </div>
            </div>
          </div>

          <!-- Web ve SEO -->
          <div class="col-12 mb-5">
            <h4 class="fw-bold mb-4">Web ve SEO Bilgileri</h4>
            <div class="row">
              <div class="col-12 mb-3">
                <label class="form-label">Google Maps URL</label>
                <input
                  v-model="companyInfo.googleMapsUrl"
                  type="url"
                  class="form-control form-control-solid"
                  placeholder="https://maps.google.com/..."
                />
              </div>
              <div class="col-12 mb-3">
                <label class="form-label">Google Analytics Kodu</label>
                <textarea
                  v-model="companyInfo.googleAnalyticsCode"
                  class="form-control form-control-solid"
                  rows="3"
                  placeholder="Google Analytics tracking kodu"
                ></textarea>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Meta Title</label>
                <input
                  v-model="companyInfo.metaTitle"
                  type="text"
                  class="form-control form-control-solid"
                  placeholder="Sayfa başlığı"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Meta Keywords</label>
                <input
                  v-model="companyInfo.metaKeywords"
                  type="text"
                  class="form-control form-control-solid"
                  placeholder="Anahtar kelimeler"
                />
              </div>
              <div class="col-12 mb-3">
                <label class="form-label">Meta Description</label>
                <textarea
                  v-model="companyInfo.metaDescription"
                  class="form-control form-control-solid"
                  rows="3"
                  placeholder="Sayfa açıklaması"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Kaydet Butonu -->
        <div class="d-flex justify-content-end">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span
              v-if="loading"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            {{
              loading
                ? "Kaydediliyor..."
                : companyInfo.id
                ? "Güncelle"
                : "Kaydet"
            }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { useStore } from "vuex";
import { CompanyInfoDto } from "@/services/CompanyInfoService";
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
import { validateAndConvertLogo } from "@/core/helpers/fileHelper";
import SwalAlert from "@/core/helpers/swalalert";
const store = useStore();
const loading = ref(false);
const formRef = ref<HTMLFormElement>();

// Şirket bilgileri modeli
const companyInfo = reactive<CompanyInfoDto>({
  id: "",
  isActive: true,
  isDeleted: false,
  name: "",
  address: "",
  phone: "",
  email: "",
  logoUrl: "",
  facebook: "",
  twitter: "",
  instagram: "",
  linkedIn: "",
  googleMapsUrl: "",
  googleAnalyticsCode: "",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  workingHours: "",
});

// Logo upload işlemleri
const logoInput = ref<HTMLInputElement>();

const handleLogoUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    try {
      const base64String = await validateAndConvertLogo(file, 2); // 2MB limit
      companyInfo.logoUrl = base64String;
      SwalAlert.toast("Logo başarıyla yüklendi", "success");
    } catch (error) {
      SwalAlert.toast(
        error instanceof Error ? error.message : "Logo yüklenirken hata oluştu",
        "error"
      );
      // Input'u temizle
      if (target) {
        target.value = "";
      }
    }
  }
};

const removeLogo = () => {
  companyInfo.logoUrl = "";
  if (logoInput.value) {
    logoInput.value.value = "";
  }
  SwalAlert.toast("Logo kaldırıldı", "info");
};

// Şirket bilgilerini yükle
const loadCompanyInfo = async () => {
  try {
    loading.value = true;
    const companyData = await store.dispatch(
      "CompanyInfoModule/fetchCompanyInfo"
    );

    if (companyData) {
      // Mevcut veriyi form'a yükle
      Object.assign(companyInfo, companyData);
    } else {
      // Veri yoksa yeni form göster (id alanı boş kalacak)
      console.log(
        "Mevcut şirket bilgisi bulunamadı, yeni kayıt formu gösteriliyor"
      );
    }
  } catch (error) {
    console.error("Şirket bilgileri yüklenirken hata:", error);
    SwalAlert.toast("Şirket bilgileri yüklenirken hata oluştu", "error");
  } finally {
    loading.value = false;
  }
};

// Şirket bilgilerini kaydet
const saveCompanyInfo = async () => {
  try {
    loading.value = true;

    let updatedCompanyInfo;

    if (companyInfo.id) {
      // Güncelleme işlemi
      updatedCompanyInfo = await store.dispatch(
        "CompanyInfoModule/updateCompanyInfo",
        companyInfo
      );
    } else {
      // Yeni kayıt oluşturma
      const {
        id,
        createdAt,
        createdById,
        updatedAt,
        updatedById,
        creator,
        updater,
        ...createData
      } = companyInfo;
      updatedCompanyInfo = await store.dispatch(
        "CompanyInfoModule/createCompanyInfo",
        createData
      );
    }

    if (updatedCompanyInfo) {
      SwalAlert.toast("Şirket bilgileri başarıyla kaydedildi", "success");
      // Form'u güncel veri ile güncelle
      Object.assign(companyInfo, updatedCompanyInfo);
    } else {
      SwalAlert.toast("Kaydetme işlemi başarısız", "error");
    }
  } catch (error) {
    console.error("Şirket bilgileri kaydedilirken hata:", error);
    SwalAlert.toast("Şirket bilgileri kaydedilirken hata oluştu", "error");
  } finally {
    loading.value = false;
  }
};

// Sayfa yüklendiğinde şirket bilgilerini getir
onMounted(() => {
  setCurrentPageBreadcrumbs("Şirket Bilgileri", ["Şirket Bilgileri"]);
  loadCompanyInfo();
});
</script>

<style scoped>
.symbol {
  border-radius: 0.475rem;
  overflow: hidden;
}

.object-fit-cover {
  object-fit: cover;
}

.form-control-solid {
  background-color: #f5f8fa;
  border-color: #f5f8fa;
}

.form-control-solid:focus {
  background-color: #ffffff;
  border-color: #009ef7;
}

.logo-preview-container {
  width: 120px !important; /* Fixed width for the container */
  height: 120px !important; /* Fixed height for the container */
  min-width: 120px !important; /* Prevent shrinking */
  min-height: 120px !important; /* Prevent shrinking */
  max-width: 120px !important; /* Prevent expanding */
  max-height: 120px !important; /* Prevent expanding */
  overflow: hidden; /* Hide overflow to ensure image fits */
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Cover the container while maintaining aspect ratio */
  max-width: 120px; /* Ensure image doesn't exceed container */
  max-height: 120px; /* Ensure image doesn't exceed container */
}
</style>
