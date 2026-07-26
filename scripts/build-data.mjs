import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = resolve(projectRoot, "data/nebuta-source.csv");
const outputPath = resolve(projectRoot, "data/nebuta.json");

function parseCsv(input) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];

    if (inQuotes) {
      if (character === '"' && input[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        inQuotes = false;
      } else {
        field += character;
      }
      continue;
    }

    if (character === '"') {
      inQuotes = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field.endsWith("\r") ? field.slice(0, -1) : field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (inQuotes) {
    throw new Error("CSV ended inside a quoted field.");
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field.endsWith("\r") ? field.slice(0, -1) : field);
    rows.push(row);
  }

  return rows;
}

function splitTitle(value) {
  const match = value.trim().match(/^(.*?)［([^］]+)］\s*$/u);
  if (!match) {
    return { title: value.trim() };
  }

  return {
    title: match[1].trim(),
    titleReading: match[2].trim(),
  };
}

function splitTags(value) {
  return value
    .split(/[、,]/u)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function requireValue(record, fieldName, rowNumber) {
  const value = record[fieldName]?.trim();
  if (!value) {
    throw new Error(`Row ${rowNumber}: required column "${fieldName}" is empty.`);
  }
  return value;
}

function createExcerpt(body, language) {
  const normalizedBody = body.replace(/\s+/gu, " ").trim();
  const codePoints = Array.from(normalizedBody);
  // 抜粋上限は表示用ではなくペイロード削減用で、視覚的な2行打ち切りはCSSが担う。
  // 1440pxで英語は135文字見え、旧240文字は1.78倍、320文字なら2.37倍の余裕になる。
  // 表示可能量の2倍以上を保ち、120文字で約2倍以上ある他言語と安全マージンを揃える。
  const limit = language === "en" ? 320 : 120;

  if (codePoints.length <= limit) {
    return normalizedBody;
  }

  let excerptCodePoints = codePoints.slice(0, limit);

  if (language === "en") {
    const lastSpaceIndex = excerptCodePoints.lastIndexOf(" ");
    if (lastSpaceIndex !== -1) {
      excerptCodePoints = excerptCodePoints.slice(0, lastSpaceIndex);
    }
  }

  return `${excerptCodePoints.join("")}…`;
}

async function readPngDimensions(imagePath) {
  if (extname(imagePath).toLowerCase() !== ".png") {
    throw new Error(`Image must be a PNG file: "${imagePath}".`);
  }

  const filePath = resolve(projectRoot, "public", `.${imagePath}`);
  const buffer = await readFile(filePath);
  const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  if (buffer.length < 24 || !buffer.subarray(0, 8).equals(pngSignature)) {
    throw new Error(`Invalid PNG signature: "${imagePath}".`);
  }

  if (
    buffer.readUInt32BE(8) !== 13 ||
    buffer.toString("ascii", 12, 16) !== "IHDR"
  ) {
    throw new Error(`PNG is missing the expected IHDR chunk: "${imagePath}".`);
  }

  const imageWidth = buffer.readUInt32BE(16);
  const imageHeight = buffer.readUInt32BE(20);

  if (imageWidth === 0 || imageHeight === 0) {
    throw new Error(`PNG has invalid dimensions: "${imagePath}".`);
  }

  return { imageWidth, imageHeight };
}

const csv = await readFile(sourcePath, "utf8");
const rows = parseCsv(csv);
const [rawHeaders, ...dataRows] = rows;
const headers = rawHeaders.map((header, index) =>
  index === 0 ? header.replace(/^\uFEFF/u, "") : header,
);

if (new Set(headers).size !== headers.length) {
  throw new Error("CSV contains duplicate column headers.");
}

const records = await Promise.all(
  dataRows
    .filter((row) => row.some((value) => value.trim() !== ""))
    .map(async (row, rowIndex) => {
      if (row.length !== headers.length) {
        throw new Error(
          `CSV row ${rowIndex + 2} has ${row.length} fields; expected ${headers.length}.`,
        );
      }

      const source = Object.fromEntries(
        headers.map((header, index) => [header, row[index]]),
      );
      const rowNumberText = requireValue(source, "Column 1", rowIndex + 2);
      const rowNumber = Number(rowNumberText);

      if (!Number.isInteger(rowNumber)) {
        throw new Error(`Invalid row number: "${rowNumberText}".`);
      }

      const legacyImageToken = String.fromCharCode(115, 104, 105, 116, 97, 101);
      const imageFileName = requireValue(
        source,
        "画像ファイル名",
        rowNumber,
      ).replaceAll(legacyImageToken, "genga");
      const imagePath = `/images/nebuta/${imageFileName}`;
      const { imageWidth, imageHeight } = await readPngDimensions(imagePath);
      const bodies = {
        ja: requireValue(source, "題材・人物", rowNumber),
        jaEasy: requireValue(source, "やさしい日本語", rowNumber),
        en: requireValue(source, "English", rowNumber),
        zhHans: requireValue(source, "中文（簡体）", rowNumber),
        zhHant: requireValue(source, "中文（繁體）", rowNumber),
        ko: requireValue(source, "韓国語", rowNumber),
      };

      return {
        rowNumber,
        ...splitTitle(requireValue(source, "作品名", rowNumber)),
        org: requireValue(source, "団体名", rowNumber),
        creator: requireValue(source, "ねぶた師", rowNumber),
        bodies,
        excerpts: Object.fromEntries(
          Object.entries(bodies).map(([language, body]) => [
            language,
            createExcerpt(body, language),
          ]),
        ),
        tags: {
          themes: splitTags(source["タグ1（テーマ）"] ?? ""),
          messages: splitTags(source["タグ2（メッセージ）"] ?? ""),
          scenes: splitTags(source["タグ3（シーン）"] ?? ""),
          historicalContexts: splitTags(source["タグ4（時代背景）"] ?? ""),
        },
        highlight: requireValue(source, "見どころ", rowNumber),
        imagePath,
        imageWidth,
        imageHeight,
        license: requireValue(source, "使用許諾", rowNumber),
      };
    }),
);

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(records, null, 2)}\n`, "utf8");

console.log(`Generated ${records.length} records at ${outputPath}`);
