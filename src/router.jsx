import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { RootLayout } from './components/RootLayout.jsx'
import { CartPage } from './pages/CartPage.jsx'
import { CatalogPage } from './pages/CatalogPage.jsx'
import { NotFoundPage } from './pages/NotFoundPage.jsx'
import { ProductPage } from './pages/ProductPage.jsx'
import {
  parseAppSearch,
  stringifyAppSearch,
  validateCatalogSearch,
  validateProductSearch,
} from './lib/search.js'

const rootRoute = createRootRoute({
  component: RootLayout,
})

const catalogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  validateSearch: validateCatalogSearch,
  component: CatalogPage,
})

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/product/$productId',
  validateSearch: validateProductSearch,
  component: ProductPage,
})

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: CartPage,
})

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/$',
  component: NotFoundPage,
})

const routeTree = rootRoute.addChildren([
  catalogRoute,
  productRoute,
  cartRoute,
  notFoundRoute,
])

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  parseSearch: parseAppSearch,
  stringifySearch: stringifyAppSearch,
})
