import { useEffect } from 'react'

/**
 * Обновляет заголовок вкладки при переходе между страницами.
 * @param {string|null|undefined} title
 */
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — Форма` : 'Форма — каталог'
  }, [title])
}
