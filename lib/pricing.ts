/**
 * 永久 Pro 倒计时：从 2026-02-27 起 100 天，结束后改为订阅制
 */
const LIFETIME_PRO_START = new Date("2026-02-27T00:00:00.000Z");
export const LIFETIME_PRO_DAYS = 100;
export const LIFETIME_PRO_END = new Date(LIFETIME_PRO_START);
LIFETIME_PRO_END.setUTCDate(LIFETIME_PRO_END.getUTCDate() + LIFETIME_PRO_DAYS);

export function isLifetimeProPeriod(): boolean {
  return new Date() < LIFETIME_PRO_END;
}

export function getDaysLeftForLifetimePro(): number {
  const now = new Date();
  if (now >= LIFETIME_PRO_END) return 0;
  const ms = LIFETIME_PRO_END.getTime() - now.getTime();
  return Math.ceil(ms / (24 * 60 * 60 * 1000));
}

/** 订阅制：月费 $3.9，季度 9 折，半年 8 折，全年 6 折 */
export const SUB_MONTHLY_PRICE = 3.9;
export const SUB_PLANS = [
  { id: "monthly", label: "1 month", months: 1, discount: 1, price: SUB_MONTHLY_PRICE },
  { id: "quarterly", label: "3 months", months: 3, discount: 0.9, price: SUB_MONTHLY_PRICE * 3 * 0.9 },
  { id: "semiannual", label: "6 months", months: 6, discount: 0.8, price: SUB_MONTHLY_PRICE * 6 * 0.8 },
  { id: "annual", label: "12 months", months: 12, discount: 0.6, price: SUB_MONTHLY_PRICE * 12 * 0.6 },
] as const;
