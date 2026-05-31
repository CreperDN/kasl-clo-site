export const PRICE_INCREASE = 350;
export const PRICE_DECREASE = 100;

export function isCheaper(slug) {
  if (!slug) return false;
  const list = ["shapka", "panama", "khomut", "bieriet", "kiepka", "navushniki", "sharf", "kapor"];
  return list.some(el => slug.includes(el));
}
