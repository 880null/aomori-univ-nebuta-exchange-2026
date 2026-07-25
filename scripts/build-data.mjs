import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
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

const csv = await readFile(sourcePath, "utf8");
const rows = parseCsv(csv);
const [rawHeaders, ...dataRows] = rows;
const headers = rawHeaders.map((header, index) =>
  index === 0 ? header.replace(/^\uFEFF/u, "") : header,
);

if (new Set(headers).size !== headers.length) {
  throw new Error("CSV contains duplicate column headers.");
}

const records = dataRows
  .filter((row) => row.some((value) => value.trim() !== ""))
  .map((row, rowIndex) => {
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

    return {
      rowNumber,
      ...splitTitle(requireValue(source, "作品名", rowNumber)),
      org: requireValue(source, "団体名", rowNumber),
      creator: requireValue(source, "ねぶた師", rowNumber),
      bodies: {
        ja: requireValue(source, "題材・人物", rowNumber),
        jaEasy: requireValue(source, "やさしい日本語", rowNumber),
        en: requireValue(source, "English", rowNumber),
        zhHans: requireValue(source, "中文（簡体）", rowNumber),
        zhHant: requireValue(source, "中文（繁體）", rowNumber),
        ko: requireValue(source, "韓国語", rowNumber),
      },
      tags: {
        themes: splitTags(source["タグ1（テーマ）"] ?? ""),
        messages: splitTags(source["タグ2（メッセージ）"] ?? ""),
        scenes: splitTags(source["タグ3（シーン）"] ?? ""),
        historicalContexts: splitTags(source["タグ4（時代背景）"] ?? ""),
      },
      highlight: requireValue(source, "見どころ", rowNumber),
      imagePath: `/images/nebuta/${imageFileName}`,
      license: requireValue(source, "使用許諾", rowNumber),
    };
  });

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(records, null, 2)}\n`, "utf8");

console.log(`Generated ${records.length} records at ${outputPath}`);
