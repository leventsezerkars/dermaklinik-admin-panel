/**
 * Favicon işlemleri için helper fonksiyonlar
 */

/**
 * Base64 string'i dosyaya çevirir
 * @param base64String - Base64 string
 * @param filename - Dosya adı
 * @returns Promise<string> - Dosya URL'i
 */
export const saveBase64ToFile = async (
  base64String: string,
  filename: string
): Promise<string> => {
  try {
    // Base64'ü blob'a çevir
    const response = await fetch(base64String);
    const blob = await response.blob();

    // Dosyayı oluştur
    const file = new File([blob], filename, { type: blob.type });

    // FormData oluştur
    const formData = new FormData();
    formData.append("file", file);

    // Dosyayı sunucuya yükle (bu örnekte localStorage kullanıyoruz)
    // Gerçek uygulamada API endpoint'i kullanılmalı
    const fileUrl = URL.createObjectURL(blob);

    console.log("Base64 dosyaya çevrildi:", fileUrl);
    return fileUrl;
  } catch (error) {
    console.error("Base64 dosyaya çevrilirken hata:", error);
    return base64String; // Hata durumunda orijinal base64'ü döndür
  }
};

/**
 * Base64 string'den favicon oluşturur ve sayfaya ekler
 * @param base64String - Base64 logo string
 */
export const setFaviconFromBase64 = (base64String: string): void => {
  if (!base64String) {
    console.log("Base64 string boş, favicon güncellenmedi");
    return;
  }

  try {
    console.log("Mevcut favicon'lar kaldırılıyor...");
    // Mevcut favicon'ları kaldır - daha kapsamlı selector
    const existingFavicons = document.querySelectorAll(
      'link[rel*="icon"], link[rel*="shortcut"], link[rel*="apple-touch-icon"]'
    );
    console.log("Kaldırılan favicon sayısı:", existingFavicons.length);
    existingFavicons.forEach((link) => link.remove());

    // Ana favicon (en önemli)
    const mainFavicon = document.createElement("link");
    mainFavicon.rel = "icon";
    mainFavicon.type = "image/x-icon";
    mainFavicon.href = base64String;
    document.head.appendChild(mainFavicon);

    // Farklı boyutlarda favicon'lar oluştur
    const sizes = [
      { size: "16x16", rel: "icon" },
      { size: "32x32", rel: "icon" },
      { size: "48x48", rel: "icon" },
      { size: "64x64", rel: "icon" },
      { size: "96x96", rel: "icon" },
      { size: "128x128", rel: "icon" },
      { size: "192x192", rel: "icon" },
      { size: "256x256", rel: "icon" },
      { size: "512x512", rel: "icon" },
    ];

    sizes.forEach(({ size, rel }) => {
      const link = document.createElement("link");
      link.rel = rel;
      link.type = "image/x-icon";
      link.setAttribute("sizes", size);
      link.href = base64String;
      document.head.appendChild(link);
    });

    // Apple touch icon
    const appleTouchIcon = document.createElement("link");
    appleTouchIcon.rel = "apple-touch-icon";
    appleTouchIcon.href = base64String;
    document.head.appendChild(appleTouchIcon);

    // Shortcut icon (eski tarayıcılar için)
    const shortcutIcon = document.createElement("link");
    shortcutIcon.rel = "shortcut icon";
    shortcutIcon.type = "image/x-icon";
    shortcutIcon.href = base64String;
    document.head.appendChild(shortcutIcon);

    // Manifest için
    const manifestIcon = document.createElement("link");
    manifestIcon.rel = "manifest";
    manifestIcon.href =
      "data:application/json;base64,eyJuYW1lIjoiQXBwIiwiaWNvbnMiOlt7InNyYyI6IiIsInNpemVzIjoiMTkyeDE5MiIsInR5cGUiOiJpbWFnZS9wbmcifV19";
    document.head.appendChild(manifestIcon);

    console.log(
      "Yeni favicon'lar eklendi:",
      base64String.substring(0, 50) + "..."
    );

    // Tarayıcı cache'ini temizlemek için timestamp ekle
    setTimeout(() => {
      const timestamp = Date.now();
      const allFavicons = document.querySelectorAll('link[rel*="icon"]');
      allFavicons.forEach((link) => {
        const originalHref = link.getAttribute("href");
        if (originalHref && !originalHref.includes("?")) {
          link.setAttribute("href", `${originalHref}?v=${timestamp}`);
        }
      });
    }, 100);
  } catch (error) {
    console.error("Favicon oluşturulurken hata:", error);
  }
};

/**
 * URL'den favicon oluşturur ve sayfaya ekler
 * @param url - Logo URL'i
 */
export const setFaviconFromUrl = (url: string): void => {
  if (!url) {
    console.log("URL boş, favicon güncellenmedi");
    return;
  }

  try {
    console.log("URL'den favicon güncelleniyor:", url);
    // Mevcut favicon'ları kaldır
    const existingFavicons = document.querySelectorAll(
      'link[rel*="icon"], link[rel*="shortcut"], link[rel*="apple-touch-icon"]'
    );
    console.log("Kaldırılan favicon sayısı:", existingFavicons.length);
    existingFavicons.forEach((link) => link.remove());

    // Ana favicon
    const mainFavicon = document.createElement("link");
    mainFavicon.rel = "icon";
    mainFavicon.type = "image/x-icon";
    mainFavicon.href = url;
    document.head.appendChild(mainFavicon);

    // Farklı boyutlarda favicon'lar
    const sizes = [
      "16x16",
      "32x32",
      "48x48",
      "64x64",
      "96x96",
      "128x128",
      "192x192",
      "256x256",
      "512x512",
    ];

    sizes.forEach((size) => {
      const link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/x-icon";
      link.setAttribute("sizes", size);
      link.href = url;
      document.head.appendChild(link);
    });

    // Apple touch icon
    const appleTouchIcon = document.createElement("link");
    appleTouchIcon.rel = "apple-touch-icon";
    appleTouchIcon.href = url;
    document.head.appendChild(appleTouchIcon);

    // Shortcut icon
    const shortcutIcon = document.createElement("link");
    shortcutIcon.rel = "shortcut icon";
    shortcutIcon.type = "image/x-icon";
    shortcutIcon.href = url;
    document.head.appendChild(shortcutIcon);

    console.log("URL'den favicon'lar eklendi:", url);
  } catch (error) {
    console.error("URL'den favicon oluşturulurken hata:", error);
  }
};

/**
 * Varsayılan favicon'u geri yükler
 */
export const resetFavicon = (): void => {
  try {
    console.log("Favicon sıfırlanıyor...");
    // Mevcut favicon'ları kaldır
    const existingFavicons = document.querySelectorAll(
      'link[rel*="icon"], link[rel*="shortcut"]'
    );
    console.log("Kaldırılan favicon sayısı:", existingFavicons.length);
    existingFavicons.forEach((link) => link.remove());

    // Varsayılan favicon'u ekle
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/x-icon";
    link.href = "/favicon.ico"; // Varsayılan favicon yolu

    document.head.appendChild(link);
    console.log("Varsayılan favicon eklendi");
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
export const setCompanyFavicon = async (
  logoUrl: string | null
): Promise<void> => {
  console.log("setCompanyFavicon çağrıldı:", logoUrl);

  if (!logoUrl) {
    console.log("Logo URL yok, varsayılan favicon'a dönülüyor");
    resetFavicon();
    return;
  }

  if (isValidImageBase64(logoUrl)) {
    console.log("Base64 logo tespit edildi, dosyaya çevriliyor...");
    try {
      // Base64'ü dosyaya çevir
      const fileUrl = await saveBase64ToFile(logoUrl, "company-logo.png");
      console.log("Dosya URL'i oluşturuldu:", fileUrl);

      // Dosya URL'ini favicon olarak kullan
      setFaviconFromUrl(fileUrl);
    } catch (error) {
      console.error("Base64 dosyaya çevrilirken hata:", error);
      // Hata durumunda orijinal base64'ü kullan
      setFaviconFromBase64(logoUrl);
    }
  } else if (logoUrl.startsWith("http")) {
    console.log("HTTP URL logo tespit edildi, favicon güncelleniyor");
    setFaviconFromUrl(logoUrl);
  } else {
    console.warn("Geçersiz logo URL formatı:", logoUrl);
  }
};

// Test fonksiyonu - browser console'da çağırabilirsiniz
(window as any).testFavicon = async () => {
  console.log("Test favicon çağrıldı");
  const testLogo =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNCIgZmlsbD0iIzAwOWVmNyIvPgo8dGV4dCB4PSIxNiIgeT0iMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkQ8L3RleHQ+Cjwvc3ZnPgo=";
  await setCompanyFavicon(testLogo);
};
