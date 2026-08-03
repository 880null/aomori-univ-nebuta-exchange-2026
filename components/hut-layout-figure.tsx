import Link from "next/link";
import { UiText } from "@/components/ui-text";
import { languages } from "@/lib/language";
import {
  rassetLandBayBridgeSegment,
  rassetLandHutPositions,
  rassetLandLandmarkPositions,
} from "@/lib/rasseland";
import { formatUiText, uiText } from "@/lib/ui-text";

const COORDINATE_SCALE = 1000;
const VIEW_BOX = {
  minX: 24,
  minY: 143,
  width: 838,
  height: 801,
} as const;
const HUT_HIT_RADIUS = 21.25;

const hutPositions = Object.entries(rassetLandHutPositions).map(
  ([rowNumber, position]) => ({
    rowNumber: Number(rowNumber),
    x: position.x * COORDINATE_SCALE,
    y: position.y * COORDINATE_SCALE,
  }),
);

const bayBridgeStart = {
  x: rassetLandBayBridgeSegment.start.x * COORDINATE_SCALE,
  y: rassetLandBayBridgeSegment.start.y * COORDINATE_SCALE,
};
const bayBridgeEnd = {
  x: rassetLandBayBridgeSegment.end.x * COORDINATE_SCALE,
  y: rassetLandBayBridgeSegment.end.y * COORDINATE_SCALE,
};
const aspamPosition = {
  x: rassetLandLandmarkPositions.aspam.x * COORDINATE_SCALE,
  y: rassetLandLandmarkPositions.aspam.y * COORDINATE_SCALE,
};

export function HutLayoutFigure() {
  return (
    <figure
      className="hut-layout-figure"
      aria-labelledby="hut-layout-caption"
    >
      <figcaption className="hut-layout-caption" id="hut-layout-caption">
        <UiText textKey="hutLayoutHeading" />
      </figcaption>

      <div className="hut-layout-scroll">
        <svg
          className="hut-layout-svg"
          viewBox={`${VIEW_BOX.minX} ${VIEW_BOX.minY} ${VIEW_BOX.width} ${VIEW_BOX.height}`}
        >
          <line
            className="hut-layout-bay-bridge"
            x1={bayBridgeStart.x}
            y1={bayBridgeStart.y}
            x2={bayBridgeEnd.x}
            y2={bayBridgeEnd.y}
            aria-hidden="true"
          />

          <g className="hut-layout-aspam" aria-hidden="true">
            <polygon
              points={`${aspamPosition.x},${aspamPosition.y - 56} ${aspamPosition.x - 48},${aspamPosition.y + 28} ${aspamPosition.x + 48},${aspamPosition.y + 28}`}
            />
            <text x={aspamPosition.x} y={aspamPosition.y + 66}>
              ASPAM
            </text>
          </g>

          {hutPositions.map(({ rowNumber, x, y }) => {
            const labelId = `hut-layout-hut-${rowNumber}-label`;

            return (
              <Link
                className="hut-layout-hut-link"
                href={`/nebuta/${rowNumber}/`}
                aria-labelledby={labelId}
                key={rowNumber}
              >
                <text
                  className="hut-layout-accessible-label"
                  id={labelId}
                  x="-10000"
                  y="-10000"
                >
                  {languages.map(({ key, htmlLang }) => (
                    <tspan data-lang-block={key} lang={htmlLang} key={key}>
                      {formatUiText(uiText.hutNumberLinkLabel[key], {
                        n: rowNumber,
                      })}
                    </tspan>
                  ))}
                </text>
                <circle
                  className="hut-layout-hut-marker"
                  cx={x}
                  cy={y}
                  r={HUT_HIT_RADIUS}
                  aria-hidden="true"
                />
                <text
                  className="hut-layout-hut-number"
                  x={x}
                  y={y}
                  aria-hidden="true"
                >
                  {rowNumber}
                </text>
              </Link>
            );
          })}
        </svg>
      </div>
    </figure>
  );
}
