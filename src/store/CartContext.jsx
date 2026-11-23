import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react'
import { resolveCartLines } from '../lib/cart.js'
import {
  createEmptyCart,
  MAX_QUANTITY,
  persistCart,
  readCart,
} from '../lib/cart-storage.js'
import { calculateDiscount, findPromo } from '../lib/promo.js'
import { useCatalog } from './CatalogContext.jsx'

/**
 * @typedef {import('../lib/types.js').CartItem} CartItem
 * @typedef {import('../lib/types.js').CartState} CartState
 * @typedef {import('../lib/types.js').CartLine} CartLine
 * @typedef {import('../lib/types.js').Promo} Promo
 */

/** @typedef {Omit<CartItem, 'quantity'>} CartVariant */

/**
 * @typedef {Object} CartContextValue
 * @property {CartItem[]} items
 * @property {string|null} promoCode
 * @property {(variant: CartVariant) => void} addItem
 * @property {(variant: CartVariant, quantity: number) => void} setQuantity
 * @property {(variant: CartVariant) => void} removeItem
 * @property {() => void} clearCart
 * @property {(code: string) => void} applyPromo
 * @property {() => void} removePromo
 */

/** @param {CartItem} item @param {CartVariant} variant */
function isSameVariant(item, variant) {
  return (
    item.productId === variant.productId &&
    item.colorId === variant.colorId &&
    item.sizeId === variant.sizeId
  )
}

/**
 * Чистая функция изменения корзины.
 * @param {CartState} state
 * @param {{type: string, variant?: CartVariant, quantity?: number, code?: string|null}} action
 * @returns {CartState}
 */
export function cartReducer(state, action) {
  switch (action.type) {
    case 'add': {
      if (!action.variant) return state
      const existing = state.items.find((item) => isSameVariant(item, action.variant))

      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            isSameVariant(item, action.variant)
              ? { ...item, quantity: Math.min(MAX_QUANTITY, item.quantity + 1) }
              : item,
          ),
        }
      }

      return {
        ...state,
        items: [...state.items, { ...action.variant, quantity: 1 }],
      }
    }

    case 'setQuantity': {
      if (!action.variant) return state
      const quantity = Math.min(
        MAX_QUANTITY,
        Math.max(1, Math.floor(action.quantity ?? 1)),
      )

      return {
        ...state,
        items: state.items.map((item) =>
          isSameVariant(item, action.variant) ? { ...item, quantity } : item,
        ),
      }
    }

    case 'remove': {
      if (!action.variant) return state
      const items = state.items.filter((item) => !isSameVariant(item, action.variant))

      return {
        ...state,
        items,
        promoCode: items.length > 0 ? state.promoCode : null,
      }
    }

    case 'clear':
      return createEmptyCart()

    case 'applyPromo':
      return { ...state, promoCode: action.code ?? null }

    case 'removePromo':
      return { ...state, promoCode: null }

    default:
      return state
  }
}

/** @type {import('react').Context<CartContextValue|null>} */
const CartContext = createContext(null)

/**
 * Хранит корзину, синхронизирует её с localStorage и предоставляет действия.
 * @param {{children: import('react').ReactNode}} props
 */
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, readCart)

  useEffect(() => {
    persistCart(state)
  }, [state])

  const addItem = useCallback((variant) => {
    dispatch({ type: 'add', variant })
  }, [])

  const setQuantity = useCallback((variant, quantity) => {
    dispatch({ type: 'setQuantity', variant, quantity })
  }, [])

  const removeItem = useCallback((variant) => {
    dispatch({ type: 'remove', variant })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: 'clear' })
  }, [])

  const applyPromo = useCallback((code) => {
    const promo = findPromo(code)
    if (!promo) return
    dispatch({ type: 'applyPromo', code: promo.code })
  }, [])

  const removePromo = useCallback(() => {
    dispatch({ type: 'removePromo' })
  }, [])

  const value = useMemo(
    () => ({
      items: state.items,
      promoCode: state.promoCode,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
      applyPromo,
      removePromo,
    }),
    [
      state.items,
      state.promoCode,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
      applyPromo,
      removePromo,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

/**
 * @returns {CartContextValue}
 */
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used inside CartProvider')
  }
  return context
}

/**
 * Общее количество единиц товара — без ожидания каталога.
 * @returns {number}
 */
export function useCartCount() {
  const { items } = useCart()
  return useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  )
}

/**
 * Позиции корзины с ценами и итогами. Пока каталог не загружен, строк нет:
 * страница корзины в это время показывает скелетон.
 * @returns {{
 *   lines: CartLine[],
 *   count: number,
 *   subtotal: number,
 *   discount: number,
 *   total: number,
 *   promo: Promo|null,
 *   catalogStatus: 'loading'|'ready'|'error',
 * }}
 */
export function useCartSummary() {
  const { items, promoCode } = useCart()
  const { products, sizes, status } = useCatalog()

  return useMemo(() => {
    const lines = status === 'ready' ? resolveCartLines(items, products, sizes) : []
    const count = items.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = lines.reduce((sum, line) => sum + line.total, 0)
    const promo = findPromo(promoCode ?? '')
    const discount = calculateDiscount(promo, subtotal)

    return {
      lines,
      count,
      subtotal,
      discount,
      total: subtotal - discount,
      promo,
      catalogStatus: status,
    }
  }, [items, promoCode, products, sizes, status])
}

