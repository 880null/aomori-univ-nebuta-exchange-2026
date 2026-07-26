import { languages } from "@/lib/language";
import {
  formatUiText,
  uiText,
  type UiTextKey,
} from "@/lib/ui-text";

type UiTextProps = Readonly<{
  textKey: UiTextKey;
  values?: Record<string, string | number>;
  as?: "span" | "p" | "div";
}>;

export function UiText({
  textKey,
  values,
  as: Component = "span",
}: UiTextProps) {
  return (
    <Component>
      {languages.map(({ key, htmlLang }) => {
        const template = uiText[textKey][key];
        const text = values ? formatUiText(template, values) : template;

        return (
          <span data-lang-block={key} lang={htmlLang} key={key}>
            {text}
          </span>
        );
      })}
    </Component>
  );
}
