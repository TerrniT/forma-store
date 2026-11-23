import { useState } from 'react'
import { ArrowLeftIcon, ArrowRightIcon } from './Icons.jsx'

/**
 * Галерея изображений без сторонних библиотек: стрелки, миниатюры и счётчик.
 * @param {{images: string[], alt: string}} props
 */
export function Gallery({ images, alt }) {
  const [index, setIndex] = useState(0)
  const safeIndex = Math.min(index, Math.max(0, images.length - 1))
  const hasMultiple = images.length > 1

  if (images.length === 0) {
    return (
      <div className="grid aspect-[3/4] place-items-center border border-line bg-white text-sm text-mute">
        Нет изображения
      </div>
    )
  }

  const showPrevious = () => {
    setIndex((current) => (current - 1 + images.length) % images.length)
  }

  const showNext = () => {
    setIndex((current) => (current + 1) % images.length)
  }

  return (
    <div>
      <div className="group relative aspect-[3/4] overflow-hidden border border-line bg-white">
        <img
          src={images[safeIndex]}
          alt={`${alt} — изображение ${safeIndex + 1}`}
          className="h-full w-full object-contain"
        />

        {hasMultiple && (
          <>
            <button
              type="button"
              aria-label="Предыдущее изображение"
              onClick={showPrevious}
              className="icon-btn absolute left-3 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full border border-line bg-white/90 text-ink hover:bg-white"
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Следующее изображение"
              onClick={showNext}
              className="icon-btn absolute right-3 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full border border-line bg-white/90 text-ink hover:bg-white"
            >
              <ArrowRightIcon className="h-4 w-4" />
            </button>
            <span className="absolute bottom-3 right-3 border border-line bg-white/90 px-2 py-1 text-[11px] tabular-nums text-mute">
              {safeIndex + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="mt-3 flex gap-2" role="group" aria-label="Миниатюры изображений">
          {images.map((image, imageIndex) => (
            <button
              key={image}
              type="button"
              aria-label={`Показать изображение ${imageIndex + 1}`}
              aria-pressed={imageIndex === safeIndex}
              onClick={() => setIndex(imageIndex)}
              className={`h-[76px] w-14 border bg-white p-1 transition-colors ${
                imageIndex === safeIndex
                  ? 'border-ink'
                  : 'border-line hover:border-mute'
              }`}
            >
              <img
                src={image}
                alt=""
                className="h-full w-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
