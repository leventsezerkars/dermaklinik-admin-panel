import { Module } from "vuex";
import CompanyInfoService, {
  type CompanyInfoDto,
} from "@/services/CompanyInfoService";
import { setCompanyFavicon } from "@/core/helpers/faviconHelper";

export interface CompanyInfoState {
  companyInfo: CompanyInfoDto | null;
  loading: boolean;
  lastFetch: number | null;
}

const CompanyInfoModule: Module<CompanyInfoState, any> = {
  namespaced: true,

  state: (): CompanyInfoState => {
    const savedLastFetch = localStorage.getItem("companyInfoLastFetch");
    const lastFetch = savedLastFetch ? parseInt(savedLastFetch) : null;

    const savedCompanyInfo = localStorage.getItem("companyInfo");
    const companyInfo = savedCompanyInfo ? JSON.parse(savedCompanyInfo) : null;

    return {
      companyInfo: companyInfo,
      loading: false,
      lastFetch: lastFetch,
    };
  },

  mutations: {
    SET_COMPANY_INFO(state, companyInfo: CompanyInfoDto | null) {
      console.log("SET_COMPANY_INFO mutation çağrıldı:", companyInfo);
      state.companyInfo = companyInfo;
      if (companyInfo) {
        localStorage.setItem("companyInfo", JSON.stringify(companyInfo));
        console.log(
          "CompanyInfo localStorage'a kaydedildi, logoUrl:",
          companyInfo.logoUrl
        );
        // Favicon'u ayarla (async)
        setCompanyFavicon(companyInfo.logoUrl || null).catch((error) => {
          console.error("Favicon ayarlanırken hata:", error);
        });
      } else {
        localStorage.removeItem("companyInfo");
        console.log("CompanyInfo localStorage'dan kaldırıldı");
        // Favicon'u sıfırla (async)
        setCompanyFavicon(null).catch((error) => {
          console.error("Favicon sıfırlanırken hata:", error);
        });
      }
    },
    SET_LOADING(state, loading: boolean) {
      state.loading = loading;
    },
    SET_LAST_FETCH(state, timestamp: number) {
      state.lastFetch = timestamp;
      localStorage.setItem("companyInfoLastFetch", timestamp.toString());
    },
  },

  actions: {
    async fetchCompanyInfo({ commit, state }) {
      console.log("fetchCompanyInfo action çağrıldı");
      // Cache kontrolü - 1 saat
      const now = Date.now();
      const oneHour = 60 * 60 * 1000;

      if (
        state.companyInfo &&
        state.lastFetch &&
        now - state.lastFetch < oneHour
      ) {
        console.log(
          "Cache geçerli, mevcut CompanyInfo döndürülüyor:",
          state.companyInfo
        );
        return state.companyInfo; // Cache geçerli
      }

      try {
        console.log("API'den CompanyInfo yükleniyor...");
        commit("SET_LOADING", true);
        const response = await CompanyInfoService.getActiveSingle();
        console.log("API response:", response);

        if (response.result && response.data) {
          console.log("CompanyInfo başarıyla yüklendi:", response.data);
          commit("SET_COMPANY_INFO", response.data);
          commit("SET_LAST_FETCH", now);
          return response.data;
        } else {
          console.log("CompanyInfo bulunamadı");
          commit("SET_COMPANY_INFO", null);
          return null;
        }
      } catch (error) {
        console.error("Şirket bilgileri yüklenirken hata:", error);
        commit("SET_COMPANY_INFO", null);
        return null;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async updateCompanyInfo({ commit, dispatch }, companyInfo: CompanyInfoDto) {
      try {
        commit("SET_LOADING", true);

        let response;
        if (companyInfo.id) {
          // Güncelleme
          response = await CompanyInfoService.update(companyInfo as any);
        } else {
          // Yeni oluşturma
          response = await CompanyInfoService.create(companyInfo as any);
        }

        if (response.result && response.data) {
          commit("SET_COMPANY_INFO", response.data);
          commit("SET_LAST_FETCH", Date.now());
          return response.data;
        }
        return null;
      } catch (error) {
        console.error("Şirket bilgileri güncellenirken hata:", error);
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async createCompanyInfo({ commit, dispatch }, companyInfo: any) {
      try {
        commit("SET_LOADING", true);

        const response = await CompanyInfoService.create(companyInfo);

        if (response.result && response.data) {
          commit("SET_COMPANY_INFO", response.data);
          commit("SET_LAST_FETCH", Date.now());
          return response.data;
        }
        return null;
      } catch (error) {
        console.error("Şirket bilgileri oluşturulurken hata:", error);
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    clearCompanyInfo({ commit }) {
      commit("SET_COMPANY_INFO", null);
      commit("SET_LAST_FETCH", null);
      localStorage.removeItem("companyInfo");
      localStorage.removeItem("companyInfoLastFetch");
    },
  },

  getters: {
    companyInfo: (state) => state.companyInfo,
    logoUrl: (state) => state.companyInfo?.logoUrl || null,
    companyName: (state) => state.companyInfo?.name || "Şirket Adı",
    isLoading: (state) => state.loading,
    hasCompanyInfo: (state) => !!state.companyInfo,
  },
};

export default CompanyInfoModule;
