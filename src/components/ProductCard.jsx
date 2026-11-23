import { Link } from '@tanstack/react-router'
import {
  getCoverImage,
  getMinPrice,
  isInStock,
} from '../lib/catalog.js'
import { formatPrice } from '../lib/format.js'

/**
 * @param {{product: import('../lib/types.js').Product}} props
 */
export function ProductCard({ product }) {
  const inStock = isInStock(product)

  return (
    <Link
      to="/product/$productId"
      params={{ productId: String(product.id) }}
      className="group block"
    >
      <div className="relative aspect-[3/4] overflow-hidden border border-line bg-white">
        <img
          src={getCoverImage(product)}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.025]"
        />
        {!inStock && (
          <span className="absolute left-3 top-3 bg-paper/95 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-mute">
            Нет в наличии
          </span>
        )}
      </div>

      <div className="mt-3.5 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
        <div className="min-w-0">
          <p className="eyebrow truncate">{product.brand}</p>
          <h3 className="mt-1 truncate text-[15px] font-medium tracking-[-0.01em]">
            {product.name}
          </h3>
        </div>
        <p className="shrink-0 text-sm tabular-nums">
          от {formatPrice(getMinPrice(product))}
        </p>
      </div>

      <div className="mt-2.5 flex gap-1.5" aria-hidden="true">
        {product.colors.map((color) => (
          <span
            key={color.id}
            title={color.name}
            className="h-2.5 w-2.5 rounded-full border border-black/10"
            style={{ backgroundColor: color.hex ?? '#d6d6cf' }}
          />
        ))}
      </div>
    </Link>
  )
}
