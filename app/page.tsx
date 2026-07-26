/*
THESIS: 混雑した屋外でも全作品を速く走査できる目録。カード型UIを拒否する。
OWN-WORLD: 和紙、墨、罫線を基調に、4つの濃彩をタグ識別だけに使う。
STORY: 利用者は全23作品を見渡し、原画・題名・団体・制作者・解説を理解する。
FIRST VIEWPORT: 画面上部に小さなプロジェクト名、主見出し、件数を置き、続いて112pxの原画を持つ作品行を見せる。
FORM: 図録の作品目録。seed key: 525ac87f。
*/
import { NebutaEntry } from "@/components/nebuta-entry";
import { getNebutaFloats } from "@/lib/nebuta";

export default function Home() {
  const nebutaFloats = getNebutaFloats();

  return (
    <main className="page">
      <header className="catalog-header">
        <p className="eyebrow">青森大学 国際交流プロジェクト</p>
        <h1 id="page-title">ねぶたガイド</h1>
        <p className="image-note">掲載画像は原画です</p>
        <p className="catalog-summary">
          <span className="catalog-count">{nebutaFloats.length}</span>
          <span>作品</span>
        </p>
      </header>

      <section className="catalog" aria-labelledby="page-title">
        <ul className="catalog-list">
          {nebutaFloats.map((nebuta) => (
            <NebutaEntry nebuta={nebuta} key={nebuta.rowNumber} />
          ))}
        </ul>
      </section>
    </main>
  );
}
