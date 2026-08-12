/**
 * Total-wealth math. Assets are stored as a flat Record<fieldKey, number> map.
 */
export type AmountMap = Record<string, number>;

export function sumRecord(map: AmountMap): number {
  return Object.values(map).reduce((acc, n) => acc + (Number(n) || 0), 0);
}

/** Total wealth = sum of all assets (no liabilities in this flow). */
export const totalWealth = (assets: AmountMap): number => sumRecord(assets);
