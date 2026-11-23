import { useDeferredValue, useMemo } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { ChevronDownIcon, CloseIcon, SearchIcon } from '../components/Icons.jsx'
import { ProductCard } from '../components/ProductCard.jsx'
import { ProductGridSkeleton } from '../components/Skeletons.jsx'
import { EmptySearch, ErrorPanel } from '../components/StatePanel.jsx'
import { getMinPrice, isInStock } from '../lib/catalog.js'
import { formatCount } from '../lib/format.js'
import { buildCatalogSearch } from '../lib/search.js'
import { useDocumentTitle } from '../lib/useDocumentTitle.js'
import { useCatalog } from '../store/CatalogContext.jsx'

export function CatalogPage() {
  useDocumentTitle('Каталог')

  const search = useSearch({ from: '/' })
  const navigate = useNavigate()
  const { products, status, reload } = useCatalog()
  const deferredQuery = useDeferredValue(search.q)

  const visibleProducts = useMemo(() => {
    if (status !== 'ready') return []

    const query = deferredQuery.trim().toLowerCase()
    let result = products.filter(
      (product) => !query || product.name.toLowerCase().includes(query),
    )

    if (search.inStock) {
      result = result.filter(isInStock)
    }

    if (search.sort !== 'default') {
      result = [...result].sort((first, second) => {
        const difference = getMinPrice(first) - getMinPrice(second)
        return search.sort === 'price-asc'
          ? difference || first.id - second.id
          : -difference || first.id - second.id
      })
    }

    return result
  }, [products, status, deferredQuery, search.inStock, search.sort])

  const hasActiveFilters =
    search.q.trim() !== '' || search.inStock || search.sort !== 'default'

  /** @param {Partial<{q: string, sort: 'default'|'price-asc'|'price-desc', inStock: boolean}>} patch */
  const updateSearch = (patch) => {
    navigate({
      to: '/',
      replace: true,
      resetScroll: false,
      search: buildCatalogSearch({ ...search, ...patch }),
    })
  }

  const resetSearch = () => {
    navigate({ to: '/', replace: true, resetScroll: false, search: {} })
  }

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <h1 className="text-[34px] font-medium leading-none tracking-[-0.045em] md:text-[44px]">
          Каталог
        </h1>
        <p className="pb-1 text-[13px] tabular-nums text-mute">
          {status === 'ready' ? formatCount(visibleProducts.length) : ''}
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 border-y border-line py-4 md:flex-row md:items-center md:gap-4">
        <div className="relative md:w-[290px]">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
          <input
            type="text"
            value={search.q}
            onChange={(event) => updateSearch({ q: event.target.value })}
            placeholder="Поиск по названию"
            aria-label="Поиск по названию"
            className="field pl-9 pr-9"
          />
          {search.q && (
            <button
              type="button"
              aria-label="Очистить поиск"
              onClick={() => updateSearch({ q: '' })}
              className="icon-btn absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 text-mute hover:text-ink"
            >
              <CloseIcon className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <label className="flex h-10 cursor-pointer select-none items-center gap-2 text-[13px]">
          <input
            type="checkbox"
            checked={search.inStock}
            onChange={(event) => updateSearch({ inStock: event.target.checked })}
            className="h-4 w-4 accent-ink"
          />
          В наличии
        </label>

        <div className="relative md:ml-auto">
          <select
            value={search.sort}
            onChange={(event) => updateSearch({ sort: event.target.value })}
            aria-label="Сортировка товаров"
            className="field appearance-none pr-9 md:w-[210px]"
          >
            <option value="default">По умолчанию</option>
            <option value="price-asc">Сначала дешевле</option>
            <option value="price-desc">Сначала дороже</option>
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
        </div>
      </div>

      <div className="mt-8">
        {status === 'loading' && (
          <div role="status" aria-live="polite">
            <span className="sr-only">Загрузка каталога</span>
            <ProductGridSkeleton />
          </div>
        )}

        {status === 'error' && (
          <ErrorPanel title="Не удалось загрузить каталог" onRetry={reload} />
        )}

        {status === 'ready' && visibleProducts.length === 0 && (
          <EmptySearch onReset={resetSearch} />
        )}

        {status === 'ready' && visibleProducts.length > 0 && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-9 md:gap-x-6 lg:grid-cols-3">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {status === 'ready' && hasActiveFilters && visibleProducts.length > 0 && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={resetSearch}
              className="text-[13px] text-mute underline decoration-line underline-offset-4 transition-colors hover:text-ink"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </div>
    </>
  )
}
