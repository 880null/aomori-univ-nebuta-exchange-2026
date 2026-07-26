import nebutaData from "@/data/nebuta.json";
import type { NebutaFloat } from "@/types/nebuta";

const nebutaFloats: NebutaFloat[] = nebutaData;

export function getNebutaFloats(): NebutaFloat[] {
  return nebutaFloats;
}

export function getNebutaFloatByRowNumber(
  rowNumber: number,
): NebutaFloat | undefined {
  return nebutaFloats.find((nebuta) => nebuta.rowNumber === rowNumber);
}

export function getNebutaRowNumbers(): number[] {
  return nebutaFloats.map((nebuta) => nebuta.rowNumber);
}
