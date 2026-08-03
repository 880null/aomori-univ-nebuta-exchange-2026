import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";
import { UiText } from "@/components/ui-text";
import { withBasePath } from "@/lib/base-path";
import { languages } from "@/lib/language";
import {
  getNebutaFloatByRowNumber,
  getNebutaRowNumbers,
} from "@/lib/nebuta";
import { parseEmphasis } from "@/lib/rich-text";
import { tagAxes } from "@/lib/tag-axes";

type NebutaDetailPageProps = Readonly<{
  params: Promise<{
    rowNumber: string;
  }>;
}>;

export const dynamicParams = false;

export function generateStaticParams() {
  return getNebutaRowNumbers().map((rowNumber) => ({
    rowNumber: String(rowNumber),
  }));
}

export async function generateMetadata({
  params,
}: NebutaDetailPageProps): Promise<Metadata> {
  const { rowNumber } = await params;
  const nebuta = getNebutaFloatByRowNumber(Number(rowNumber));

  if (!nebuta) {
    notFound();
  }

  return {
    title: `${nebuta.title} | ねぶたガイド`,
    description: nebuta.highlight,
  };
}

export default async function NebutaDetailPage({
  params,
}: NebutaDetailPageProps) {
  const { rowNumber } = await params;
  const nebuta = getNebutaFloatByRowNumber(Number(rowNumber));

  if (!nebuta) {
    notFound();
  }

  const previousNebuta = getNebutaFloatByRowNumber(nebuta.rowNumber - 1);
  const nextNebuta = getNebutaFloatByRowNumber(nebuta.rowNumber + 1);

  return (
    <main className="page detail-page">
      <Link className="detail-back-link" href="/">
        <UiText textKey="backToList" />
      </Link>

      <LanguageSwitcher />

      <header className="detail-header">
        <p className="detail-number">
          <UiText textKey="serialNumber" /> {nebuta.rowNumber}
        </p>
        <h1 lang="ja">{nebuta.title}</h1>
        {nebuta.titleReading && (
          <p className="detail-title-reading" lang="ja">
            {nebuta.titleReading}
          </p>
        )}
      </header>

      <dl className="detail-credits">
        <div>
          <dt><UiText textKey="orgLabel" /></dt>
          <dd lang="ja">{nebuta.org}</dd>
        </div>
        <div>
          <dt><UiText textKey="creatorLabel" /></dt>
          <dd lang="ja">{nebuta.creator}</dd>
        </div>
      </dl>

      <figure className="detail-artwork">
        <Image
          src={withBasePath(nebuta.imagePath)}
          alt={nebuta.title}
          width={nebuta.imageWidth}
          height={nebuta.imageHeight}
          sizes="(max-width: 700px) 100vw, 640px"
          priority
        />
        <figcaption><UiText textKey="gengaCaption" /></figcaption>
      </figure>

      {/* 見どころは日本語データのみ。多言語データが入り次第この条件を外す。 */}
      <section
        className="detail-highlight"
        data-lang-block="ja"
        lang="ja"
        aria-labelledby="highlight-title"
      >
        <h2 id="highlight-title"><UiText textKey="highlightHeading" /></h2>
        <p>{nebuta.highlight}</p>
      </section>

      <section className="detail-body" aria-labelledby="body-title">
        <h2 id="body-title"><UiText textKey="bodyHeading" /></h2>
        {languages.map(({ key, htmlLang }) => (
          <div data-lang-block={key} lang={htmlLang} key={key}>
            {nebuta.bodies[key]
              .split("\n")
              .filter((paragraph) => paragraph.trim() !== "")
              .map((paragraph, index) => (
                <p key={index}>
                  {parseEmphasis(paragraph).map((segment, segmentIndex) =>
                    segment.strong ? (
                      <strong key={segmentIndex}>{segment.text}</strong>
                    ) : (
                      segment.text
                    ),
                  )}
                </p>
              ))}
          </div>
        ))}
      </section>

      <section className="detail-tags" aria-labelledby="tags-title">
        <h2 id="tags-title"><UiText textKey="tagsHeading" /></h2>
        <dl>
          {tagAxes.map((axis) => (
            <div className="detail-tag-axis" key={axis.key}>
              <dt><UiText textKey={axis.labelKey} /></dt>
              <dd>
                <ul>
                  {nebuta.tags[axis.key].map((value) => (
                    <li
                      className="detail-tag"
                      lang="ja"
                      style={
                        {
                          "--tag-color": `var(${axis.colorVariable})`,
                        } as CSSProperties
                      }
                      key={value}
                    >
                      {value}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <nav
        className="detail-pagination"
        aria-labelledby="pagination-title"
      >
        <h2 id="pagination-title" className="visually-hidden">
          <UiText textKey="paginationLabel" />
        </h2>
        {previousNebuta && (
          <Link
            className="detail-pagination-link detail-pagination-previous"
            href={`/nebuta/${previousNebuta.rowNumber}/`}
          >
            <span aria-hidden="true">←</span>
            <span>
              <span className="detail-pagination-label">
                <UiText textKey="previousWork" />
              </span>
              <span lang="ja">{previousNebuta.title}</span>
            </span>
          </Link>
        )}
        {nextNebuta && (
          <Link
            className="detail-pagination-link detail-pagination-next"
            href={`/nebuta/${nextNebuta.rowNumber}/`}
          >
            <span>
              <span className="detail-pagination-label">
                <UiText textKey="nextWork" />
              </span>
              <span lang="ja">{nextNebuta.title}</span>
            </span>
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </nav>
    </main>
  );
}
