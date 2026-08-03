export type TextSegment = {
  text: string;
  strong: boolean;
};

export function parseEmphasis(paragraph: string): TextSegment[] {
  const sections = paragraph.split("**");

  if (sections.length % 2 === 0) {
    return [{ text: paragraph, strong: false }];
  }

  return sections
    .map((text, index) => ({
      text,
      strong: index % 2 === 1,
    }))
    .filter(({ text }) => text !== "");
}
