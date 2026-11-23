/**
 * @typedef {import('./types.js').Promo} Promo
 */

/** @type {Record<string, Promo>} */
export const PROMO_CODES = {
  SALE10: { code: 'SALE10', type: 'percent', value: 10 },
  MINUS500: { code: 'MINUS500', type: 'fixed', value: 500 },
}

/**
 * Ищет промокод без учёта регистра и пробелов.
 * @param {string} rawCode
 * @returns {Promo|null}
 */
export function findPromo(rawCode) {
  const code = String(rawCode ?? '').trim().toUpperCase()
  return PROMO_CODES[code] ?? null
}

/**
 * Считает скидку. Фиксированная скидка не может быть больше суммы.
 * @param {Promo|null} promo
 * @param {number} subtotal
 * @returns {number}
 */
export function calculateDiscount(promo, subtotal) {
  if (!promo || subtotal <= 0) return 0
  if (promo.type === 'percent') {
    return Math.round((subtotal * promo.value) / 100)
  }
  return Math.min(promo.value, subtotal)
}
