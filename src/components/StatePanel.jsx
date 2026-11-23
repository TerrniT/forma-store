import { Link } from '@tanstack/react-router'
import { BagIcon, SearchIcon, AlertIcon } from './Icons.jsx'

/**
 * Единый контейнер для пустых, ошибочных и служебных состояний.
 * @param {{
 *   icon?: import('react').ReactNode,
 *   title: string,
 *   description?: string,
 *   action?: import('react').ReactNode,
 *   level?: 1|2,
 * }} props
 */
export function StatePanel({ icon, title, description, action, level = 2 }) {
  const Heading = level === 1 ? 'h1' : 'h2'

  return (
    <div className="border border-line bg-white px-6 py-16 text-center">
      {icon && (
        <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-full bg-paper text-mute">
          {icon}
        </div>
      )}
      <Heading className="text-lg font-medium tracking-[-0.01em]">{title}</Heading>
      {description && (
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-mute">{description}</p>
      )}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  )
}

/**
 * Ошибка загрузки с возможностью повторить запрос.
 * @param {{title?: string, onRetry: () => void, level?: 1|2}} props
 */
export function ErrorPanel({ title = 'Не удалось загрузить данные', onRetry, level = 2 }) {
  return (
    <StatePanel
      icon={<AlertIcon className="h-5 w-5" />}
      title={title}
      level={level}
      action={
        <button type="button" className="btn-secondary" onClick={onRetry}>
          Повторить
        </button>
      }
    />
  )
}

/**
 * Пустая корзина.
 */
export function EmptyCart() {
  return (
    <StatePanel
      icon={<BagIcon className="h-5 w-5" />}
      title="Корзина пуста"
      action={
        <Link to="/" className="btn-primary">
          Перейти в каталог
        </Link>
      }
    />
  )
}

/**
 * Каталог не дал результатов под текущие фильтры.
 * @param {{onReset: () => void}} props
 */
export function EmptySearch({ onReset }) {
  return (
    <StatePanel
      icon={<SearchIcon className="h-5 w-5" />}
      title="Ничего не найдено"
      action={
        <button type="button" className="btn-secondary" onClick={onReset}>
          Сбросить фильтры
        </button>
      }
    />
  )
}
