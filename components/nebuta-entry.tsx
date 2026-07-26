import Image from "next/image";
import Link from "next/link";
import { UiText } from "@/components/ui-text";
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
          alt={nebuta.title}
          width={nebuta.imageWidth}
          height={nebuta.imageHeight}
          sizes="112px"
        />
        <figcaption className="visually-hidden">
          <UiText textKey="gengaCaption" />
        </figcaption>
      </figure>

      <div className="entry-title">
        <h2>
          <Link href={`/nebuta/${nebuta.rowNumber}/`} lang="ja">
            {nebuta.title}
          </Link>
        </h2>
        {nebuta.titleReading && (
          <p className="title-reading" lang="ja">
            {nebuta.titleReading}
          </p>
        )}
      </div>

      <dl className="entry-credits">
        <div>
          <dt>
            <UiText textKey="orgLabel" />
          </dt>
          <dd lang="ja">{nebuta.org}</dd>
        </div>
        <div>
          <dt>
            <UiText textKey="creatorLabel" />
          </dt>
          <dd lang="ja">{nebuta.creator}</dd>
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
