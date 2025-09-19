/**
 * Slug ve anahtar kelime işlemleri için helper fonksiyonlar
 */

/**
 * Türkçe karakterleri İngilizce karşılıklarına çevirir
 * @param text - Çevrilecek metin
 * @returns string - Çevrilmiş metin
 */
export const turkishToEnglish = (text: string): string => {
  const turkishChars: { [key: string]: string } = {
    ç: "c",
    Ç: "C",
    ğ: "g",
    Ğ: "G",
    ı: "i",
    I: "i", // Büyük İ harfi küçük i'ye çevriliyor
    ö: "o",
    Ö: "O",
    ş: "s",
    Ş: "S",
    ü: "u",
    Ü: "U",
  };

  return text.replace(/[çÇğĞıIöÖşŞüÜ]/g, (char) => turkishChars[char] || char);
};

/**
 * Metni slug formatına çevirir
 * @param text - Slug'a çevrilecek metin
 * @returns string - Slug formatında metin
 */
export const createSlug = (text: string): string => {
  if (!text) return "";

  return text
    .toLowerCase()
    .trim()
    .replace(/[çÇğĞıIöÖşŞüÜ]/g, (char) => turkishToEnglish(char))
    .replace(/[^a-z0-9\s-]/g, "") // Sadece harf, rakam, boşluk ve tire bırak
    .replace(/\s+/g, "-") // Boşlukları tire ile değiştir
    .replace(/-+/g, "-") // Birden fazla tireyi tek tire yap
    .replace(/^-|-$/g, ""); // Başta ve sonda tire varsa kaldır
};

/**
 * Metindeki kelimeleri anahtar kelime olarak çıkarır
 * @param text - Anahtar kelime çıkarılacak metin
 * @returns string - Virgülle ayrılmış anahtar kelimeler
 */
export const extractKeywords = (text: string): string => {
  if (!text) return "";

  // Stop words (Türkçe ve İngilizce)
  const stopWords = new Set([
    // Türkçe
    "ve",
    "veya",
    "ile",
    "için",
    "olan",
    "bir",
    "bu",
    "şu",
    "o",
    "da",
    "de",
    "ta",
    "te",
    "den",
    "dan",
    "ten",
    "tan",
    "nin",
    "nın",
    "nun",
    "nün",
    "in",
    "ın",
    "un",
    "ün",
    "mi",
    "mı",
    "mu",
    "mü",
    "ki",
    "dır",
    "dir",
    "dur",
    "dür",
    "tır",
    "tir",
    "tur",
    "tür",
    "ise",
    "eğer",
    "ama",
    "ancak",
    "fakat",
    "çünkü",
    "zira",
    "böylece",
    "böyle",
    "şöyle",
    "nasıl",
    "neden",
    "niçin",
    "ne",
    "kim",
    "kime",
    "kimi",
    "kimin",
    "kimde",
    "kimden",
    "nere",
    "nerede",
    "nereden",
    "nereye",
    "hangi",
    "hangisi",
    "kaç",
    "kaçıncı",
    "en",
    "çok",
    "az",
    "daha",
    "çok",
    "pek",
    "çok",
    "biraz",
    "biraz",
    "çok",
    "az",
    "hepsi",
    "hiç",
    "hiçbir",
    "bazı",
    "birkaç",
    "her",
    "herkes",
    "kimse",
    "hiçkimse",
    "kendi",
    "kendisi",
    "kendileri",
    "ben",
    "sen",
    "o",
    "biz",
    "siz",
    "onlar",
    "benim",
    "senin",
    "onun",
    "bizim",
    "sizin",
    "onların",
    "beni",
    "seni",
    "onu",
    "bizi",
    "sizi",
    "onları",
    "bana",
    "sana",
    "ona",
    "bize",
    "size",
    "onlara",
    "bende",
    "sende",
    "onda",
    "bizde",
    "sizde",
    "onlarda",
    "benden",
    "senden",
    "ondan",
    "bizden",
    "sizden",
    "onlardan",
    "benimle",
    "seninle",
    "onunla",
    "bizimle",
    "sizinle",
    "onlarla",
    // İngilizce
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "by",
    "for",
    "from",
    "has",
    "he",
    "in",
    "is",
    "it",
    "its",
    "of",
    "on",
    "that",
    "the",
    "to",
    "was",
    "will",
    "with",
    "would",
    "i",
    "you",
    "we",
    "they",
    "me",
    "him",
    "her",
    "us",
    "them",
    "my",
    "your",
    "his",
    "her",
    "our",
    "their",
    "this",
    "these",
    "that",
    "those",
    "what",
    "which",
    "who",
    "whom",
    "whose",
    "where",
    "when",
    "why",
    "how",
    "all",
    "any",
    "both",
    "each",
    "few",
    "more",
    "most",
    "other",
    "some",
    "such",
    "no",
    "nor",
    "not",
    "only",
    "own",
    "same",
    "so",
    "than",
    "too",
    "very",
    "can",
    "could",
    "should",
    "would",
  ]);

  return text
    .toLowerCase()
    .trim()
    .replace(/[çÇğĞıIöÖşŞüÜ]/g, (char) => turkishToEnglish(char))
    .replace(/[^a-z0-9\s]/g, " ") // Sadece harf, rakam ve boşluk bırak
    .split(/\s+/) // Boşluklara göre böl
    .filter((word) => word.length > 2) // 2 karakterden uzun kelimeler
    .filter((word) => !stopWords.has(word)) // Stop words'leri filtrele
    .filter((word, index, array) => array.indexOf(word) === index) // Tekrarları kaldır
    .join(", "); // Virgülle birleştir
};

/**
 * Menü adından slug ve anahtar kelimeler oluşturur
 * @param title - Menü adı
 * @returns object - { slug: string, keywords: string }
 */
export const generateMenuData = (
  title: string
): { slug: string; keywords: string } => {
  return {
    slug: createSlug(title),
    keywords: extractKeywords(title),
  };
};
