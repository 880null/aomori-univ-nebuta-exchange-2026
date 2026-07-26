export const productionBasePath = "/aomori-univ-nebuta-exchange-2026";

export function getBasePath(nodeEnv = process.env.NODE_ENV) {
  return nodeEnv === "production" ? productionBasePath : "";
}
