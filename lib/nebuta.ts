import nebutaData from "@/data/nebuta.json";
import type { NebutaFloat } from "@/types/nebuta";

const nebutaFloats: NebutaFloat[] = nebutaData;

export function getNebutaFloats(): NebutaFloat[] {
  return nebutaFloats;
}
