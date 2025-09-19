import { Module } from "vuex";
import LanguageService, { LanguageDto } from "@/services/LanguageService";

export interface LanguageState {
  languages: LanguageDto[];
  selectedLanguage: LanguageDto | null;
  loading: boolean;
  lastFetch: number | null;
}

const languageModule: Module<LanguageState, any> = {
  namespaced: true,
  state: (): LanguageState => {
    // LocalStorage'dan lastFetch bilgisini yükle
    const savedLastFetch = localStorage.getItem("languageLastFetch");
    const lastFetch = savedLastFetch ? parseInt(savedLastFetch) : null;

    // LocalStorage'dan languages bilgisini yükle
    const savedLanguages = localStorage.getItem("languages");
    const languages = savedLanguages ? JSON.parse(savedLanguages) : [];

    return {
      languages: languages,
      selectedLanguage: null,
      loading: false,
      lastFetch: lastFetch,
    };
  },

  mutations: {
    SET_LANGUAGES(state, languages: LanguageDto[]) {
      state.languages = languages;
      localStorage.setItem("languages", JSON.stringify(languages));
    },
    SET_SELECTED_LANGUAGE(state, language: LanguageDto) {
      state.selectedLanguage = language;
      localStorage.setItem("selectedLanguage", JSON.stringify(language));
    },
    SET_LOADING(state, loading: boolean) {
      state.loading = loading;
    },
    SET_LAST_FETCH(state, timestamp: number) {
      state.lastFetch = timestamp;
      localStorage.setItem("languageLastFetch", timestamp.toString());
    },
  },

  actions: {
    async fetchLanguages({ commit, state }) {
      // Eğer son 1 saat içinde fetch edildiyse tekrar etme
      const now = Date.now();
      const oneHour = 60 * 60 * 1000; // 1 saat

      if (state.lastFetch && now - state.lastFetch < oneHour) {
        return state.languages;
      }

      commit("SET_LOADING", true);
      try {
        const result = await LanguageService.getAll();
        if (result.result && result.data) {
          commit("SET_LANGUAGES", result.data);
          commit("SET_LAST_FETCH", now);

          // Eğer seçili dil yoksa varsayılan dili seç
          if (!state.selectedLanguage) {
            const defaultLanguage =
              result.data.find((lang) => lang.isDefault) || result.data[0];
            if (defaultLanguage) {
              commit("SET_SELECTED_LANGUAGE", defaultLanguage);
            }
          }

          return result.data;
        }
      } catch (error) {
        console.error("Diller yüklenirken hata:", error);
      } finally {
        commit("SET_LOADING", false);
      }
      return [];
    },

    setSelectedLanguage({ commit }, language: LanguageDto) {
      commit("SET_SELECTED_LANGUAGE", language);
    },

    initializeLanguage({ commit, dispatch, state }) {
      // LocalStorage'dan seçili dili yükle
      const savedLanguage = localStorage.getItem("selectedLanguage");
      if (savedLanguage) {
        try {
          const language = JSON.parse(savedLanguage);
          commit("SET_SELECTED_LANGUAGE", language);
        } catch (error) {
          console.error("Kaydedilmiş dil yüklenirken hata:", error);
        }
      }

      // Eğer diller zaten yüklüyse ve cache geçerliyse tekrar yükleme
      const now = Date.now();
      const oneHour = 60 * 60 * 1000; // 1 saat

      if (
        state.languages.length > 0 &&
        state.lastFetch &&
        now - state.lastFetch < oneHour
      ) {
        return; // Cache geçerli, tekrar yükleme
      }

      // Dilleri yükle
      dispatch("fetchLanguages");
    },
  },

  getters: {
    languages: (state) => state.languages,
    selectedLanguage: (state) => state.selectedLanguage,
    loading: (state) => state.loading,
    defaultLanguage: (state) => state.languages.find((lang) => lang.isDefault),
  },
};

export default languageModule;
