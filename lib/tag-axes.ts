import type { NebutaTags } from "@/types/nebuta";

export type TagAxis = Readonly<{
  key: keyof NebutaTags;
  label: string;
  colorVariable: `--axis-${string}`;
}>;

export const tagAxes = [
  { key: "themes", label: "テーマ", colorVariable: "--axis-theme" },
  { key: "messages", label: "題材", colorVariable: "--axis-subject" },
  { key: "scenes", label: "場面", colorVariable: "--axis-scene" },
  {
    key: "historicalContexts",
    label: "時代・出典",
    colorVariable: "--axis-era",
  },
] as const satisfies readonly TagAxis[];
