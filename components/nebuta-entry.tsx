import Image from "next/image";
import type { CSSProperties } from "react";
import { withBasePath } from "@/lib/base-path";
import { defaultLanguage } from "@/lib/language";
import { tagAxes } from "@/lib/tag-axes";
import type { NebutaFloat } from "@/types/nebuta";

type NebutaEntryProps = Readonly<{
  nebuta: NebutaFloat;
}>;

type TagColorStyle = CSSProperties & {
  "--tag-color": string;
};

export function NebutaEntry({ nebuta }: NebutaEntryProps) {
  return (
    <li className="catalog-entry">
      <div className="entry-number" aria-label={`通し番号 ${nebuta.rowNumber}`}>
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
        <h2>{nebuta.title}</h2>
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

      <p className="entry-excerpt">{nebuta.bodies[defaultLanguage]}</p>

      <dl className="entry-tags" aria-label="作品タグ">
        {tagAxes.map((axis) => (
          <div
            className="tag-chip"
            style={
              {
                "--tag-color": `var(${axis.colorVariable})`,
              } as TagColorStyle
            }
            key={axis.key}
          >
            <dt>{axis.label}</dt>
            <dd>{nebuta.tags[axis.key].join("、")}</dd>
          </div>
        ))}
      </dl>
    </li>
  );
}
