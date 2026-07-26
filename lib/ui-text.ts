import type { LanguageKey } from "@/types/nebuta";

// UI文言の辞書。ここはこちらが著述する箇所であり、翻訳してよい。
// 提供された解説本文・題名・団体名・制作者名・タグ値はデータ側の日本語であり、
// 翻訳も書き換えもしない。中国語・韓国語・やさしい日本語の訳は留学生TAによる確認が必要。
export type UiTextKey =
  | "eyebrow"
  | "siteTitle"
  | "imageNote"
  | "worksUnit"
  | "filterHeading"
  | "filterOpen"
  | "filterClose"
  | "selectedLabel"
  | "clearAll"
  | "resultAll"
  | "resultFiltered"
  | "axisTheme"
  | "axisSubject"
  | "axisScene"
  | "axisEra"
  | "orgLabel"
  | "creatorLabel"
  | "languageGroupLabel"
  | "removeFilter"
  | "backToList"
  | "serialNumber"
  | "gengaCaption"
  | "highlightHeading"
  | "bodyHeading"
  | "tagsHeading"
  | "paginationLabel"
  | "previousWork"
  | "nextWork";

export const uiText = {
  eyebrow: {
    ja: "青森大学 国際交流プロジェクト",
    jaEasy: "青森大学の 国際交流プロジェクト",
    en: "Aomori University International Exchange Project",
    zhHans: "青森大学 国际交流项目",
    zhHant: "青森大學 國際交流專案",
    ko: "아오모리대학 국제교류 프로젝트",
  },
  siteTitle: {
    ja: "ねぶたガイド",
    jaEasy: "ねぶたガイド",
    en: "Nebuta Guide",
    zhHans: "睡魔祭指南",
    zhHant: "睡魔祭指南",
    ko: "네부타 가이드",
  },
  imageNote: {
    ja: "掲載画像は原画です",
    jaEasy: "ここに ある 絵は 原画です",
    en: "The images shown are the original artwork.",
    zhHans: "所刊登的图片为原画。",
    zhHant: "所刊登的圖片為原畫。",
    ko: "게재된 이미지는 원화입니다.",
  },
  worksUnit: {
    ja: "作品",
    jaEasy: "作品",
    en: "works",
    zhHans: "作品",
    zhHant: "作品",
    ko: "작품",
  },
  filterHeading: {
    ja: "絞り込み",
    jaEasy: "しぼりこみ",
    en: "Filter",
    zhHans: "筛选",
    zhHant: "篩選",
    ko: "필터",
  },
  filterOpen: {
    ja: "条件を選ぶ",
    jaEasy: "じょうけんを えらぶ",
    en: "Choose filters",
    zhHans: "选择条件",
    zhHant: "選擇條件",
    ko: "조건 선택",
  },
  filterClose: {
    ja: "閉じる",
    jaEasy: "とじる",
    en: "Close",
    zhHans: "关闭",
    zhHant: "關閉",
    ko: "닫기",
  },
  selectedLabel: {
    ja: "選択中",
    jaEasy: "えらんで いるもの",
    en: "Selected",
    zhHans: "已选择",
    zhHant: "已選擇",
    ko: "선택 중",
  },
  clearAll: {
    ja: "すべて解除",
    jaEasy: "ぜんぶ やめる",
    en: "Clear all",
    zhHans: "全部清除",
    zhHant: "全部清除",
    ko: "모두 해제",
  },
  resultAll: {
    ja: "全{n}件",
    jaEasy: "ぜんぶで {n}件",
    en: "All {n} works",
    zhHans: "共{n}件",
    zhHant: "共{n}件",
    ko: "전체 {n}건",
  },
  resultFiltered: {
    ja: "{total}件中 {n}件を表示",
    jaEasy: "{total}件の うち {n}件を 見せて います",
    en: "Showing {n} of {total}",
    zhHans: "共{total}件，显示{n}件",
    zhHant: "共{total}件，顯示{n}件",
    ko: "{total}건 중 {n}건 표시",
  },
  axisTheme: {
    ja: "テーマ",
    jaEasy: "テーマ",
    en: "Theme",
    zhHans: "主题",
    zhHant: "主題",
    ko: "테마",
  },
  axisSubject: {
    ja: "題材",
    jaEasy: "だいざい",
    en: "Subject",
    zhHans: "题材",
    zhHant: "題材",
    ko: "소재",
  },
  axisScene: {
    ja: "場面",
    jaEasy: "ばめん",
    en: "Scene",
    zhHans: "场面",
    zhHant: "場面",
    ko: "장면",
  },
  axisEra: {
    ja: "時代・出典",
    jaEasy: "じだい・でどころ",
    en: "Period & source",
    zhHans: "时代・出处",
    zhHant: "時代・出處",
    ko: "시대・출전",
  },
  orgLabel: {
    ja: "団体名",
    jaEasy: "だんたいの なまえ",
    en: "Organization",
    zhHans: "团体名称",
    zhHant: "團體名稱",
    ko: "단체명",
  },
  creatorLabel: {
    ja: "制作者名",
    jaEasy: "つくった 人の なまえ",
    en: "Artist",
    zhHans: "制作者",
    zhHant: "製作者",
    ko: "제작자명",
  },
  languageGroupLabel: {
    ja: "表示言語",
    jaEasy: "ことばを えらぶ",
    en: "Display language",
    zhHans: "显示语言",
    zhHant: "顯示語言",
    ko: "표시 언어",
  },
  removeFilter: {
    ja: "{tag}の絞り込みを解除",
    jaEasy: "{tag}を やめる",
    en: "Remove filter: {tag}",
    zhHans: "取消筛选：{tag}",
    zhHant: "取消篩選：{tag}",
    ko: "{tag} 필터 해제",
  },
  backToList: {
    ja: "一覧へ戻る",
    jaEasy: "リストに もどる",
    en: "Back to the list",
    zhHans: "返回列表",
    zhHant: "返回列表",
    ko: "목록으로 돌아가기",
  },
  serialNumber: {
    ja: "通し番号",
    jaEasy: "ばんごう",
    en: "No.",
    zhHans: "编号",
    zhHant: "編號",
    ko: "번호",
  },
  gengaCaption: {
    ja: "原画",
    jaEasy: "原画",
    en: "Original artwork",
    zhHans: "原画",
    zhHant: "原畫",
    ko: "원화",
  },
  highlightHeading: {
    ja: "見どころ",
    jaEasy: "みどころ",
    en: "Highlights",
    zhHans: "看点",
    zhHant: "看點",
    ko: "볼거리",
  },
  bodyHeading: {
    ja: "解説",
    jaEasy: "せつめい",
    en: "About this Nebuta",
    zhHans: "解说",
    zhHant: "解說",
    ko: "해설",
  },
  tagsHeading: {
    ja: "タグ",
    jaEasy: "タグ",
    en: "Tags",
    zhHans: "标签",
    zhHant: "標籤",
    ko: "태그",
  },
  paginationLabel: {
    ja: "前後の作品",
    jaEasy: "まえと つぎの 作品",
    en: "Previous and next works",
    zhHans: "前后的作品",
    zhHant: "前後的作品",
    ko: "이전·다음 작품",
  },
  previousWork: {
    ja: "前の作品",
    jaEasy: "まえの 作品",
    en: "Previous",
    zhHans: "上一件",
    zhHant: "上一件",
    ko: "이전 작품",
  },
  nextWork: {
    ja: "次の作品",
    jaEasy: "つぎの 作品",
    en: "Next",
    zhHans: "下一件",
    zhHant: "下一件",
    ko: "다음 작품",
  },
} satisfies Record<UiTextKey, Record<LanguageKey, string>>;

export function formatUiText(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{([^{}]+)\}/g, (placeholder, key: string) =>
    Object.prototype.hasOwnProperty.call(values, key)
      ? String(values[key])
      : placeholder,
  );
}
