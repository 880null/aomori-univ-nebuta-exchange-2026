"use client";

import { useCallback, useEffect, useState } from "react";
import { defaultLanguage, languages } from "@/lib/language";
import {
  formatUiText,
  uiText,
  type UiTextKey,
} from "@/lib/ui-text";
import type { LanguageKey } from "@/types/nebuta";

function getDocumentLanguage(): LanguageKey | undefined {
  const documentLanguage = document.documentElement.dataset.lang;
  return languages.find(({ key }) => key === documentLanguage)?.key;
}

export function useLanguage(): LanguageKey {
  const [language, setLanguage] = useState<LanguageKey>(defaultLanguage);

  useEffect(() => {
    const updateLanguage = () => {
      const documentLanguage = getDocumentLanguage();

      if (documentLanguage) {
        setLanguage(documentLanguage);
      }
    };

    updateLanguage();

    const observer = new MutationObserver(updateLanguage);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-lang"],
    });

    return () => observer.disconnect();
  }, []);

  return language;
}

export function useUiText(): (
  textKey: UiTextKey,
  values?: Record<string, string | number>,
) => string {
  const language = useLanguage();

  return useCallback(
    (textKey, values) => {
      const template = uiText[textKey][language];
      return values ? formatUiText(template, values) : template;
    },
    [language],
  );
}
