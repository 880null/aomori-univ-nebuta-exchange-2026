import Image from "next/image";
import Link from "next/link";
import { withBasePath } from "@/lib/base-path";
import { languages } from "@/lib/language";
import type { NebutaFloat } from "@/types/nebuta";

type NebutaEntryProps = Readonly<{
  nebuta: NebutaFloat;
}>;

export function NebutaEntry({ nebuta }: NebutaEntryProps) {
  return (
    <li className="catalog-entry">
      <div className="entry-number">
        {String(nebuta.rowNumber).padStart(2, "0")}
      </div>

      <figure className="entry-image">
        <Image
          src={withBasePath(nebuta.imagePath)}
          alt={`${nebuta.title}の原画`}
          width={nebuta.imageWidth}
          height={nebuta.imageHeight}
          sizes="112px"
        />
      </figure>

      <div className="entry-title">
        <h2>
          <Link href={`/nebuta/${nebuta.rowNumber}/`}>{nebuta.title}</Link>
        </h2>
        {nebuta.titleReading && (
          <p className="title-reading">{nebuta.titleReading}</p>
        )}
      </div>

      <dl className="entry-credits">
        <div>
          <dt>団体名</dt>
          <dd>{nebuta.org}</dd>
        </div>
        <div>
          <dt>制作者名</dt>
          <dd>{nebuta.creator}</dd>
        </div>
      </dl>

      {languages.map(({ key, htmlLang }) => (
        <p
          className="entry-excerpt"
          data-lang-block={key}
          lang={htmlLang}
          key={key}
        >
          {nebuta.excerpts[key]}
        </p>
      ))}
    </li>
  );
}
