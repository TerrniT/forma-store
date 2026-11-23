import { Link } from '@tanstack/react-router'
import { StatePanel } from '../components/StatePanel.jsx'
import { useDocumentTitle } from '../lib/useDocumentTitle.js'

export function NotFoundPage() {
  useDocumentTitle('Страница не найдена')

  return (
    <div className="mt-8">
      <StatePanel
        title="Страница не найдена"
        level={1}
        action={
          <Link to="/" className="btn-primary">
            На главную
          </Link>
        }
      />
    </div>
  )
}
