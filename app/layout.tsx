import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { ServiceWorker } from "@/components/service-worker";
import { withBasePath } from "@/lib/base-path";
import { languageStorageKey, languages } from "@/lib/language";
import "./globals.css";

export const metadata: Metadata = {
  title: "ねぶたガイド",
  description: "青森大学 多言語ねぶたガイド",
  manifest: withBasePath("/manifest.webmanifest"),
  icons: {
    apple: [
      {
        url: withBasePath("/apple-touch-icon.png"),
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f5f0e4",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

const serializedLanguages = JSON.stringify(languages).replace(/</g, "\\u003c");

const languageInitializationScript = `
(function () {
  try {
    var languageOptions = ${serializedLanguages};
    var validLanguageKeys = languageOptions.map(function (option) {
      return option.key;
    });
    var storedLanguage = null;

    try {
      storedLanguage = localStorage.getItem(${JSON.stringify(languageStorageKey)});
    } catch (e) {}

    var selectedLanguage =
      validLanguageKeys.indexOf(storedLanguage) !== -1 ? storedLanguage : null;

    if (!selectedLanguage) {
      var browserLanguages =
        navigator.languages && navigator.languages.length > 0
          ? navigator.languages
          : [navigator.language];

      for (var index = 0; index < browserLanguages.length; index += 1) {
        var candidate = browserLanguages[index];

        if (typeof candidate !== "string") {
          continue;
        }

        var normalized = candidate.toLowerCase();

        if (normalized.indexOf("ja") === 0) {
          selectedLanguage = "ja";
        } else if (normalized.indexOf("en") === 0) {
          selectedLanguage = "en";
        } else if (normalized.indexOf("ko") === 0) {
          selectedLanguage = "ko";
        } else if (
          /^(zh-hant|zh-tw|zh-hk|zh-mo)(-|$)/.test(normalized)
        ) {
          selectedLanguage = "zhHant";
        } else if (normalized.indexOf("zh") === 0) {
          selectedLanguage = "zhHans";
        }

        if (selectedLanguage) {
          break;
        }
      }
    }

    selectedLanguage = selectedLanguage || "ja";

    for (var optionIndex = 0; optionIndex < languageOptions.length; optionIndex += 1) {
      var selectedOption = languageOptions[optionIndex];

      if (selectedOption.key === selectedLanguage) {
        document.documentElement.dataset.lang = selectedOption.key;
        document.documentElement.lang = selectedOption.htmlLang;
        break;
      }
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ja" data-lang="ja" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: languageInitializationScript }}
        />
      </head>
      <body>
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}
