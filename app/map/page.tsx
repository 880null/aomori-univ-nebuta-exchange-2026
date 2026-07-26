import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { RasselandMap } from "@/components/rasseland-map";
import { UiText } from "@/components/ui-text";
import nebutaData from "@/data/nebuta.json";
import type { NebutaFloat } from "@/types/nebuta";

export default function RasselandGuidePage() {
  const nebutaFloats: NebutaFloat[] = [...nebutaData].sort(
    (first, second) => first.rowNumber - second.rowNumber,
  );

  return (
    <main className="page map-page">
      <Link className="detail-back-link" href="/">
        <UiText textKey="backToList" />
      </Link>

      <LanguageSwitcher />

      <h1 className="map-title">
        <UiText textKey="mapHeading" />
      </h1>

      <RasselandMap />

      <p className="map-guidance">
        <UiText textKey="mapGuidance" />
      </p>

      <section className="map-hut-section" aria-labelledby="map-hut-list-title">
        <h2 id="map-hut-list-title">
          <UiText textKey="mapListHeading" />
        </h2>
        <ol className="map-hut-list">
          {nebutaFloats.map((nebuta) => (
            <li className="map-hut-entry" key={nebuta.rowNumber}>
              <p className="map-hut-number">
                <UiText textKey="hutNumberLabel" />{" "}
                <span>{nebuta.rowNumber}</span>
              </p>
              <h3 className="map-hut-title">
                <Link href={`/nebuta/${nebuta.rowNumber}/`} lang="ja">
                  {nebuta.title}
                </Link>
              </h3>
              <dl className="map-hut-credits">
                <div>
                  <dt>
                    <UiText textKey="orgLabel" />
                  </dt>
                  <dd lang="ja">{nebuta.org}</dd>
                </div>
                {nebuta.creator.trim() !== "" && (
                  <div>
                    <dt>
                      <UiText textKey="creatorLabel" />
                    </dt>
                    <dd lang="ja">{nebuta.creator}</dd>
                  </div>
                )}
              </dl>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
