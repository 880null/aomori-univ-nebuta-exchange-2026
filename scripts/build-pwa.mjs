import { createHash } from "node:crypto";
import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getBasePath } from "../config/base-path.mjs";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const dataPath = path.join(projectRoot, "data", "nebuta.json");
const globalsPath = path.join(projectRoot, "app", "globals.css");
const publicDirectory = path.join(projectRoot, "public");
const outDirectory = path.join(projectRoot, "out");
const nextStaticDirectory = path.join(outDirectory, "_next", "static");
const manifestPath = path.join(publicDirectory, "manifest.webmanifest");
const serviceWorkerPath = path.join(publicDirectory, "sw.js");
const outManifestPath = path.join(outDirectory, "manifest.webmanifest");
const outServiceWorkerPath = path.join(outDirectory, "sw.js");
const basePath = getBasePath();

const dataSource = await readFile(dataPath, "utf8");
const nebutaFloats = JSON.parse(dataSource);

if (!Array.isArray(nebutaFloats)) {
  throw new TypeError("data/nebuta.json must contain an array.");
}

const rowNumbers = nebutaFloats.map(({ rowNumber }, index) => {
  if (!Number.isInteger(rowNumber) || rowNumber < 1) {
    throw new TypeError(
      `data/nebuta.json entry ${index} has an invalid rowNumber.`,
    );
  }

  return rowNumber;
});

if (new Set(rowNumbers).size !== rowNumbers.length) {
  throw new Error("data/nebuta.json contains duplicate rowNumber values.");
}

rowNumbers.sort((first, second) => first - second);

function withBasePath(pathname) {
  if (!pathname.startsWith("/")) {
    throw new TypeError(`PWA path must start with "/": ${pathname}`);
  }

  return `${basePath}${pathname}`;
}

const pagePrecacheUrls = [
  withBasePath("/"),
  withBasePath("/map/"),
  ...rowNumbers.map((rowNumber) =>
    withBasePath(`/nebuta/${encodeURIComponent(String(rowNumber))}/`),
  ),
];

const globalsSource = await readFile(globalsPath, "utf8");
const washiMatch = globalsSource.match(
  /--washi\s*:\s*(#[\da-f]{3,8}|[^;]+)\s*;/i,
);

if (!washiMatch) {
  throw new Error("Could not read --washi from app/globals.css.");
}

const washi = washiMatch[1].trim();

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectFiles(entryPath)));
    } else if (entry.isFile()) {
      files.push(entryPath);
    }
  }

  return files;
}

const staticAssetPaths = (await collectFiles(nextStaticDirectory))
  .filter((assetPath) => [".js", ".css"].includes(path.extname(assetPath)))
  .sort();
const staticAssetRelativePaths = staticAssetPaths.map((assetPath) =>
  path.relative(outDirectory, assetPath).split(path.sep).join("/"),
);
const assetPrecacheUrls = staticAssetRelativePaths.map((relativePath) =>
  withBasePath(`/${relativePath}`),
);
const staticAssetSizes = await Promise.all(
  staticAssetPaths.map(async (assetPath) => (await stat(assetPath)).size),
);
const staticAssetBytes = staticAssetSizes.reduce(
  (total, size) => total + size,
  0,
);
const javascriptCount = staticAssetPaths.filter(
  (assetPath) => path.extname(assetPath) === ".js",
).length;
const cssCount = staticAssetPaths.filter(
  (assetPath) => path.extname(assetPath) === ".css",
).length;

const versionSourcePaths = (
  await Promise.all(
    ["app", "components", "hooks", "lib", "public"].map((directory) =>
      collectFiles(path.join(projectRoot, directory)),
    ),
  )
)
  .flat()
  .filter(
    (sourcePath) =>
      sourcePath !== manifestPath && sourcePath !== serviceWorkerPath,
  )
  .concat([
    dataPath,
    path.join(projectRoot, "next.config.ts"),
    path.join(projectRoot, "package.json"),
    path.join(projectRoot, "package-lock.json"),
    path.join(projectRoot, "config", "base-path.mjs"),
    fileURLToPath(import.meta.url),
  ])
  .sort();

const versionHash = createHash("sha256");
versionHash.update(JSON.stringify(pagePrecacheUrls));
versionHash.update("\0");
versionHash.update(JSON.stringify(staticAssetRelativePaths));

for (const sourcePath of versionSourcePaths) {
  versionHash.update("\0");
  versionHash.update(path.relative(projectRoot, sourcePath));
  versionHash.update("\0");
  versionHash.update(await readFile(sourcePath));
}

const version = versionHash.digest("hex").slice(0, 16);
const startUrl = withBasePath("/");

const manifest = {
  name: "青森大学 国際交流プロジェクト 多言語ねぶたガイド",
  short_name: "多言語ねぶたガイド",
  lang: "ja",
  dir: "ltr",
  start_url: startUrl,
  scope: startUrl,
  display: "standalone",
  theme_color: washi,
  background_color: washi,
  icons: [
    {
      src: withBasePath("/icon-192.png"),
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: withBasePath("/icon-512.png"),
      sizes: "512x512",
      type: "image/png",
    },
    {
      src: withBasePath("/icon-maskable-512.png"),
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable",
    },
  ],
};

const serviceWorker = `/* Generated by scripts/build-pwa.mjs. Do not edit directly. */
"use strict";

const VERSION = ${JSON.stringify(version)};
const CACHE_PREFIX = "nebuta-guide-";
const PAGE_CACHE = \`\${CACHE_PREFIX}pages-\${VERSION}\`;
const ASSET_CACHE = \`\${CACHE_PREFIX}assets-\${VERSION}\`;
const TILE_CACHE = \`\${CACHE_PREFIX}tiles-\${VERSION}\`;
const CURRENT_CACHES = new Set([PAGE_CACHE, ASSET_CACHE, TILE_CACHE]);
const PAGE_PRECACHE_URLS = ${JSON.stringify(pagePrecacheUrls, null, 2)};
const ASSET_PRECACHE_URLS = ${JSON.stringify(assetPrecacheUrls, null, 2)};
const APP_SHELL_URL = ${JSON.stringify(startUrl)};
const BASE_PATH = ${JSON.stringify(basePath)};
const NEXT_STATIC_PREFIX = \`\${BASE_PATH}/_next/static/\`;
const IMAGE_PREFIX = \`\${BASE_PATH}/images/\`;
const TILE_HOSTNAME = "cyberjapandata.gsi.go.jp";
const TILE_CACHE_LIMIT = 300;

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const [pageCache, assetCache] = await Promise.all([
        caches.open(PAGE_CACHE),
        caches.open(ASSET_CACHE),
      ]);
      await Promise.all([
        pageCache.addAll(PAGE_PRECACHE_URLS),
        assetCache.addAll(ASSET_PRECACHE_URLS),
      ]);
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(
            (cacheName) =>
              cacheName.startsWith(CACHE_PREFIX) &&
              !CURRENT_CACHES.has(cacheName),
          )
          .map((cacheName) => caches.delete(cacheName)),
      );
      await self.clients.claim();
    })(),
  );
});

async function putInCache(cache, request, response) {
  try {
    await cache.put(request, response);
  } catch {
    // A cache write failure must not prevent the network response from loading.
  }
}

async function networkFirstNavigation(request) {
  const cache = await caches.open(PAGE_CACHE);

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok && networkResponse.type !== "opaque") {
      await putInCache(cache, request, networkResponse.clone());
    }

    return networkResponse;
  } catch {
    // Fall through to the precached HTML.
  }

  const cachedResponse = await cache.match(request, { ignoreSearch: true });

  if (cachedResponse) {
    return cachedResponse;
  }

  const appShell = await cache.match(APP_SHELL_URL);

  if (appShell) {
    return appShell;
  }

  return Response.error();
}

function canCache(response, allowOpaque) {
  return response.ok || (allowOpaque && response.type === "opaque");
}

async function trimCache(cache, limit) {
  const keys = await cache.keys();
  const excess = keys.length - limit;

  if (excess <= 0) {
    return;
  }

  await Promise.all(
    keys.slice(0, excess).map((request) => cache.delete(request)),
  );
}

async function cacheFirst(request, cacheName, options = {}) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  const networkResponse = await fetch(request);

  if (canCache(networkResponse, options.allowOpaque === true)) {
    await putInCache(cache, request, networkResponse.clone());

    if (typeof options.limit === "number") {
      await trimCache(cache, options.limit);
    }
  }

  return networkResponse;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (request.mode === "navigate") {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  if (
    url.origin === self.location.origin &&
    url.pathname.startsWith(NEXT_STATIC_PREFIX)
  ) {
    event.respondWith(cacheFirst(request, ASSET_CACHE));
    return;
  }

  if (
    url.origin === self.location.origin &&
    url.pathname.startsWith(IMAGE_PREFIX)
  ) {
    event.respondWith(cacheFirst(request, ASSET_CACHE));
    return;
  }

  if (url.hostname === TILE_HOSTNAME) {
    event.respondWith(
      cacheFirst(request, TILE_CACHE, {
        allowOpaque: true,
        limit: TILE_CACHE_LIMIT,
      }),
    );
  }
});
`;

await Promise.all([
  writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8"),
  writeFile(serviceWorkerPath, serviceWorker, "utf8"),
  writeFile(outManifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8"),
  writeFile(outServiceWorkerPath, serviceWorker, "utf8"),
]);

console.log(
  `Generated manifest.webmanifest and sw.js in public/ and out/ (${pagePrecacheUrls.length} HTML, ${javascriptCount} JS, ${cssCount} CSS, ${staticAssetBytes} JS+CSS bytes, version ${version}, basePath ${basePath || "/"}).`,
);
