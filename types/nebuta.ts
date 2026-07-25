export const languageKeys = [
  "ja",
  "jaEasy",
  "en",
  "zhHans",
  "zhHant",
  "ko",
] as const;

export type LanguageKey = (typeof languageKeys)[number];

export type NebutaBodies = Record<LanguageKey, string>;

export type NebutaTags = {
  themes: string[];
  messages: string[];
  scenes: string[];
  historicalContexts: string[];
};

export type NebutaFloat = {
  rowNumber: number;
  title: string;
  titleReading?: string;
  org: string;
  creator: string;
  bodies: NebutaBodies;
  tags: NebutaTags;
  highlight: string;
  imagePath: string;
  license: string;
};
