import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { getProducts, getSizes } from '../services/api.js'

/**
 * @typedef {import('../lib/types.js').Product} Product
 * @typedef {import('../lib/types.js').Size} Size
 */

/**
 * @typedef {Object} CatalogContextValue
 * @property {'loading'|'ready'|'error'} status
 * @property {Product[]} products
 * @property {Size[]} sizes
 * @property {() => void} reload
 */

/** @type {import('react').Context<CatalogContextValue|null>} */
const CatalogContext = createContext(null)

/**
 * Загружает каталог и справочник размеров один раз для всего приложения.
 * Данные нужны и списку, и карточке, и корзине (цены, названия размеров).
 * @param {{children: import('react').ReactNode}} props
 */
export function CatalogProvider({ children }) {
  const [state, setState] = useState(
    /** @type {{status: 'loading'|'ready'|'error', products: Product[], sizes: Size[]}} */ ({
      status: 'loading',
      products: [],
      sizes: [],
    }),
  )
  const requestId = useRef(0)

  const load = useCallback(async () => {
    const id = requestId.current + 1
    requestId.current = id

    try {
      const [products, sizes] = await Promise.all([getProducts(), getSizes()])
      if (requestId.current === id) {
        setState({ status: 'ready', products, sizes })
      }
    } catch (error) {
      console.error('Catalog request failed', error)
      if (requestId.current === id) {
        setState((previous) => ({ ...previous, status: 'error' }))
      }
    }
  }, [])

  useEffect(() => {
    // Единственная загрузка при монтировании: setState выполняется после await
    // внутри load, поэтому каскадного рендера здесь нет.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load()
  }, [load])

  const reload = useCallback(() => {
    setState((previous) => ({ ...previous, status: 'loading' }))
    load()
  }, [load])

  const value = useMemo(
    () => ({
      status: state.status,
      products: state.products,
      sizes: state.sizes,
      reload,
    }),
    [state, reload],
  )

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

/**
 * @returns {CatalogContextValue}
 */
export function useCatalog() {
  const context = useContext(CatalogContext)
  if (!context) {
    throw new Error('useCatalog must be used inside CatalogProvider')
  }
  return context
}
