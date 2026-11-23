import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { BagIcon, TrashIcon } from '../components/Icons.jsx'
import { QuantityStepper } from '../components/QuantityStepper.jsx'
import { CartPageSkeleton } from '../components/Skeletons.jsx'
import {
  EmptyCart,
  ErrorPanel,
  StatePanel,
} from '../components/StatePanel.jsx'
import { colorLabel } from '../lib/catalog.js'
import { formatCount, formatPrice } from '../lib/format.js'
import { findPromo } from '../lib/promo.js'
import { useDocumentTitle } from '../lib/useDocumentTitle.js'
import { useCart, useCartSummary } from '../store/CartContext.jsx'
import { useCatalog } from '../store/CatalogContext.jsx'

/**
 * @param {import('../lib/types.js').CartLine} line
 * @returns {{productId: number, colorId: number, sizeId: number}}
 */
function variantOf(line) {
  return {
    productId: line.product.id,
    colorId: line.color.id,
    sizeId: line.size.id,
  }
}

/**
 * Форма промокода. После успешного применения сумма пересчитывается,
 * а форма заменяется плашкой с активным кодом.
 * @param {{onApply: (code: string) => void}} props
 */
function PromoForm({ onApply }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const promo = findPromo(value)
    if (!promo) {
      setError('Промокод не найден')
      return
    }

    setError('')
    setValue('')
    onApply(promo.code)
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5" noValidate>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(event) => {
            setValue(event.target.value)
            if (error) setError('')
          }}
          placeholder="Промокод"
          aria-label="Промокод"
          aria-invalid={Boolean(error)}
          autoComplete="off"
          spellCheck={false}
          className="field min-w-0 flex-1"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="btn-secondary h-10 shrink-0 px-3.5 text-[13px]"
        >
          Применить
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-[12px] text-danger">
          {error}
        </p>
      )}
    </form>
  )
}

/**
 * @param {{
 *   count: number,
 *   subtotal: number,
 *   discount: number,
 *   total: number,
 *   promo: import('../lib/types.js').Promo|null,
 *   onApplyPromo: (code: string) => void,
 *   onRemovePromo: () => void,
 * }} props
 */
function CartSummary({
  count,
  subtotal,
  discount,
  total,
  promo,
  onApplyPromo,
  onRemovePromo,
}) {
  return (
    <aside
      aria-label="Итог заказа"
      className="h-fit border border-line bg-white p-6 xl:sticky xl:top-[92px]"
    >
      <h2 className="eyebrow">Итог</h2>

      <div className="mt-5 space-y-2.5 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-mute">Товары ({count})</span>
          <span className="tabular-nums">{formatPrice(subtotal)}</span>
        </div>
        {promo && discount > 0 && (
          <div className="flex justify-between gap-4 text-success">
            <span>Скидка</span>
            <span className="tabular-nums">−{formatPrice(discount)}</span>
          </div>
        )}
      </div>

      {promo ? (
        <div className="mt-5 flex items-center justify-between gap-3 border border-line bg-paper px-3 py-2.5">
          <span className="text-[13px] font-medium">{promo.code}</span>
          <button
            type="button"
            onClick={onRemovePromo}
            className="text-[12px] text-mute underline decoration-line underline-offset-2 transition-colors hover:text-ink"
          >
            Убрать
          </button>
        </div>
      ) : (
        <PromoForm onApply={onApplyPromo} />
      )}

      <div className="mt-6 flex items-baseline justify-between border-t border-line pt-5">
        <span className="text-sm font-medium">Итого</span>
        <span className="text-[26px] font-medium tracking-[-0.03em] tabular-nums">
          {formatPrice(total)}
        </span>
      </div>
    </aside>
  )
}

export function CartPage() {
  useDocumentTitle('Корзина')

  const { setQuantity, removeItem, clearCart, applyPromo, removePromo } = useCart()
  const { lines, count, subtotal, discount, total, promo, catalogStatus } =
    useCartSummary()
  const { reload } = useCatalog()

  const renderLineInfo = (/** @type {import('../lib/types.js').CartLine} */ line) => (
    <div className="flex min-w-0 items-center gap-4">
      <Link
        to="/product/$productId"
        params={{ productId: String(line.product.id) }}
        search={{ color: line.color.id, size: line.size.id }}
        className="block h-24 w-[72px] shrink-0 border border-line bg-white"
      >
        <img
          src={line.color.images[0]}
          alt={`${line.product.name}, ${line.color.name}`}
          className="h-full w-full object-contain"
        />
      </Link>
      <div className="min-w-0">
        <Link
          to="/product/$productId"
          params={{ productId: String(line.product.id) }}
          search={{ color: line.color.id, size: line.size.id }}
          className="text-[15px] font-medium leading-snug underline-offset-4 hover:underline"
        >
          {line.product.name}
        </Link>
        <p className="mt-1.5 text-[13px] text-mute">
          {colorLabel(line.color)} · {line.size.name}
        </p>
      </div>
    </div>
  )

  let content = null

  if (count === 0) {
    content = (
      <div className="mt-8">
        <EmptyCart />
      </div>
    )
  } else if (catalogStatus === 'loading') {
    content = (
      <div role="status" aria-live="polite">
        <span className="sr-only">Загрузка корзины</span>
        <CartPageSkeleton />
      </div>
    )
  } else if (catalogStatus === 'error') {
    content = (
      <div className="mt-8">
        <ErrorPanel title="Не удалось загрузить корзину" onRetry={reload} />
      </div>
    )
  } else if (lines.length === 0) {
    content = (
      <div className="mt-8">
        <StatePanel
          icon={<BagIcon className="h-5 w-5" />}
          title="Товары недоступны"
          action={
            <button type="button" className="btn-secondary" onClick={clearCart}>
              Очистить корзину
            </button>
          }
        />
      </div>
    )
  } else {
    content = (
      <div className="mt-8 grid gap-10 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section aria-label="Товары в корзине">
          {/* Таблица для широких экранов */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-[minmax(0,1fr)_78px_128px_92px_28px] gap-4 border-b border-line pb-3">
              <span className="eyebrow">Товар</span>
              <span className="eyebrow">Цена</span>
              <span className="eyebrow">Количество</span>
              <span className="eyebrow text-right">Итого</span>
              <span />
            </div>

            <ul>
              {lines.map((line) => (
                <li
                  key={line.key}
                  className="grid grid-cols-[minmax(0,1fr)_78px_128px_92px_28px] items-center gap-4 border-b border-line py-6"
                >
                  {renderLineInfo(line)}
                  <span className="text-sm tabular-nums">{formatPrice(line.price)}</span>
                  <QuantityStepper
                    value={line.quantity}
                    onChange={(quantity) => setQuantity(variantOf(line), quantity)}
                  />
                  <span className="text-right text-sm font-medium tabular-nums">
                    {formatPrice(line.total)}
                  </span>
                  <button
                    type="button"
                    aria-label={`Удалить ${line.product.name} из корзины`}
                    onClick={() => removeItem(variantOf(line))}
                    className="icon-btn h-8 w-8 justify-self-end text-mute hover:text-danger"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Карточки для узких экранов */}
          <ul className="lg:hidden">
            {lines.map((line) => (
              <li key={line.key} className="flex gap-4 border-b border-line py-5">
                <Link
                  to="/product/$productId"
                  params={{ productId: String(line.product.id) }}
                  search={{ color: line.color.id, size: line.size.id }}
                  className="block h-[104px] w-20 shrink-0 border border-line bg-white"
                >
                  <img
                    src={line.color.images[0]}
                    alt={`${line.product.name}, ${line.color.name}`}
                    className="h-full w-full object-contain"
                  />
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        to="/product/$productId"
                        params={{ productId: String(line.product.id) }}
                        search={{ color: line.color.id, size: line.size.id }}
                        className="text-sm font-medium leading-snug underline-offset-4 hover:underline"
                      >
                        {line.product.name}
                      </Link>
                      <p className="mt-1 text-xs text-mute">
                        {colorLabel(line.color)} · {line.size.name}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label={`Удалить ${line.product.name} из корзины`}
                      onClick={() => removeItem(variantOf(line))}
                      className="icon-btn -mr-1 -mt-1 h-8 w-8 shrink-0 text-mute hover:text-danger"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-4 flex items-end justify-between gap-3">
                    <QuantityStepper
                      value={line.quantity}
                      onChange={(quantity) => setQuantity(variantOf(line), quantity)}
                    />
                    <div className="text-right">
                      <p className="text-[11px] text-mute">
                        {formatPrice(line.price)} / шт.
                      </p>
                      <p className="mt-1 text-sm font-medium tabular-nums">
                        {formatPrice(line.total)}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <CartSummary
          count={count}
          subtotal={subtotal}
          discount={discount}
          total={total}
          promo={promo}
          onApplyPromo={applyPromo}
          onRemovePromo={removePromo}
        />
      </div>
    )
  }

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <h1 className="text-[34px] font-medium leading-none tracking-[-0.045em] md:text-[44px]">
          Корзина
        </h1>
        {count > 0 && (
          <p className="pb-1 text-[13px] text-mute">{formatCount(count)}</p>
        )}
      </div>
      {content}
    </>
  )
}
