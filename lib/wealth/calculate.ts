/**
 * Net-worth math. Assets and liabilities are stored as flat
 * Record<fieldKey, number> maps; these helpers sum them safely.
 */
export type AmountMap = Record<string, number>;

export function sumRecord(map: AmountMap): number {
  return Object.values(map).reduce((acc, n) => acc + (Number(n) || 0), 0);
}

export const totalAssets = (assets: AmountMap): number => sumRecord(assets);
export const totalLiabilities = (liabilities: AmountMap): number =>
  sumRecord(liabilities);

export function netWorth(assets: AmountMap, liabilities: AmountMap): number {
  return sumRecord(assets) - sumRecord(liabilities);
}
