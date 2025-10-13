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
                <div class="row">
                  <!-- Sol Panel - Gruplar -->
                  <div class="col-md-4">
                    <div class="card">
                      <div class="card-header border-0 pt-6">
                        <div class="card-title">
                          <h3>Resim Grupları</h3>
                        </div>
                        <div class="card-toolbar">
                          <button
                            type="button"
                            class="btn btn-primary btn-sm"
                            @click="createNewGroup"
                          >
                            <span class="svg-icon svg-icon-2">
                              <inline-svg
                                src="media/icons/duotune/arrows/arr075.svg"
                              />
                            </span>
                            Yeni Grup
                          </button>
                        </div>
                      </div>
                      <div class="card-body">
                        <!-- Loading State -->
                        <div v-if="loading" class="text-center py-5">
                          <div
                            class="spinner-border text-primary"
                            role="status"
                          >
                            <span class="visually-hidden">Yükleniyor...</span>
                          </div>
                          <p class="mt-2 text-muted">Gruplar yükleniyor...</p>
                        </div>

                        <!-- Empty State -->
                        <div
                          v-else-if="groups.length === 0"
                          class="text-center py-5"
                        >
                          <p class="text-muted">Henüz grup bulunmuyor.</p>
                          <button
                            type="button"
                            class="btn btn-primary btn-sm"
                            @click="createNewGroup"
                          >
                            İlk Grubu Oluştur
                          </button>
                        </div>

                        <!-- Groups List -->
                        <div v-else class="d-flex flex-column gap-3">
                          <div
                            v-for="group in groups"
                            :key="group.id"
                            class="group-item p-3 border rounded cursor-pointer"
                            :class="{
                              'border-primary bg-light-primary':
                                selectedGroup?.id === group.id,
                              'border-light': selectedGroup?.id !== group.id,
                            }"
                            @click="selectGroup(group)"
                          >
                            <div
                              class="d-flex justify-content-between align-items-center"
                            >
                              <div>
                                <h6 class="mb-1">
                                  {{ group.name || "İsimsiz Grup" }}
                                </h6>
                                <small class="text-muted">
                                  {{ group.description || "Açıklama yok" }}
                                </small>
                                <div class="mt-2">
                                  <span class="badge badge-light-info">
                                    {{ getGroupImageCount(group.id || "") }}
                                    resim
                                  </span>
                                  <span
                                    :class="{
                                      'badge badge-light-success ms-1':
                                        group.isActive,
                                      'badge badge-light-danger ms-1':
                                        !group.isActive,
                                    }"
                                  >
                                    {{ group.isActive ? "Aktif" : "Pasif" }}
                                  </span>
                                </div>
                              </div>
                              <div class="d-flex gap-1">
                                <button
                                  type="button"
                                  class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
                                  @click.stop="editGroup(group)"
                                  title="Düzenle"
                                >
                                  <span class="svg-icon svg-icon-3">
                                    <inline-svg
                                      src="media/icons/duotune/art/art005.svg"
                                    />
                                  </span>
                                </button>
                                <button
                                  v-if="group.isDeletable"
                                  type="button"
                                  class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
                                  @click.stop="deleteGroup(group)"
                                  title="Sil"
                                >
                                  <span class="svg-icon svg-icon-3">
                                    <inline-svg
                                      src="media/icons/duotune/general/gen027.svg"
                                    />
                                  </span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Sağ Panel - Resimler -->
                  <div class="col-md-8">
                    <div class="card">
                      <div class="card-header border-0 pt-6">
                        <div class="card-title">
                          <h3>Resimler</h3>
                          <span v-if="selectedGroup" class="text-muted ms-2">
                            - {{ selectedGroup.name }}
                          </span>
                        </div>
                        <div class="card-toolbar">
                          <div class="d-flex gap-2">
                            <button
                              type="button"
                              class="btn btn-success btn-sm"
                              @click="openUploadModal"
                            >
                              <span class="svg-icon svg-icon-2">
                                <inline-svg
                                  src="media/icons/duotune/files/fil008.svg"
                                />
                              </span>
                              Resim Yükle
                            </button>
                          </div>
                        </div>
                      </div>
                      <div class="card-body">
                        <!-- Filtreler ve Görünüm -->
                        <div class="row mb-4">
                          <div class="col-md-3">
                            <input
                              v-model="imageSearch"
                              type="text"
                              class="form-control"
                              placeholder="Resim ara..."
                            />
                          </div>
                          <div class="col-md-2">
                            <select
                              v-model="selectedGroupFilter"
                              class="form-select"
                              @change="onGroupFilterChange"
                            >
                              <option value="">Tüm Resimler</option>
                              <option value="ungrouped">Grupsuz</option>
                              <option
                                v-for="group in groups"
                                :key="group.id"
                                :value="group.id"
                              >
                                {{ group.name || "İsimsiz Grup" }}
                              </option>
                            </select>
                          </div>
                          <div class="col-md-2">
                            <select v-model="statusFilter" class="form-select">
                              <option value="">Tüm Durumlar</option>
                              <option value="active">Aktif</option>
                              <option value="inactive">Pasif</option>
                            </select>
                          </div>
                          <div class="col-md-2">
                            <select v-model="sortOrder" class="form-select">
                              <option value="newest">En Yeni</option>
                              <option value="oldest">En Eski</option>
                              <option value="name">İsme Göre</option>
                            </select>
                          </div>
                          <div class="col-md-3">
                            <div class="d-flex justify-content-end">
                              <div class="btn-group btn-group-sm" role="group">
                                <button
                                  type="button"
                                  class="btn btn-sm"
                                  :class="
                                    viewMode === 'grid'
                                      ? 'btn-primary'
                                      : 'btn-outline-secondary'
                                  "
                                  @click="viewMode = 'grid'"
                                  title="Grid Görünümü"
                                >
                                  <i class="fas fa-th"></i>
                                </button>
                                <button
                                  type="button"
                                  class="btn btn-sm"
                                  :class="
                                    viewMode === 'list'
                                      ? 'btn-primary'
                                      : 'btn-outline-secondary'
                                  "
                                  @click="viewMode = 'list'"
                                  title="Liste Görünümü"
                                >
                                  <i class="fas fa-list"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Loading State -->
                        <div v-if="loading" class="text-center py-5">
                          <div
                            class="spinner-border text-primary"
                            role="status"
                          >
                            <span class="visually-hidden">Yükleniyor...</span>
                          </div>
                          <p class="mt-2 text-muted">Resimler yükleniyor...</p>
                        </div>
                        <div
                          v-else-if="filteredImages.length === 0"
                          class="text-center py-5"
                        >
                          <div class="svg-icon svg-icon-4x text-muted mb-3">
                            <inline-svg
                              src="media/icons/duotune/files/fil008.svg"
                            />
                          </div>
                          <h5 class="text-muted">Resim bulunamadı</h5>
                          <p class="text-muted">
                            Yeni resim yükleyerek başlayın
                          </p>
                        </div>
                        <!-- Resim Grid -->
                        <GalleryGridView
                          v-else-if="viewMode === 'grid'"
                          :images="filteredImages"
                          @zoom-image="zoomImage"
                          @edit-image="editImage"
                          @deactivate-image="deactivateImage"
                          @activate-image="activateImage"
                          @hard-delete-image="hardDeleteImage"
                        />

                        <!-- Liste Görünümü -->
                        <GalleryListView
                          v-else-if="viewMode === 'list'"
                          :images="filteredImages"
                          @zoom-image="zoomImage"
                          @edit-image="editImage"
                          @deactivate-image="deactivateImage"
                          @activate-image="activateImage"
                          @hard-delete-image="hardDeleteImage"
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
  </div>

  <!-- Grup Oluşturma/Düzenleme Modal -->
  <Modal
    id="createGroupModal"
    :header-text="editingGroup ? 'Grup Düzenle' : 'Yeni Grup Oluştur'"
    size="md"
    ref="createGroupModalRef"
  >
    <template #body>
      <form @submit.prevent="saveGroup">
        <div class="mb-3">
          <label class="form-label">Grup Adı</label>
          <input
            v-model="groupForm.name"
            type="text"
            class="form-control"
            placeholder="Grup adını girin"
            required
          />
        </div>
        <div class="mb-3">
          <label class="form-label">Açıklama</label>
          <textarea
            v-model="groupForm.description"
            class="form-control"
            rows="3"
            placeholder="Grup açıklaması girin"
          ></textarea>
        </div>
        <div class="mb-3">
          <div class="form-check">
            <input
              v-model="groupForm.isActive"
              class="form-check-input"
              type="checkbox"
              id="groupActive"
            />
            <label class="form-check-label" for="groupActive"> Aktif </label>
          </div>
        </div>
        <div class="d-flex justify-content-end gap-2">
          <button
            type="button"
            class="btn btn-secondary"
            @click="cancelGroupEdit"
          >
            İptal
          </button>
          <button type="submit" class="btn btn-primary">
            {{ editingGroup ? "Güncelle" : "Oluştur" }}
          </button>
        </div>
      </form>
    </template>
  </Modal>

  <!-- Resim Yükleme/Düzenleme Modal -->
  <Modal
    id="uploadModal"
    :header-text="
      loading
        ? editingImage
          ? 'Resim Güncelleniyor...'
          : 'Resim Yükleniyor...'
        : editingImage
        ? 'Resim Düzenle'
        : 'Resim Yükle'
    "
    size="lg"
    ref="uploadModalRef"
  >
    <template #body>
      <form @submit.prevent="uploadImage" class="position-relative">
        <!-- Loading Overlay -->
        <div
          v-if="loading"
          class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75"
          style="z-index: 10"
        >
          <div class="text-center">
            <div class="spinner-border text-primary mb-3" role="status">
              <span class="visually-hidden">Yükleniyor...</span>
            </div>
            <p class="text-muted">
              {{
                editingImage ? "Resim güncelleniyor..." : "Resim yükleniyor..."
              }}
            </p>
          </div>
        </div>

        <!-- Mevcut resim önizlemesi (düzenleme modunda) -->
        <div v-if="editingImage" class="mb-4">
          <label class="form-label">Mevcut Resim</label>
          <div class="text-center">
            <img
              :src="
                editingImage.imageUrl || 'media/icons/duotune/files/fil008.svg'
              "
              :alt="editingImage.altText || editingImage.title"
              class="img-fluid rounded shadow-sm"
              style="max-height: 200px; max-width: 100%; object-fit: contain"
              @error="handleImageError"
            />
            <p class="text-muted mt-2 small">
              Mevcut resim: {{ editingImage.title || "İsimsiz" }}
            </p>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">
            {{
              editingImage ? "Yeni Resim Dosyası (Opsiyonel)" : "Resim Dosyası"
            }}
          </label>
          <input
            ref="fileInput"
            type="file"
            class="form-control"
            accept="image/*"
            multiple
            @change="handleFileSelect"
            :required="!editingImage"
            :disabled="loading"
          />
          <small class="text-muted">
            {{
              editingImage
                ? "Yeni resim seçmezseniz mevcut resim korunur"
                : "Birden fazla resim seçebilirsiniz"
            }}
          </small>
        </div>
        <div class="mb-3">
          <label class="form-label">Başlık (Türkçe)</label>
          <input
            v-model="imageForm.Title"
            type="text"
            class="form-control"
            placeholder="Resim başlığı (Türkçe)"
            :disabled="loading"
          />
        </div>
        <div class="mb-3">
          <label class="form-label">Başlık (İngilizce)</label>
          <input
            v-model="imageForm.TitleEn"
            type="text"
            class="form-control"
            placeholder="Resim başlığı (İngilizce)"
            :disabled="loading"
          />
        </div>
        <div class="mb-3">
          <label class="form-label">Alt Text</label>
          <input
            v-model="imageForm.AltText"
            type="text"
            class="form-control"
            placeholder="Alt text"
            :disabled="loading"
          />
        </div>
        <div class="mb-3">
          <label class="form-label">Açıklama</label>
          <textarea
            v-model="imageForm.Caption"
            class="form-control"
            rows="3"
            placeholder="Resim açıklaması"
            :disabled="loading"
          ></textarea>
        </div>
        <div class="mb-3">
          <label class="form-label">Gruplar</label>
          <div
            class="border rounded p-3"
            style="max-height: 200px; overflow-y: auto"
            :class="{ 'opacity-50': loading }"
          >
            <div v-if="groups.length === 0" class="text-muted text-center py-2">
              Henüz grup bulunmuyor
            </div>
            <div v-else>
              <div
                v-for="group in groups"
                :key="group.id"
                class="form-check mb-2"
              >
                <input
                  v-model="imageForm.GroupIds"
                  class="form-check-input"
                  type="checkbox"
                  :value="group.id"
                  :id="'group-' + group.id"
                  :disabled="loading"
                />
                <label
                  class="form-check-label d-flex align-items-center"
                  :for="'group-' + group.id"
                >
                  <span class="me-2">{{ group.name || "İsimsiz Grup" }}</span>
                  <span
                    :class="{
                      'badge badge-light-success badge-sm': group.isActive,
                      'badge badge-light-danger badge-sm': !group.isActive,
                    }"
                  >
                    {{ group.isActive ? "Aktif" : "Pasif" }}
                  </span>
                </label>
                <small v-if="group.description" class="text-muted d-block ms-4">
                  {{ group.description }}
                </small>
              </div>
            </div>
          </div>
          <small class="text-muted">Birden fazla grup seçebilirsiniz</small>
        </div>
        <div class="mb-3">
          <div class="form-check">
            <input
              v-model="imageForm.IsActive"
              class="form-check-input"
              type="checkbox"
              id="imageActive"
              :disabled="loading"
            />
            <label class="form-check-label" for="imageActive"> Aktif </label>
          </div>
        </div>
        <div class="d-flex justify-content-end gap-2">
          <button
            type="button"
            class="btn btn-secondary"
            @click="uploadModalRef?.hide()"
            :disabled="loading"
          >
            İptal
          </button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span
              v-if="loading"
              class="spinner-border spinner-border-sm me-2"
              role="status"
            >
              <span class="visually-hidden">Yükleniyor...</span>
            </span>
            {{
              loading
                ? editingImage
                  ? "Güncelleniyor..."
                  : "Yükleniyor..."
                : editingImage
                ? "Güncelle"
                : "Yükle"
            }}
          </button>
        </div>
      </form>
    </template>
  </Modal>

  <!-- Resim Büyütme Modal -->
  <Modal
    id="imageZoomModal"
    header-text="Resim Görüntüle"
    size="xl"
    ref="imageZoomModalRef"
  >
    <template #body>
      <div v-if="selectedImageForZoom" class="row">
        <!-- Sol taraf - Resim -->
        <div class="col-md-8">
          <div class="text-center">
            <img
              :src="
                selectedImageForZoom.imageUrl ||
                'media/icons/duotune/files/fil008.svg'
              "
              :alt="selectedImageForZoom.altText || selectedImageForZoom.title"
              class="img-fluid rounded shadow-sm"
              style="max-height: 70vh; max-width: 100%; object-fit: contain"
              @error="handleImageError"
            />
          </div>
        </div>

        <!-- Sağ taraf - Bilgiler -->
        <div class="col-md-4">
          <div class="h-100 d-flex flex-column">
            <!-- Başlık -->
            <div class="mb-3">
              <h4 class="fw-bold text-primary mb-2">
                {{ selectedImageForZoom.title || "İsimsiz" }}
              </h4>
              <div class="d-flex align-items-center gap-2">
                <span
                  :class="{
                    'badge badge-light-success': selectedImageForZoom.isActive,
                    'badge badge-light-danger': !selectedImageForZoom.isActive,
                  }"
                >
                  {{ selectedImageForZoom.isActive ? "Aktif" : "Pasif" }}
                </span>
                <small class="text-muted">
                  {{ formatDate(selectedImageForZoom.createdAt) }}
                </small>
              </div>
            </div>

            <!-- Açıklama -->
            <div v-if="selectedImageForZoom.caption" class="mb-3 flex-grow-1">
              <h6 class="fw-semibold text-muted mb-2">Açıklama</h6>
              <p class="text-muted lh-base">
                {{ selectedImageForZoom.caption }}
              </p>
            </div>

            <!-- Grup bilgileri -->
            <div class="mb-3">
              <h6 class="fw-semibold text-muted mb-2">Gruplar</h6>
              <div
                v-if="
                  selectedImageForZoom.groups &&
                  selectedImageForZoom.groups.length > 0
                "
              >
                <div class="d-flex flex-column gap-2">
                  <div
                    v-for="group in selectedImageForZoom.groups"
                    :key="group.id"
                    class="d-flex align-items-center justify-content-between p-2 border rounded bg-light"
                  >
                    <div class="d-flex align-items-center gap-2">
                      <span class="badge badge-light-info">
                        {{ group.name || "İsimsiz Grup" }}
                      </span>
                      <small class="text-muted">
                        Sıra: {{ group.sortOrder || 0 }}
                      </small>
                    </div>
                    <div class="d-flex gap-1">
                      <button
                        type="button"
                        class="btn btn-outline-primary btn-sm"
                        @click="moveImageUp(selectedImageForZoom, group)"
                        title="Yukarı Taşı"
                        :disabled="(group.sortOrder || 0) <= 1"
                      >
                        <i class="fas fa-arrow-up"></i>
                      </button>
                      <button
                        type="button"
                        class="btn btn-outline-primary btn-sm"
                        @click="moveImageDown(selectedImageForZoom, group)"
                        title="Aşağı Taşı"
                      >
                        <i class="fas fa-arrow-down"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>
                <span class="badge badge-light-secondary"> Grupsuz </span>
              </div>
            </div>

            <!-- Alt Text -->
            <div v-if="selectedImageForZoom.altText" class="mb-3">
              <h6 class="fw-semibold text-muted mb-2">Alt Text</h6>
              <p class="text-muted small">
                {{ selectedImageForZoom.altText }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="d-flex justify-content-end gap-2">
        <button
          type="button"
          class="btn btn-secondary"
          @click="imageZoomModalRef?.hide()"
        >
          Kapat
        </button>
        <button
          v-if="selectedImageForZoom"
          type="button"
          class="btn btn-primary"
          @click="editImageFromZoom(selectedImageForZoom)"
        >
          Düzenle
        </button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
// Component name: GalleryPage
import { ref, reactive, onMounted, computed, watch } from "vue";
import Modal from "@/components/Modal/Modal.vue";
import GalleryGridView from "@/components/gallery/GalleryGridView.vue";
import GalleryListView from "@/components/gallery/GalleryListView.vue";
import { validateAndConvertLogo } from "@/core/helpers/fileHelper";
import SwalAlert from "@/core/helpers/swalalert";
import GalleryImageService, {
  GalleryImageDto,
  CreateGalleryImageDto,
  UpdateGalleryImageDto,
  UpdateImageOrderCommand,
} from "@/services/GalleryImageService";
import GalleryGroupService, {
  GalleryGroupDto,
  CreateGalleryGroupDto,
} from "@/services/GalleryGroupService";

// Modal interface
interface ModalInstance {
  show: () => void;
  hide: () => void;
  _isShown: boolean;
}

// Reactive state
const groups = ref<GalleryGroupDto[]>([]);
const allImages = ref<GalleryImageDto[]>([]); // Tüm resimler
const groupImages = ref<GalleryImageDto[]>([]); // Seçili grubun resimleri
const selectedGroup = ref<GalleryGroupDto | null>(null);
const loading = ref(false);
const imageSearch = ref("");
const selectedGroupFilter = ref<string>("");
const sortOrder = ref("newest");
const statusFilter = ref<string>(""); // "active", "inactive", "" (all)
const viewMode = ref<"grid" | "list">("grid"); // "grid" veya "list"

// Modal refs
const createGroupModalRef = ref<ModalInstance | null>(null);
const uploadModalRef = ref<ModalInstance | null>(null);
const imageZoomModalRef = ref<ModalInstance | null>(null);

// Form states
const editingGroup = ref<GalleryGroupDto | null>(null);
const editingImage = ref<GalleryImageDto | null>(null);
const groupForm = reactive<CreateGalleryGroupDto>({
  name: "",
  description: "",
  isDeletable: true,
  isActive: true,
});

const imageForm = reactive<CreateGalleryImageDto>({
  ImageFile: undefined,
  Title: "",
  TitleEn: "",
  AltText: "",
  Caption: "",
  IsActive: true,
  GroupIds: [],
});

const selectedImageForZoom = ref<GalleryImageDto | null>(null);

// File handling
const fileInput = ref<HTMLInputElement | null>(null);
const selectedFiles = ref<File[]>([]);

// Computed
const filteredImages = computed(() => {
  // Hangi resim listesini kullanacağımızı belirle
  let sourceImages = allImages.value;

  // Eğer belirli bir grup seçiliyse, o grubun resimlerini kullan
  if (
    selectedGroupFilter.value &&
    selectedGroupFilter.value !== "" &&
    selectedGroupFilter.value !== "ungrouped"
  ) {
    sourceImages = groupImages.value;
  }

  let filtered = [...sourceImages]; // Array'i kopyala

  // Arama filtresi
  if (imageSearch.value) {
    const search = imageSearch.value.toLowerCase();
    filtered = filtered.filter(
      (img) =>
        img.title?.toLowerCase().includes(search) ||
        img.altText?.toLowerCase().includes(search) ||
        img.caption?.toLowerCase().includes(search)
    );
  }

  // Grup filtresi (sadece "ungrouped" için)
  if (selectedGroupFilter.value === "ungrouped") {
    filtered = filtered.filter((img) => !img.groups || img.groups.length === 0);
  }

  // Durum filtresi (aktif/pasif)
  if (statusFilter.value) {
    if (statusFilter.value === "active") {
      filtered = filtered.filter((img) => img.isActive);
    } else if (statusFilter.value === "inactive") {
      filtered = filtered.filter((img) => !img.isActive);
    }
  }

  // Sıralama
  filtered.sort((a, b) => {
    switch (sortOrder.value) {
      case "newest":
        return (
          new Date(b.createdAt || "").getTime() -
          new Date(a.createdAt || "").getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt || "").getTime() -
          new Date(b.createdAt || "").getTime()
        );
      case "name":
        return (a.title || "").localeCompare(b.title || "");
      default:
        return 0;
    }
  });

  return filtered;
});

// Helper function to refresh images based on current filter
const refreshImages = async () => {
  // Her zaman tüm resimleri yenile
  await loadImages();

  // Eğer belirli bir grup seçiliyse, o grubun resimlerini de yenile
  if (
    selectedGroupFilter.value &&
    selectedGroupFilter.value !== "" &&
    selectedGroupFilter.value !== "ungrouped"
  ) {
    await loadImages(selectedGroupFilter.value);
  }
};

// Methods
const loadGroups = async () => {
  try {
    console.log("Gruplar yükleniyor...");
    const response = await GalleryGroupService.getGroups();
    console.log("API'den gelen gruplar:", response);

    // Response'un yapısını kontrol et ve array olduğundan emin ol
    if (Array.isArray(response)) {
      groups.value = response;
    } else if (
      response &&
      typeof response === "object" &&
      "data" in response &&
      Array.isArray((response as any).data)
    ) {
      groups.value = (response as any).data;
    } else {
      console.warn("Unexpected response format:", response);
      groups.value = [];
    }

    console.log("State'e atanan gruplar:", groups.value);
  } catch (error) {
    console.error("Gruplar yüklenirken hata:", error);
    alert("Gruplar yüklenirken hata oluştu: " + error);
    groups.value = []; // Hata durumunda boş array set et
  }
};

const loadImages = async (groupId?: string) => {
  try {
    let response;
    if (groupId) {
      // Belirli gruba ait resimleri getir
      response = await GalleryImageService.getImages({ groupId });
      console.log(`Grup ${groupId} için gelen resimler:`, response);
    } else {
      // Tüm resimleri getir
      response = await GalleryImageService.getImages();
      console.log("Tüm resimler:", response);
    }

    // Response'un yapısını kontrol et ve array olduğundan emin ol
    let imageArray: GalleryImageDto[] = [];
    if (Array.isArray(response)) {
      imageArray = response;
    } else if (
      response &&
      typeof response === "object" &&
      "data" in response &&
      Array.isArray((response as any).data)
    ) {
      imageArray = (response as any).data;
    } else {
      console.warn("Unexpected response format:", response);
      imageArray = [];
    }
    imageArray.forEach((image) => {
      if (image.groups && Array.isArray(image.groups)) {
        image.groupIds = image.groups
          .map((g) => g.id)
          .filter((id) => id) as string[];
      } else {
        image.groupIds = [];
      }
    });

    // Resimleri doğru ref'e ata
    if (groupId) {
      groupImages.value = imageArray;
    } else {
      allImages.value = imageArray;
    }
  } catch (error) {
    console.error("Resimler yüklenirken hata:", error);
    alert("Resimler yüklenirken hata oluştu: " + error);
    // Hata durumunda boş array set et
    if (groupId) {
      groupImages.value = [];
    } else {
      allImages.value = [];
    }
  }
};

const selectGroup = async (group: GalleryGroupDto) => {
  selectedGroup.value = group;
  // Seçilen gruba göre filtreyi güncelle
  selectedGroupFilter.value = group.id || "";
  // Seçilen gruba ait resimleri yükle
  if (group.id) {
    await loadImages(group.id);
  }
};

const onGroupFilterChange = async () => {
  // Grup filtresi değiştiğinde selectedGroup'u da güncelle
  if (
    selectedGroupFilter.value === "" ||
    selectedGroupFilter.value === "ungrouped"
  ) {
    // Tüm resimler veya grupsuz seçildiğinde selectedGroup'u temizle
    selectedGroup.value = null;
    // Tüm resimleri yükle
    await loadImages();
  } else {
    // Belirli bir grup seçildiğinde selectedGroup'u güncelle
    const group = groups.value.find((g) => g.id === selectedGroupFilter.value);
    selectedGroup.value = group || null;
    // O grubun resimlerini yükle
    if (group?.id) {
      await loadImages(group.id);
    }
  }
};

const getGroupImageCount = (groupId: string): number => {
  // groups.value'nin array olduğundan emin ol
  if (!Array.isArray(groups.value)) {
    console.warn("groups.value is not an array:", groups.value);
    return 0;
  }

  const group = groups.value.find((g) => g.id === groupId);
  return group?.imageCount || 0;
};

const createNewGroup = () => {
  editingGroup.value = null;
  Object.assign(groupForm, {
    name: "",
    description: "",
    isDeletable: true,
    isActive: true,
  });
  createGroupModalRef.value?.show();
};

const editGroup = (group: GalleryGroupDto) => {
  editingGroup.value = group;
  Object.assign(groupForm, {
    name: group.name || "",
    description: group.description || "",
    isDeletable: group.isDeletable,
    isActive: group.isActive,
  });
  createGroupModalRef.value?.show();
};

const saveGroup = async () => {
  try {
    loading.value = true;

    if (editingGroup.value) {
      // Güncelleme için id'yi groupForm'a ekle
      const updateData = {
        ...groupForm,
        id: editingGroup.value.id,
      };
      await GalleryGroupService.updateGroup(editingGroup.value.id!, updateData);
    } else {
      const newGroup = await GalleryGroupService.createGroup(groupForm);
    }

    await loadGroups();

    cancelGroupEdit();
  } catch (error) {
    console.error("Grup kaydedilirken hata:", error);
    alert("Grup kaydedilirken hata oluştu: " + error);
  } finally {
    loading.value = false;
  }
};

const cancelGroupEdit = () => {
  createGroupModalRef.value?.hide();

  editingGroup.value = null;
  Object.assign(groupForm, {
    name: "",
    description: "",
    isDeletable: true,
    isActive: true,
  });
};

const deleteGroup = async (group: GalleryGroupDto) => {
  const imageCount = getGroupImageCount(group.id || "");
  const isActive = group.isActive;
  const groupName = group.name || "Bu grup";

  // Silme türünü belirle
  const shouldHardDelete = imageCount === 0 || !isActive;
  const shouldSoftDelete = imageCount > 0 && isActive;

  if (shouldSoftDelete) {
    // Resim varsa + aktif = pasife çek
    const result = await SwalAlert.confirm({
      title: "Grubu Pasife Çek",
      text: `${groupName} içinde ${imageCount} resim bulunduğu için pasife çekilecek. Resimler korunacak.`,
      confirmButtonText: "Evet, Pasife Çek",
      cancelButtonText: "İptal",
      type: "question",
    });

    if (result.isConfirmed) {
      try {
        await GalleryGroupService.deleteGroup(group.id!);
        await loadGroups();
        if (selectedGroup.value?.id === group.id) {
          selectedGroup.value = null;
        }
        SwalAlert.toast("Grup pasife çekildi", "success");
      } catch (error) {
        console.error("Grup pasife çekilirken hata:", error);
        SwalAlert.toast("Grup pasife çekilirken hata oluştu", "error");
      }
    }
  } else if (shouldHardDelete) {
    // Diğer tüm durumlar = hard delete
    const hasImages = imageCount > 0;
    const isPassive = !isActive;

    let message = "";
    if (hasImages && isPassive) {
      message = `${groupName} pasif durumda ve içinde ${imageCount} resim bulunuyor. Grup ve tüm resimleri kalıcı olarak silinecek. Bu işlem geri alınamaz!`;
    } else if (!hasImages && isActive) {
      message = `${groupName} içinde resim bulunmadığı için kalıcı olarak silinecek. Bu işlem geri alınamaz!`;
    } else {
      message = `${groupName} pasif durumda ve içinde resim bulunmuyor. Kalıcı olarak silinecek. Bu işlem geri alınamaz!`;
    }

    const result = await SwalAlert.confirm({
      title: "Grubu Kalıcı Olarak Sil",
      text: message,
      confirmButtonText: "Evet, Kalıcı Olarak Sil",
      cancelButtonText: "İptal",
      type: "warning",
    });

    if (result.isConfirmed) {
      try {
        await GalleryGroupService.hardDeleteGroup(group.id!);
        await loadGroups();
        if (selectedGroup.value?.id === group.id) {
          selectedGroup.value = null;
        }
        const toastMessage = hasImages
          ? "Grup ve resimleri kalıcı olarak silindi"
          : "Grup kalıcı olarak silindi";
        SwalAlert.toast(toastMessage, "success");
      } catch (error) {
        console.error("Grup kalıcı olarak silinirken hata:", error);
        SwalAlert.toast("Grup kalıcı olarak silinirken hata oluştu", "error");
      }
    }
  }
};

const openUploadModal = () => {
  // Yeni resim yükleme modunda modal'ı aç
  editingImage.value = null;
  resetImageForm();
  uploadModalRef.value?.show();
};

const editImage = (image: GalleryImageDto) => {
  // Resim düzenleme modal'ı açılacak
  // Düzenlenen resmi set et
  editingImage.value = image;

  // Mevcut resim verilerini forma kopyala
  imageForm.Title = image.title || "";
  imageForm.TitleEn = image.titleEn || "";
  imageForm.AltText = image.altText || "";
  imageForm.Caption = image.caption || "";
  imageForm.IsActive = image.isActive;
  imageForm.GroupIds = image.groupIds || [];
  // Modal'ı aç
  if (uploadModalRef.value) {
    uploadModalRef.value.show();
  }
};

// Hard delete - resmi tamamen sil
const hardDeleteImage = async (image: GalleryImageDto) => {
  const result = await SwalAlert.confirm({
    title: "Resmi Kalıcı Olarak Sil",
    text: `${
      image.title || "Bu resim"
    } kalıcı olarak silinecek. Bu işlem geri alınamaz!`,
    confirmButtonText: "Evet, Sil",
    cancelButtonText: "İptal",
    type: "warning",
  });

  if (result.isConfirmed) {
    try {
      await GalleryImageService.hardDeleteImage(image.id!);
      await refreshImages();
      SwalAlert.toast("Resim kalıcı olarak silindi", "success");
    } catch (error) {
      console.error("Resim kalıcı olarak silinirken hata:", error);
      SwalAlert.toast("Resim silinirken hata oluştu", "error");
    }
  }
};

// Soft delete - resmi pasife çek
const deactivateImage = async (image: GalleryImageDto) => {
  const result = await SwalAlert.confirm({
    title: "Resmi Pasife Çek",
    text: `${image.title || "Bu resim"} pasife çekilecek.`,
    confirmButtonText: "Evet, Pasife Çek",
    cancelButtonText: "İptal",
    type: "question",
  });

  if (result.isConfirmed) {
    try {
      await GalleryImageService.deleteImage(image.id!);
      await refreshImages();
      SwalAlert.toast("Resim pasife çekildi", "success");
    } catch (error) {
      console.error("Resim pasife çekilirken hata:", error);
      SwalAlert.toast("Resim pasife çekilirken hata oluştu", "error");
    }
  }
};

// Resmi aktife çek
const activateImage = async (image: GalleryImageDto) => {
  try {
    // Resmi edit moduna al
    editingImage.value = image;
    // Form verilerini güncelle
    imageForm.Title = image.title || "";
    imageForm.TitleEn = image.titleEn || "";
    imageForm.AltText = image.altText || "";
    imageForm.Caption = image.caption || "";
    imageForm.IsActive = true; // Aktife çek
    imageForm.GroupIds = image.groupIds || [];

    // Dosya seçimini temizle (yeni resim yüklemeyeceğiz)
    selectedFiles.value = [];

    // uploadImage fonksiyonunu çağır (edit modunda çalışacak)
    await uploadImage();

    SwalAlert.toast("Resim aktife çekildi", "success");
  } catch (error) {
    console.error("Resim aktife çekilirken hata:", error);
    SwalAlert.toast("Resim aktife çekilirken hata oluştu", "error");
  }
};

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = "media/icons/duotune/files/fil008.svg";
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("tr-TR");
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    selectedFiles.value = Array.from(target.files);
    console.log("Seçilen dosyalar:", selectedFiles.value);
  }
};

const uploadImage = async () => {
  // Düzenleme modunda değilse dosya seçimi zorunlu
  if (!editingImage.value && selectedFiles.value.length === 0) {
    alert("Lütfen resim dosyası seçin");
    return;
  }

  try {
    loading.value = true;
    console.log("Resim işlemi başlıyor...");

    if (editingImage.value) {
      // Düzenleme modu
      if (selectedFiles.value.length > 0) {
        // Yeni dosya seçilmişse, dosyayı güncelle
        const file = selectedFiles.value[0]; // Düzenleme modunda tek dosya
        const base64Data = await validateAndConvertLogo(file, 5);

        const imageData: UpdateGalleryImageDto = {
          ImageFile: base64Data,
          Title: imageForm.Title || file.name,
          TitleEn: imageForm.TitleEn || "",
          AltText: imageForm.AltText || file.name,
          Caption: imageForm.Caption || "",
          IsActive: imageForm.IsActive,
          GroupIds: imageForm.GroupIds || [],
        };

        await GalleryImageService.updateImage(
          editingImage.value.id!,
          imageData
        );
      } else {
        // Yeni dosya seçilmemişse, sadece metin bilgilerini güncelle
        const imageData: UpdateGalleryImageDto = {
          // ImageFile gönderme - mevcut resim korunacak
          Title: imageForm.Title || editingImage.value.title,
          TitleEn: imageForm.TitleEn || editingImage.value.titleEn,
          AltText: imageForm.AltText || editingImage.value.altText,
          Caption: imageForm.Caption || editingImage.value.caption,
          IsActive: imageForm.IsActive,
          GroupIds: imageForm.GroupIds || [],
        };

        await GalleryImageService.updateImage(
          editingImage.value.id!,
          imageData
        );
      }
    } else {
      // Yeni resim yükleme modu
      for (const file of selectedFiles.value) {
        try {
          const base64Data = await validateAndConvertLogo(file, 5);

          const imageData: CreateGalleryImageDto = {
            ImageFile: base64Data,
            Title: imageForm.Title || file.name,
            TitleEn: imageForm.TitleEn || "",
            AltText: imageForm.AltText || file.name,
            Caption: imageForm.Caption || "",
            IsActive: imageForm.IsActive,
            GroupIds: imageForm.GroupIds || [],
          };

          console.log("Yeni resim yükleniyor:", imageData.Title);
          await GalleryImageService.createImage(imageData);
          console.log("Resim başarıyla yüklendi:", imageData.Title);
        } catch (error) {
          console.error(`Resim yüklenirken hata (${file.name}):`, error);
          alert(`Resim yüklenirken hata (${file.name}): ${error}`);
        }
      }
    }

    // Resimleri yeniden yükle
    await refreshImages();

    // Modal'ı kapat
    if (uploadModalRef.value) {
      uploadModalRef.value.hide();
    }

    // Form'u temizle (modal kapandıktan sonra)
    resetImageForm();

    console.log("İşlem tamamlandı");
  } catch (error) {
    console.error("Resim işlenirken hata:", error);
    alert("Resim işlenirken hata oluştu: " + error);
  } finally {
    loading.value = false;
  }
};

const resetImageForm = () => {
  editingImage.value = null;
  imageForm.Title = "";
  imageForm.TitleEn = "";
  imageForm.AltText = "";
  imageForm.Caption = "";
  imageForm.IsActive = true;
  imageForm.GroupIds = [];
  selectedFiles.value = [];
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const zoomImage = (image: GalleryImageDto) => {
  selectedImageForZoom.value = image;
  imageZoomModalRef.value?.show();
};

const editImageFromZoom = (image: GalleryImageDto) => {
  // Önce büyütme modal'ını kapat
  imageZoomModalRef.value?.hide();

  // Kısa bir gecikme sonrası düzenleme modal'ını aç
  setTimeout(() => {
    editImage(image);
  }, 300); // Modal kapanma animasyonu için gecikme
};

// Resim sıralama fonksiyonları
const moveImageUp = async (image: GalleryImageDto, group: any) => {
  try {
    // Resmin o gruptaki mevcut sırasını bul
    const currentOrder = group.sortOrder || 0;
    if (currentOrder <= 1) return;

    console.log("moveImageUp çağrıldı:", {
      imageId: image.id,
      groupId: group.id,
      groupIdType: typeof group.id,
      currentOrder,
      newOrder: currentOrder - 1,
    });

    const updateData: UpdateImageOrderCommand = {
      imageId: image.id!,
      groupId: group.id,
      newSortOrder: currentOrder - 1,
    };

    await GalleryImageService.updateImageOrder(updateData);
    await refreshImages();

    // Modal'daki resmi güncelle
    if (selectedImageForZoom.value?.id === image.id) {
      const updatedImage = allImages.value.find((img) => img.id === image.id);
      if (updatedImage) {
        selectedImageForZoom.value = updatedImage;
      }
    }

    SwalAlert.toast("Resim sırası güncellendi", "success");
  } catch (error) {
    console.error("Resim sırası güncellenirken hata:", error);
    SwalAlert.toast("Resim sırası güncellenirken hata oluştu", "error");
  }
};

const moveImageDown = async (image: GalleryImageDto, group: any) => {
  try {
    // Resmin o gruptaki mevcut sırasını bul
    const currentOrder = group.sortOrder || 0;
    const newOrder = currentOrder + 1;

    console.log("moveImageDown çağrıldı:", {
      imageId: image.id,
      groupId: group.id,
      groupIdType: typeof group.id,
      currentOrder,
      newOrder,
    });

    const updateData: UpdateImageOrderCommand = {
      imageId: image.id!,
      groupId: group.id,
      newSortOrder: newOrder,
    };

    await GalleryImageService.updateImageOrder(updateData);
    await refreshImages();

    // Modal'daki resmi güncelle
    if (selectedImageForZoom.value?.id === image.id) {
      const updatedImage = allImages.value.find((img) => img.id === image.id);
      if (updatedImage) {
        selectedImageForZoom.value = updatedImage;
      }
    }

    SwalAlert.toast("Resim sırası güncellendi", "success");
  } catch (error) {
    console.error("Resim sırası güncellenirken hata:", error);
    SwalAlert.toast("Resim sırası güncellenirken hata oluştu", "error");
  }
};

// Watchers
watch(sortOrder, () => {
  // Sıralama değiştiğinde computed property otomatik güncellenecek
  console.log("Sıralama değişti:", sortOrder.value);
});

// Lifecycle
onMounted(async () => {
  try {
    loading.value = true;
    await Promise.all([loadGroups(), loadImages()]);
  } catch (error) {
    console.error("Sayfa yüklenirken hata:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.group-item {
  transition: all 0.2s ease;
}

.group-item:hover {
  background-color: #f8f9fa;
  border-color: #dee2e6;
}

.group-item.cursor-pointer {
  cursor: pointer;
}

.image-item {
  transition: all 0.2s ease;
}

.image-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.image-container {
  overflow: hidden;
}

.image-overlay {
  background-color: rgba(0, 0, 0, 0.7);
  transition: opacity 0.2s ease;
}

.image-overlay:hover {
  opacity: 1 !important;
}

.transition-opacity {
  transition: opacity 0.2s ease;
}

.hover-opacity-100:hover {
  opacity: 1 !important;
}

.border-primary {
  border-color: #0d6efd !important;
}

.bg-light-primary {
  background-color: rgba(13, 110, 253, 0.1) !important;
}

.cursor-pointer {
  cursor: pointer;
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
