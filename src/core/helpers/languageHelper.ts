import { LanguageDto } from "@/services/LanguageService";

/**
 * Seçili dili localStorage'dan alır
 */
export const getSelectedLanguage = (): LanguageDto | null => {
  const savedLanguage = localStorage.getItem("selectedLanguage");
  if (savedLanguage) {
    try {
      return JSON.parse(savedLanguage);
    } catch (error) {
      console.error("Kaydedilmiş dil yüklenirken hata:", error);
    }
  }
  return null;
};

/**
 * Seçili dili localStorage'a kaydeder
 */
export const setSelectedLanguage = (language: LanguageDto): void => {
  localStorage.setItem("selectedLanguage", JSON.stringify(language));
};

/**
 * Dil koduna göre bayrak URL'ini döndürür
 */
export const getFlagUrl = (code: string): string => {
  const flagMap: { [key: string]: string } = {
    tr: "turkey.svg",
    en: "united-kingdom.svg",
    de: "germany.svg",
    fr: "france.svg",
    es: "spain.svg",
    it: "italy.svg",
    ru: "russia.svg",
    ar: "saudi-arabia.svg",
    zh: "china.svg",
    ja: "japan.svg",
    ko: "south-korea.svg",
    pt: "portugal.svg",
    nl: "netherlands.svg",
    pl: "poland.svg",
    sv: "sweden.svg",
    da: "denmark.svg",
    no: "norway.svg",
    fi: "finland.svg",
    cs: "czech-republic.svg",
    sk: "slovakia.svg",
    hu: "hungary.svg",
    ro: "romania.svg",
    bg: "bulgaria.svg",
    hr: "croatia.svg",
    sl: "slovenia.svg",
    et: "estonia.svg",
    lv: "latvia.svg",
    lt: "lithuania.svg",
    mt: "malta.svg",
    cy: "cyprus.svg",
    el: "greece.svg",
    // Varsayılan olarak Türkçe bayrağı
    default: "turkey.svg",
  };

  const flagFile = flagMap[code.toLowerCase()] || flagMap.default;
  return `/media/flags/${flagFile}`;
};

/**
 * Dil kodunu API header'ı için formatlar
 */
export const getLanguageHeader = (): string => {
  const selectedLanguage = getSelectedLanguage();
  return selectedLanguage?.code || "tr";
};
