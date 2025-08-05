<template>
  <div class="language-selector">
    <div class="dropdown">
      <button
        class="btn btn-sm btn-light-primary dropdown-toggle d-flex align-items-center"
        type="button"
        @click="toggleDropdown"
        aria-expanded="false"
      >
        <img
          v-if="selectedLanguage"
          :src="getFlagUrl(selectedLanguage.code)"
          :alt="selectedLanguage.name"
          class="flag-icon me-2"
          width="20"
          height="15"
        />
        <span v-if="selectedLanguage">{{ selectedLanguage.name }}</span>
        <span v-else>Dil Seçin</span>
      </button>
      <ul class="dropdown-menu" :class="{ show: isDropdownOpen }">
        <li v-for="language in languages" :key="language.id">
          <a
            class="dropdown-item d-flex align-items-center"
            href="#"
            @click.prevent="selectLanguage(language)"
          >
            <img
              :src="getFlagUrl(language.code)"
              :alt="language.name"
              class="flag-icon me-2"
              width="20"
              height="15"
            />
            <span>{{ language.name }}</span>
            <span
              v-if="language.isDefault"
              class="badge badge-light-success ms-auto"
            >
              Varsayılan
            </span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { LanguageDto } from "@/services/LanguageService";
import { getFlagUrl } from "@/core/helpers/languageHelper";

const store = useStore();
const isDropdownOpen = ref(false);

// Computed properties
const languages = computed(() => store.getters["LanguageModule/languages"]);
const selectedLanguage = computed(
  () => store.getters["LanguageModule/selectedLanguage"]
);
const loading = computed(() => store.getters["LanguageModule/loading"]);

// Methods
const selectLanguage = (language: LanguageDto) => {
  store.dispatch("LanguageModule/setSelectedLanguage", language);
  isDropdownOpen.value = false;
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

// getFlagUrl fonksiyonu artık helper'dan geliyor

// Lifecycle
onMounted(() => {
  // Store'u başlat
  store.dispatch("LanguageModule/initializeLanguage");

  // Click outside handler
  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (!target.closest(".language-selector")) {
      isDropdownOpen.value = false;
    }
  });
});
</script>

<style scoped>
.language-selector {
  position: relative;
}

.flag-icon {
  border-radius: 2px;
  object-fit: cover;
}

.dropdown-menu {
  min-width: 200px;
}

.dropdown-item {
  padding: 0.5rem 1rem;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.dropdown-item.active {
  background-color: #e9ecef;
}
</style>
