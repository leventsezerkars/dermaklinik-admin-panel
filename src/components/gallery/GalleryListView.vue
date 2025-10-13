<template>
  <div class="row">
    <div class="col-12">
      <div class="list-group">
        <div
          v-for="image in images"
          :key="image.id"
          class="list-group-item list-group-item-action p-0 mb-3 border rounded shadow-sm hover-lift"
        >
          <div class="row g-0">
            <!-- Resim -->
            <div class="col-md-2">
              <div class="position-relative" style="height: 140px">
                <img
                  :src="
                    image.imageUrl || 'media/icons/duotune/files/fil008.svg'
                  "
                  :alt="image.altText || image.title"
                  class="w-100 h-100 object-fit-cover cursor-pointer"
                  style="border-radius: 0.375rem 0 0 0.375rem"
                  @error="handleImageError"
                  @click="$emit('zoom-image', image)"
                  title="Resmi büyütmek için tıklayın"
                />
                <!-- Durum Badge -->
                <div class="position-absolute top-0 end-0 p-2">
                  <span
                    :class="{
                      'badge badge-success': image.isActive,
                      'badge badge-danger': !image.isActive,
                    }"
                    class="badge-sm shadow-sm"
                  >
                    {{ image.isActive ? "Aktif" : "Pasif" }}
                  </span>
                </div>
              </div>
            </div>

            <!-- İçerik -->
            <div class="col-md-10">
              <div class="p-4">
                <div
                  class="d-flex justify-content-between align-items-start mb-3"
                >
                  <div class="flex-grow-1">
                    <h5 class="mb-2 fw-bold text-dark">
                      {{ image.title || "İsimsiz Resim" }}
                    </h5>
                    <div class="d-flex align-items-center gap-3 mb-2">
                      <small class="text-muted">
                        <i class="fas fa-calendar-alt me-1"></i>
                        {{ formatDate(image.createdAt) }}
                      </small>
                      <small class="text-muted">
                        <i class="fas fa-image me-1"></i>
                        Resim
                      </small>
                    </div>
                  </div>
                  <div class="btn-group btn-group-sm">
                    <button
                      type="button"
                      class="btn btn-outline-primary btn-sm"
                      @click="$emit('zoom-image', image)"
                      title="Büyüt"
                    >
                      <i class="fas fa-search-plus"></i>
                    </button>
                    <button
                      type="button"
                      class="btn btn-outline-secondary btn-sm"
                      @click="$emit('edit-image', image)"
                      title="Düzenle"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <!-- Durum butonları -->
                    <button
                      v-if="image.isActive"
                      type="button"
                      class="btn btn-outline-warning btn-sm"
                      @click="$emit('deactivate-image', image)"
                      title="Pasife Çek"
                    >
                      <i class="fas fa-pause"></i>
                    </button>
                    <button
                      v-else
                      type="button"
                      class="btn btn-outline-success btn-sm"
                      @click="$emit('activate-image', image)"
                      title="Aktife Çek"
                    >
                      <i class="fas fa-play"></i>
                    </button>
                    <!-- Hard delete butonu -->
                    <button
                      type="button"
                      class="btn btn-outline-danger btn-sm"
                      @click="$emit('hard-delete-image', image)"
                      title="Kalıcı Olarak Sil"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>

                <!-- Açıklama -->
                <p
                  v-if="image.caption"
                  class="text-muted mb-3"
                  style="
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                  "
                >
                  {{ image.caption }}
                </p>

                <!-- Grup Bilgileri -->
                <div class="mb-3">
                  <div v-if="image.groups && image.groups.length > 0">
                    <div class="d-flex align-items-center mb-2">
                      <i class="fas fa-folder me-2 text-muted"></i>
                      <small class="text-muted fw-semibold">Gruplar:</small>
                    </div>
                    <div class="d-flex flex-wrap gap-2">
                      <span
                        v-for="group in image.groups"
                        :key="group.id"
                        class="badge badge-light-info badge-sm"
                      >
                        {{ group.name || "İsimsiz Grup" }}
                        <span v-if="group.sortOrder" class="ms-1 text-muted">
                          (#{{ group.sortOrder }})
                        </span>
                      </span>
                    </div>
                  </div>
                  <div v-else class="d-flex align-items-center">
                    <i class="fas fa-folder-open me-2 text-muted"></i>
                    <span class="badge badge-light-secondary badge-sm">
                      Grupsuz
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import { GalleryImageDto } from "@/services/GalleryImageService";

// Props
defineProps<{
  images: GalleryImageDto[];
}>();

// Emits
defineEmits<{
  "zoom-image": [image: GalleryImageDto];
  "edit-image": [image: GalleryImageDto];
  "deactivate-image": [image: GalleryImageDto];
  "activate-image": [image: GalleryImageDto];
  "hard-delete-image": [image: GalleryImageDto];
}>();

// Methods
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = "media/icons/duotune/files/fil008.svg";
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("tr-TR");
};
</script>

<style scoped>
.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.cursor-pointer {
  cursor: pointer;
}

.list-group-item {
  border: 1px solid #e9ecef !important;
}

.list-group-item:hover {
  background-color: #f8f9fa;
}
</style>
