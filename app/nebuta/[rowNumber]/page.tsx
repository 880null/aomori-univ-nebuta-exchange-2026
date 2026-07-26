import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { withBasePath } from "@/lib/base-path";
import { defaultLanguage } from "@/lib/language";
import {
  getNebutaFloatByRowNumber,
  getNebutaRowNumbers,
} from "@/lib/nebuta";
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
  const bodyParagraphs = nebuta.bodies[defaultLanguage]
    .split("\n")
    .filter((paragraph) => paragraph.trim() !== "");

  return (
    <main className="page detail-page">
      <Link className="detail-back-link" href="/">
        一覧へ戻る
      </Link>

      {/* 言語切替はここに入る(次のタスク) */}

      <header className="detail-header">
        <p className="detail-number">通し番号 {nebuta.rowNumber}</p>
        <h1>{nebuta.title}</h1>
        {nebuta.titleReading && (
          <p className="detail-title-reading">{nebuta.titleReading}</p>
        )}
      </header>

      <dl className="detail-credits">
        <div>
          <dt>団体名</dt>
          <dd>{nebuta.org}</dd>
        </div>
        <div>
          <dt>制作者名</dt>
          <dd>{nebuta.creator}</dd>
        </div>
      </dl>

      <figure className="detail-artwork">
        <Image
          src={withBasePath(nebuta.imagePath)}
          alt={`${nebuta.title}の原画`}
          width={nebuta.imageWidth}
          height={nebuta.imageHeight}
          sizes="(max-width: 700px) 100vw, 640px"
          priority
        />
        <figcaption>原画</figcaption>
      </figure>

      {/* 見どころは日本語データのみのため、日本語表示時に限って掲載する。 */}
      {defaultLanguage === "ja" && (
        <section className="detail-highlight" aria-labelledby="highlight-title">
          <h2 id="highlight-title">見どころ</h2>
          <p>{nebuta.highlight}</p>
        </section>
      )}

      <section className="detail-body" aria-labelledby="body-title">
        <h2 id="body-title">解説</h2>
        {bodyParagraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </section>

      <section className="detail-tags" aria-labelledby="tags-title">
        <h2 id="tags-title">タグ</h2>
        <dl>
          {tagAxes.map((axis) => (
            <div className="detail-tag-axis" key={axis.key}>
              <dt>{axis.label}</dt>
              <dd>
                <ul>
                  {nebuta.tags[axis.key].map((value) => (
                    <li
                      className="detail-tag"
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

      <nav className="detail-pagination" aria-label="前後の作品">
        {previousNebuta && (
          <Link
            className="detail-pagination-link detail-pagination-previous"
            href={`/nebuta/${previousNebuta.rowNumber}/`}
          >
            <span aria-hidden="true">←</span>
            <span>
              <span className="detail-pagination-label">前の作品</span>
              {previousNebuta.title}
            </span>
          </Link>
        )}
        {nextNebuta && (
          <Link
            className="detail-pagination-link detail-pagination-next"
            href={`/nebuta/${nextNebuta.rowNumber}/`}
          >
            <span>
              <span className="detail-pagination-label">次の作品</span>
              {nextNebuta.title}
            </span>
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </nav>
    </main>
  );
}
