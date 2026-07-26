"use client";

import { useEffect, useState } from "react";
import {
  defaultLanguage,
  languageStorageKey,
  languages,
} from "@/lib/language";
import { useUiText } from "@/hooks/use-language";
import type { LanguageKey } from "@/types/nebuta";

export function LanguageSwitcher() {
  const getUiText = useUiText();
  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageKey>(defaultLanguage);

  useEffect(() => {
    const documentLanguage = document.documentElement.dataset.lang;
    const activeLanguage = languages.find(
      ({ key }) => key === documentLanguage,
    );

    if (activeLanguage) {
      setSelectedLanguage(activeLanguage.key);
    }
  }, []);

  function selectLanguage(key: LanguageKey, htmlLang: string) {
    document.documentElement.dataset.lang = key;
    document.documentElement.lang = htmlLang;

    try {
      localStorage.setItem(languageStorageKey, key);
    } catch (e) {}

    setSelectedLanguage(key);
  }

  return (
    <div
      className="language-switcher"
      role="group"
      aria-label={getUiText("languageGroupLabel")}
    >
      {languages.map(({ key, label, htmlLang }) => (
        <button
          className="language-switcher-button"
          type="button"
          lang={htmlLang}
          aria-pressed={selectedLanguage === key}
          onClick={() => selectLanguage(key, htmlLang)}
          key={key}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
