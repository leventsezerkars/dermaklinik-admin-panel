// Logo yükleme işlemleri için helper fonksiyonlar

/**
 * Dosyayı Base64 string'e çevirir
 * @param file - Yüklenecek dosya
 * @returns Promise<string> - Base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Logo dosyasını doğrular ve Base64'e çevirir
 * @param file - Logo dosyası
 * @param maxSizeMB - Maksimum dosya boyutu (MB)
 * @returns Promise<string> - Base64 string
 */
export const validateAndConvertLogo = async (
  file: File,
  maxSizeMB = 2
): Promise<string> => {
  // Dosya tipi kontrolü
  if (!file.type.startsWith("image/")) {
    throw new Error("Sadece resim dosyaları yüklenebilir");
  }

  // Dosya boyutu kontrolü
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error(`Dosya boyutu ${maxSizeMB}MB'dan büyük olamaz`);
  }

  // Base64'e çevir
  return await fileToBase64(file);
};

/**
 * Base64 string'den dosya boyutunu hesaplar
 * @param base64String - Base64 string
 * @returns number - Dosya boyutu (bytes)
 */
export const getBase64FileSize = (base64String: string): number => {
  const stringLength = base64String.length;
  const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.75;
  return sizeInBytes;
};

/**
 * Base64 string'i formatlar (boyut kontrolü için)
 * @param base64String - Base64 string
 * @param maxSizeMB - Maksimum boyut (MB)
 * @returns string - Formatlanmış Base64 string
 */
export const formatBase64String = (
  base64String: string,
  maxSizeMB = 2
): string => {
  const sizeInMB = getBase64FileSize(base64String) / (1024 * 1024);

  if (sizeInMB > maxSizeMB) {
    console.warn(
      `Base64 string boyutu ${sizeInMB.toFixed(2)}MB, önerilen: ${maxSizeMB}MB`
    );
  }

  return base64String;
};
