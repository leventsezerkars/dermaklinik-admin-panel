/**
 * Favicon işlemleri için helper fonksiyonlar
 */

/**
 * Base64 string'den favicon oluşturur ve sayfaya ekler
 * @param base64String - Base64 logo string
 */
export const setFaviconFromBase64 = (base64String: string): void => {
  if (!base64String) {
    return;
  }

  try {
    // Mevcut favicon'ları kaldır
    const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
    existingFavicons.forEach((link) => link.remove());

    // Yeni favicon oluştur
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/x-icon";
    link.href = base64String;

    // Head'e ekle
    document.head.appendChild(link);
  } catch (error) {
    console.error("Favicon oluşturulurken hata:", error);
  }
};

/**
 * Varsayılan favicon'u geri yükler
 */
export const resetFavicon = (): void => {
  try {
    // Mevcut favicon'ları kaldır
    const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
    existingFavicons.forEach((link) => link.remove());

    // Varsayılan favicon'u ekle
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/x-icon";
    link.href = "/favicon.ico"; // Varsayılan favicon yolu

    document.head.appendChild(link);
  } catch (error) {
    console.error("Favicon sıfırlanırken hata:", error);
  }
};

/**
 * Base64 string'in geçerli bir resim olup olmadığını kontrol eder
 * @param base64String - Base64 string
 * @returns boolean - Geçerli resim mi
 */
export const isValidImageBase64 = (base64String: string): boolean => {
  if (!base64String || !base64String.startsWith("data:image/")) {
    return false;
  }

  return true;
};

/**
 * Şirket logosunu favicon olarak ayarlar
 * @param logoUrl - Logo URL'i (Base64 veya normal URL)
 */
export const setCompanyFavicon = (logoUrl: string | null): void => {
  if (!logoUrl) {
    resetFavicon();
    return;
  }

  if (isValidImageBase64(logoUrl)) {
    setFaviconFromBase64(logoUrl);
  } else if (logoUrl.startsWith("http")) {
    // Normal URL ise favicon olarak kullan
    const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
    existingFavicons.forEach((link) => link.remove());

    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/x-icon";
    link.href = logoUrl;

    document.head.appendChild(link);
  }
};
