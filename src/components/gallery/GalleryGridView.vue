<template>
  <div class="row g-4">
    <div
      v-for="image in images"
      :key="image.id"
      class="col-xl-3 col-lg-4 col-md-6"
    >
      <div class="card h-100 shadow-sm border-0 image-card">
        <!-- Resim Container -->
        <div class="position-relative overflow-hidden" style="height: 220px">
          <img
            :src="image.imageUrl || 'media/icons/duotune/files/fil008.svg'"
            :alt="image.altText || image.title"
            class="w-100 h-100 object-fit-cover cursor-pointer transition-all"
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

          <!-- Hover Overlay -->
          <div
            class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 opacity-0 hover-opacity-100 transition-all"
          >
            <div class="btn-group btn-group-sm">
              <button
                type="button"
                class="btn btn-light btn-sm"
                @click="$emit('zoom-image', image)"
                title="Büyüt"
              >
                <i class="fas fa-search-plus"></i>
              </button>
              <button
                type="button"
                class="btn btn-primary btn-sm"
                @click="$emit('edit-image', image)"
                title="Düzenle"
              >
                <i class="fas fa-edit"></i>
              </button>
              <!-- Durum butonları -->
              <button
                v-if="image.isActive"
                type="button"
                class="btn btn-warning btn-sm"
                @click="$emit('deactivate-image', image)"
                title="Pasife Çek"
              >
                <i class="fas fa-pause"></i>
              </button>
              <button
                v-else
                type="button"
                class="btn btn-success btn-sm"
                @click="$emit('activate-image', image)"
                title="Aktife Çek"
              >
                <i class="fas fa-play"></i>
              </button>
              <!-- Hard delete butonu -->
              <button
                type="button"
                class="btn btn-danger btn-sm"
                @click="$emit('hard-delete-image', image)"
                title="Kalıcı Olarak Sil"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
        <!-- Card Body -->
        <div class="card-body d-flex flex-column p-3">
          <!-- Başlık -->
          <h6 class="card-title mb-2 fw-bold text-dark">
            {{ image.title || "İsimsiz Resim" }}
          </h6>

          <!-- Açıklama -->
          <p
            v-if="image.caption"
            class="card-text small text-muted mb-3"
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
          <div class="mb-3 flex-grow-1">
            <div v-if="image.groups && image.groups.length > 0">
              <div class="d-flex align-items-center mb-1">
                <i class="fas fa-folder me-1 text-muted small"></i>
                <small class="text-muted fw-semibold">Gruplar</small>
              </div>
              <div class="d-flex flex-wrap gap-1">
                <span
                  v-for="group in image.groups"
                  :key="group.id"
                  class="badge badge-light-info badge-sm"
                >
                  {{ group.name || "İsimsiz Grup" }}
                </span>
              </div>
            </div>
            <div v-else class="d-flex align-items-center">
              <i class="fas fa-folder-open me-1 text-muted small"></i>
              <span class="badge badge-light-secondary badge-sm">
                Grupsuz
              </span>
            </div>
          </div>

          <!-- Alt Bilgiler -->
          <div class="mt-auto pt-2 border-top">
            <div class="d-flex justify-content-between align-items-center">
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
.transition-all {
  transition: all 0.3s ease;
}

.hover-opacity-100:hover {
  opacity: 1 !important;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
