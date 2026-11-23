import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearch } from '@tanstack/react-router'
import { Gallery } from '../components/Gallery.jsx'
import {
  ArrowLeftIcon,
  CheckIcon,
  SearchIcon,
} from '../components/Icons.jsx'
import { ProductPageSkeleton } from '../components/Skeletons.jsx'
import { ErrorPanel, StatePanel } from '../components/StatePanel.jsx'
import { colorLabel, findSize, getDefaultColor } from '../lib/catalog.js'
import { formatPrice } from '../lib/format.js'
import { useDocumentTitle } from '../lib/useDocumentTitle.js'
import { useCart } from '../store/CartContext.jsx'
import { useCatalog } from '../store/CatalogContext.jsx'

export function ProductPage() {
  const { productId } = useParams({ from: '/product/$productId' })
  const search = useSearch({ from: '/product/$productId' })
  const navigate = useNavigate()
  const { products, sizes, status, reload } = useCatalog()
  const { addItem } = useCart()

  const product = useMemo(
    () => products.find((item) => String(item.id) === String(productId)),
    [products, productId],
  )

  /**
   * Выбранный цвет и размер вычисляются из URL, а при отсутствии —
   * подставляется первый доступный вариант. Это делает ссылку
   * самодостаточной и не ломает состояние при перезагрузке.
   */
  const selection = useMemo(() => {
    if (!product) return null

    const color =
      product.colors.find((item) => item.id === search.color) ??
      getDefaultColor(product)

    if (!color) return null

    const sizeId = color.sizes.includes(search.size)
      ? search.size
      : color.sizes[0] ?? null

    return { color, sizeId }
  }, [product, search.color, search.size])

  const selectedSize = findSize(sizes, selection?.sizeId)
  const [added, setAdded] = useState(false)
  const addedTimer = useRef(null)

  useDocumentTitle(
    status === 'ready' && !product ? 'Товар не найден' : product?.name,
  )

  // Нормализует URL: валидные color/size всегда попадают в адресную строку.
  useEffect(() => {
    if (!product || !selection) return

    const sizeInUrl = search.size
    const selectedSizeId = selection.sizeId ?? undefined

    if (search.color !== selection.color.id || sizeInUrl !== selectedSizeId) {
      navigate({
        to: '/product/$productId',
        params: { productId: String(product.id) },
        search: {
          color: selection.color.id,
          ...(selectedSizeId ? { size: selectedSizeId } : {}),
        },
        replace: true,
      })
    }
  }, [product, selection, search.color, search.size, navigate])

  useEffect(() => {
    return () => window.clearTimeout(addedTimer.current)
  }, [])

  const clearAddedState = () => {
    window.clearTimeout(addedTimer.current)
    setAdded(false)
  }

  /** @param {import('../lib/types.js').ProductColor} color */
  const selectColor = (color) => {
    if (!selection) return

    const nextSizeId = color.sizes.includes(selection.sizeId)
      ? selection.sizeId
      : color.sizes[0] ?? null

    clearAddedState()
    navigate({
      to: '/product/$productId',
      params: { productId: String(productId) },
      search: {
        color: color.id,
        ...(nextSizeId ? { size: nextSizeId } : {}),
      },
      replace: true,
      resetScroll: false,
    })
  }

  /** @param {number} sizeId */
  const selectSize = (sizeId) => {
    if (!selection) return

    clearAddedState()
    navigate({
      to: '/product/$productId',
      params: { productId: String(productId) },
      search: { color: selection.color.id, size: sizeId },
      replace: true,
      resetScroll: false,
    })
  }

  const handleAddToCart = () => {
    if (!product || !selection || !selectedSize) return

    addItem({
      productId: product.id,
      colorId: selection.color.id,
      sizeId: selectedSize.id,
    })
    setAdded(true)
    window.clearTimeout(addedTimer.current)
    addedTimer.current = window.setTimeout(() => setAdded(false), 1600)
  }

  const backLink = (
    <Link
      to="/"
      className="inline-flex items-center gap-2 text-[13px] text-mute transition-colors hover:text-ink"
    >
      <ArrowLeftIcon className="h-4 w-4" />
      Каталог
    </Link>
  )

  if (status === 'loading') {
    return (
      <div className="mx-auto max-w-[1100px]">
        {backLink}
        <div className="mt-8">
          <ProductPageSkeleton />
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="mx-auto max-w-[1100px]">
        {backLink}
        <div className="mt-8">
          <ErrorPanel title="Не удалось загрузить товар" onRetry={reload} level={1} />
        </div>
      </div>
    )
  }

  if (!product || !selection) {
    return (
      <div className="mx-auto max-w-[1100px]">
        {backLink}
        <div className="mt-8">
          <StatePanel
            icon={<SearchIcon className="h-5 w-5" />}
            title="Товар не найден"
            level={1}
            action={
              <Link to="/" className="btn-primary">
                Вернуться в каталог
              </Link>
            }
          />
        </div>
      </div>
    )
  }

  const { color } = selection
  const price = Number(color.price)
  const hasAvailableSizes = color.sizes.length > 0

  return (
    <div className="mx-auto max-w-[1100px]">
      {backLink}

      <div className="mt-6 grid gap-9 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-16">
        <Gallery
          key={`${product.id}-${color.id}`}
          images={color.images}
          alt={`${product.name}, ${color.name}`}
        />

        <div className="lg:pt-1">
          <p className="eyebrow">{product.brand}</p>
          <h1 className="mt-3 text-[34px] font-medium leading-[1.05] tracking-[-0.045em] md:text-[42px]">
            {product.name}
          </h1>

          <div className="mt-4 flex items-baseline gap-3">
            <p className="text-[21px] font-medium tabular-nums">
              {formatPrice(price)}
            </p>
            {!hasAvailableSizes && (
              <span className="text-[13px] text-mute">Нет в наличии</span>
            )}
          </div>

          <p className="mt-4 max-w-[400px] text-sm leading-6 text-mute">
            {color.description}
          </p>

          <div className="mt-9 border-t border-line pt-6">
            <div className="flex items-baseline justify-between gap-4">
              <span className="eyebrow">Цвет</span>
              <span className="text-[13px]">{colorLabel(color)}</span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2.5">
              {product.colors.map((item) => {
                const isSelected = item.id === color.id

                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`Цвет: ${item.name}`}
                    aria-pressed={isSelected}
                    title={colorLabel(item)}
                    onClick={() => selectColor(item)}
                    className={`h-8 w-8 rounded-full border border-black/10 transition-shadow ${
                      isSelected
                        ? 'ring-1 ring-ink ring-offset-2 ring-offset-paper'
                        : 'hover:ring-1 hover:ring-line hover:ring-offset-2 hover:ring-offset-paper'
                    }`}
                    style={{ backgroundColor: item.hex ?? '#d6d6cf' }}
                  />
                )
              })}
            </div>
          </div>

          <div className="mt-7">
            <div className="flex items-baseline justify-between gap-4">
              <span className="eyebrow">Размер</span>
              <span className="text-[13px]">
                {selectedSize
                  ? `${selectedSize.name} · ${selectedSize.number}`
                  : ''}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {sizes.map((size) => {
                const isAvailable = color.sizes.includes(size.id)
                const isSelected = size.id === selectedSize?.id

                return (
                  <button
                    key={size.id}
                    type="button"
                    aria-label={`Размер ${size.name}, ${size.number}${
                      isAvailable ? '' : ', нет в наличии'
                    }`}
                    aria-pressed={isSelected}
                    disabled={!isAvailable}
                    onClick={() => selectSize(size.id)}
                    className={`h-12 border text-center transition-colors ${
                      isSelected
                        ? 'border-ink bg-ink text-white'
                        : isAvailable
                          ? 'border-line bg-white hover:border-ink'
                          : 'cursor-not-allowed border-line bg-[#ecece6] text-[#9b9b93] line-through'
                    }`}
                  >
                    <span className="block text-[13px] font-medium leading-none">
                      {size.name}
                    </span>
                    <span
                      className={`mt-1 block text-[10px] leading-none ${
                        isSelected ? 'text-white/60' : 'text-[#b0b0a8]'
                      }`}
                    >
                      {size.number}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!hasAvailableSizes || !selectedSize}
            className={`mt-8 inline-flex h-11 w-full items-center justify-center gap-2 text-sm font-medium transition-colors ${
              hasAvailableSizes
                ? 'bg-ink text-white hover:bg-black'
                : 'cursor-not-allowed border border-line bg-[#ecece6] text-mute'
            }`}
          >
            {added ? (
              <>
                <CheckIcon className="h-4 w-4" />
                Добавлено
              </>
            ) : hasAvailableSizes ? (
              'В корзину'
            ) : (
              'Нет в наличии'
            )}
          </button>

          <span className="sr-only" role="status">
            {added ? 'Товар добавлен в корзину' : ''}
          </span>
        </div>
      </div>
    </div>
  )
}
