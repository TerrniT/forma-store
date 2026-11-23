import { Outlet } from '@tanstack/react-router'
import { Header } from './Header.jsx'

export function RootLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-paper text-ink antialiased">
      <Header />
      <main id="main" className="mx-auto w-full max-w-[1240px] flex-1 px-5 pb-24 pt-10 md:px-8 md:pt-14">
        <Outlet />
      </main>
    </div>
  )
}
