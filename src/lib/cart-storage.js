import { findPromo } from './promo.js'

/**
 * @typedef {import('./types.js').CartItem} CartItem
 * @typedef {import('./types.js').CartState} CartState
 */

export const CART_STORAGE_KEY = 'forma:cart:v1'
export const MAX_QUANTITY = 999

/** @returns {CartState} */
export function createEmptyCart() {
  return { items: [], promoCode: null }
}

/**
 * @param {number} value
 * @returns {boolean}
 */
function isId(value) {
  return Number.isInteger(value) && value > 0
}

/**
 * Приводит произвольные данные из localStorage к безопасной структуре:
 * проверяет типы, склеивает дубли и ограничивает количество.
 * @param {unknown} raw
 * @returns {CartState}
 */
export function normalizeCart(raw) {
  if (!raw || typeof raw !== 'object') return createEmptyCart()

  const source = /** @type {{items?: unknown, promoCode?: unknown}} */ (raw)
  const byKey = new Map()

  if (Array.isArray(source.items)) {
    for (const entry of source.items) {
      if (!entry || typeof entry !== 'object') continue

      const item = /** @type {Record<string, unknown>} */ (entry)
      const productId = Number(item.productId)
      const colorId = Number(item.colorId)
      const sizeId = Number(item.sizeId)
      const quantity = Number(item.quantity)

      if (!isId(productId) || !isId(colorId) || !isId(sizeId)) continue

      const safeQuantity = Number.isFinite(quantity)
        ? Math.min(MAX_QUANTITY, Math.max(1, Math.floor(quantity)))
        : 1
      const key = `${productId}:${colorId}:${sizeId}`
      const existing = byKey.get(key)

      byKey.set(key, {
        productId,
        colorId,
        sizeId,
        quantity: Math.min(MAX_QUANTITY, (existing?.quantity ?? 0) + safeQuantity),
      })
    }
  }

  const items = [...byKey.values()]
  const promo = items.length > 0 && typeof source.promoCode === 'string'
    ? findPromo(source.promoCode)
    : null

  return { items, promoCode: promo?.code ?? null }
}

/**
 * Читает корзину. Если localStorage недоступен или данные повреждены,
 * возвращает пустую корзину — приложение не должно падать на старте.
 * @returns {CartState}
 */
export function readCart() {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    return raw ? normalizeCart(JSON.parse(raw)) : createEmptyCart()
  } catch {
    return createEmptyCart()
  }
}

/**
 * Сохраняет корзину, игнорируя ошибки квоты и приватного режима.
 * @param {CartState} state
 */
export function persistCart(state) {
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Корзина продолжает работать в памяти, даже если запись недоступна.
  }
}
