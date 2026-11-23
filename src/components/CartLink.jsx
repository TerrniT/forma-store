import { Link } from '@tanstack/react-router'
import { useCartCount, useCartSummary } from '../store/CartContext.jsx'
import { formatPrice } from '../lib/format.js'
import { BagIcon } from './Icons.jsx'

/**
 * Кнопка корзины в шапке. Всегда показывает количество единиц товара,
 * а стоимость — как только каталог готов рассчитать цены.
 */
export function CartLink() {
  const count = useCartCount()
  const { total, catalogStatus } = useCartSummary()
  const priceReady = catalogStatus === 'ready' || count === 0

  return (
    <Link
      to="/cart"
      aria-label={`Корзина, ${count} шт., ${priceReady ? formatPrice(total) : 'стоимость загружается'}`}
      className="group inline-flex h-10 items-center gap-2.5 border border-line bg-white px-3 transition-colors duration-200 hover:border-ink/40"
    >
      <BagIcon className="h-[17px] w-[17px] shrink-0" />
      <span className="hidden text-[13px] font-medium sm:inline">Корзина</span>
      <span className="grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1.5 text-[10px] font-semibold leading-none tabular-nums text-white">
        {count}
      </span>
      <span className="text-[13px] font-medium tabular-nums text-mute transition-colors group-hover:text-ink">
        {priceReady ? formatPrice(total) : '— ₽'}
      </span>
    </Link>
  )
}
