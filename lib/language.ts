import type { LanguageKey } from "@/types/nebuta";

export const defaultLanguage: LanguageKey = "ja";
export const languageStorageKey = "nebuta-language";

type LanguageDefinition = Readonly<{
  key: LanguageKey;
  label: string;
  htmlLang: string;
}>;

function defineLanguages<const T extends readonly LanguageDefinition[]>(
  definitions: T,
  ...missingLanguages: Exclude<
    LanguageKey,
    T[number]["key"]
  > extends never
    ? []
    : ["Missing language definitions", Exclude<LanguageKey, T[number]["key"]>]
): T {
  void missingLanguages;
  return definitions;
}

// The order here is also the display order in the language switcher.
export const languages = defineLanguages(
  [
    { key: "ja", label: "日本語", htmlLang: "ja" },
    { key: "jaEasy", label: "やさしい日本語", htmlLang: "ja" },
    { key: "en", label: "English", htmlLang: "en" },
    { key: "zhHans", label: "简体中文", htmlLang: "zh-Hans" },
    { key: "zhHant", label: "繁體中文", htmlLang: "zh-Hant" },
    { key: "ko", label: "한국어", htmlLang: "ko" },
  ] as const satisfies readonly LanguageDefinition[],
);
