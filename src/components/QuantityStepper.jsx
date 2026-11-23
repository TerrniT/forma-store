import { MinusIcon, PlusIcon } from './Icons.jsx'

/**
 * Счётчик количества с нижней границей 1.
 * @param {{
 *   value: number,
 *   onChange: (next: number) => void,
 *   min?: number,
 *   max?: number,
 * }} props
 */
export function QuantityStepper({ value, onChange, min = 1, max = 999 }) {
  return (
    <div className="inline-flex h-9 items-stretch border border-line bg-white">
      <button
        type="button"
        aria-label="Уменьшить количество"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="icon-btn w-8 text-mute hover:text-ink disabled:opacity-30"
      >
        <MinusIcon className="h-3.5 w-3.5" />
      </button>
      <span className="grid w-9 place-items-center border-x border-line text-[13px] tabular-nums">
        {value}
      </span>
      <button
        type="button"
        aria-label="Увеличить количество"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className="icon-btn w-8 text-mute hover:text-ink disabled:opacity-30"
      >
        <PlusIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
