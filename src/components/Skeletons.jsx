/** Скелетон сетки товаров, повторяющий размеры карточек. */
export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-9 md:gap-x-6 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} aria-hidden="true">
          <div className="aspect-[3/4] animate-pulse bg-[#e8e8e1]" />
          <div className="mt-4 h-2.5 w-16 animate-pulse bg-[#e2e2da]" />
          <div className="mt-2.5 h-3.5 w-28 animate-pulse bg-[#e2e2da]" />
          <div className="mt-2.5 h-2.5 w-12 animate-pulse bg-[#e8e8e1]" />
        </div>
      ))}
    </div>
  )
}

/** Скелетон детальной страницы: галерея и блок информации. */
export function ProductPageSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16" aria-hidden="true">
      <div className="aspect-[3/4] animate-pulse bg-[#e8e8e1]" />
      <div className="pt-2">
        <div className="h-2.5 w-20 animate-pulse bg-[#e2e2da]" />
        <div className="mt-4 h-9 w-52 animate-pulse bg-[#deded6]" />
        <div className="mt-5 h-5 w-24 animate-pulse bg-[#e2e2da]" />
        <div className="mt-8 h-3 w-full max-w-[280px] animate-pulse bg-[#e8e8e1]" />
        <div className="mt-2 h-3 w-40 animate-pulse bg-[#e8e8e1]" />
        <div className="mt-10 h-3 w-14 animate-pulse bg-[#e2e2da]" />
        <div className="mt-4 flex gap-2">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="h-7 w-7 animate-pulse rounded-full bg-[#deded6]" />
          ))}
        </div>
        <div className="mt-9 h-3 w-16 animate-pulse bg-[#e2e2da]" />
        <div className="mt-4 flex gap-2">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="h-12 w-[58px] animate-pulse bg-[#e8e8e1]" />
          ))}
        </div>
        <div className="mt-9 h-12 w-full animate-pulse bg-[#deded6]" />
      </div>
    </div>
  )
}

/** Скелетон корзины: строки и итоговая панель. */
export function CartPageSkeleton() {
  return (
    <div className="mt-2 grid gap-10 xl:grid-cols-[minmax(0,1fr)_360px]" aria-hidden="true">
      <div>
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className="flex gap-4 border-b border-line py-6 md:gap-6">
            <div className="h-[100px] w-[76px] shrink-0 animate-pulse bg-[#e8e8e1] md:h-24 md:w-[72px]" />
            <div className="flex-1">
              <div className="h-3.5 w-32 animate-pulse bg-[#deded6]" />
              <div className="mt-3 h-2.5 w-20 animate-pulse bg-[#e8e8e1]" />
              <div className="mt-8 h-8 w-28 animate-pulse bg-[#e8e8e1]" />
            </div>
          </div>
        ))}
      </div>
      <div className="h-64 animate-pulse bg-[#e8e8e1]" />
    </div>
  )
}
