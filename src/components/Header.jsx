import { Link } from '@tanstack/react-router'
import { CartLink } from './CartLink.jsx'

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-[1240px] items-center justify-between gap-6 px-5 md:px-8">
        <Link
          to="/"
          aria-label="Форма — на главную"
          className="text-[13px] font-semibold uppercase tracking-[0.32em] text-ink"
        >
          Форма
        </Link>
        <CartLink />
      </div>
    </header>
  )
}
