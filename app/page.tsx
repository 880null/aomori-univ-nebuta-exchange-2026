/*
THESIS: 混雑した屋外でも全作品を速く走査できる目録。カード型UIを拒否する。
OWN-WORLD: 和紙、墨、罫線を基調に、4つの濃彩をタグ識別だけに使う。
STORY: 利用者は全23作品を見渡すか、関心のあるタグで絞り込み、原画・題名・団体・制作者・解説を理解する。
FIRST VIEWPORT: 画面上部に小さなプロジェクト名、主見出し、件数、折りたたんだ絞り込みを置き、続いて112pxの原画を持つ作品行を見せる。
FORM: 図録の作品目録。seed key: 525ac87f。
*/
import Link from "next/link";
import { CatalogFilter } from "@/components/catalog-filter";
import { LanguageSwitcher } from "@/components/language-switcher";
import { NebutaEntry } from "@/components/nebuta-entry";
import { UiText } from "@/components/ui-text";
import { getNebutaFloats } from "@/lib/nebuta";

export default function Home() {
  const nebutaFloats = getNebutaFloats();

  return (
    <main className="page">
      <header className="catalog-header">
        <p className="eyebrow">
          <UiText textKey="eyebrow" />
        </p>
        <h1 id="page-title">
          <UiText textKey="siteTitle" />
        </h1>
        <p className="image-note">
          <UiText textKey="imageNote" />
        </p>
        <p className="catalog-summary">
          <span className="catalog-count">{nebutaFloats.length}</span>
          <UiText textKey="worksUnit" />
        </p>
      </header>

      <LanguageSwitcher />

      <nav className="map-link-nav">
        <Link className="map-link" href="/map/">
          <UiText textKey="mapLink" />
          <span aria-hidden="true">→</span>
        </Link>
      </nav>

      <section className="catalog" aria-labelledby="page-title">
        <CatalogFilter
          entries={nebutaFloats.map(({ rowNumber, tags }) => ({
            rowNumber,
            tags,
          }))}
        >
          {nebutaFloats.map((nebuta) => (
            <NebutaEntry nebuta={nebuta} key={nebuta.rowNumber} />
          ))}
        </CatalogFilter>
      </section>
    </main>
  );
}
