import type { UiTextKey } from "@/lib/ui-text";
import type { NebutaTags } from "@/types/nebuta";

export type TagAxis = Readonly<{
  key: keyof NebutaTags;
  labelKey: UiTextKey;
  colorVariable: `--axis-${string}`;
}>;

export const tagAxes = [
  {
    key: "themes",
    labelKey: "axisTheme",
    colorVariable: "--axis-theme",
  },
  {
    key: "messages",
    labelKey: "axisSubject",
    colorVariable: "--axis-subject",
  },
  {
    key: "scenes",
    labelKey: "axisScene",
    colorVariable: "--axis-scene",
  },
  {
    key: "historicalContexts",
    labelKey: "axisEra",
    colorVariable: "--axis-era",
  },
] as const satisfies readonly TagAxis[];
