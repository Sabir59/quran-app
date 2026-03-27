/**
 * constants/translations.ts
 *
 * Curated list of translation languages shown in the Translation Language picker.
 * One high-quality translation per language, ordered by global speaker count.
 * Edition IDs map directly to alquran.cloud API edition codes.
 *
 * Special value 'off' disables translation entirely.
 */

export interface TranslationOption {
  id: string;
  label: string;
  translator: string;
}

export const TRANSLATIONS: TranslationOption[] = [
  { id: "off", label: "Off", translator: "No translation" },
  { id: "en.asad", label: "English", translator: "Muhammad Asad" },
  { id: "ur.jalandhry", label: "Urdu", translator: "Fateh Muhammad Jalandhry" },
  { id: "tr.diyanet", label: "Turkish", translator: "Diyanet İşleri" },
  { id: "fa.makarem", label: "Persian", translator: "Naser Makarem Shirazi" },
  { id: "ru.kuliev", label: "Russian", translator: "Elmir Kuliev" },
  { id: "id.indonesian", label: "Indonesian", translator: "Bahasa Indonesia" },
  { id: "fr.hamidullah", label: "French", translator: "Muhammad Hamidullah" },
  { id: "es.cortes", label: "Spanish", translator: "Julio Cortés" },
  { id: "de.bubenheim", label: "German", translator: "Bubenheim & Elyas" },
  { id: "zh.majian", label: "Chinese", translator: "Ma Jian" },
  { id: "bn.bengali", label: "Bengali", translator: "Muhiuddin Khan" },
  { id: "hi.hindi", label: "Hindi", translator: "Suhel Farooq Khan" },
  { id: "ms.basmeih", label: "Malay", translator: "Abdullah Muhammad Basmeih" },
  { id: "nl.leemhuis", label: "Dutch", translator: "Fred Leemhuis" },
];

export function getTranslationById(id: string): TranslationOption {
  return TRANSLATIONS.find((t) => t.id === id) ?? TRANSLATIONS[1]; // fallback to English
}

export const DEFAULT_TRANSLATION_ID = "en.asad";
