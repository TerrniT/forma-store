/**
 * @typedef {Object} CatalogSearch
 * @property {string} q
 * @property {'default'|'price-asc'|'price-desc'} sort
 * @property {boolean} inStock
 */

/**
 * Приводит search params каталога к предсказуемому виду.
 * @param {Record<string, unknown>} search
 * @returns {CatalogSearch}
 */
export function validateCatalogSearch(search) {
  return {
    q: typeof search.q === 'string' ? search.q : '',
    sort:
      search.sort === 'price-asc' || search.sort === 'price-desc'
        ? search.sort
        : 'default',
    inStock: search.inStock === true || search.inStock === 'true',
  }
}

/**
 * Убирает значения по умолчанию из URL, чтобы ссылки оставались короткими.
 * @param {CatalogSearch} search
 * @returns {Record<string, string|boolean>}
 */
export function buildCatalogSearch(search) {
  /** @type {Record<string, string|boolean>} */
  const result = {}

  if (search.q.trim()) result.q = search.q
  if (search.sort !== 'default') result.sort = search.sort
  if (search.inStock) result.inStock = true

  return result
}

/**
 * Разбирает query string в простой объект строк. Собственный парсер нужен,
 * чтобы поисковый запрос «123» не превращался в число и не терялся.
 * @param {string} searchString
 * @returns {Record<string, string>}
 */
export function parseAppSearch(searchString) {
  return Object.fromEntries(
    new URLSearchParams(searchString.replace(/^\?/, '')).entries(),
  )
}

/**
 * Сериализует search params без значений по умолчанию и пустых ключей.
 * @param {Record<string, unknown>} search
 * @returns {string}
 */
export function stringifyAppSearch(search) {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(search)) {
    if (value === undefined || value === null || value === '' || value === false) {
      continue
    }
    if (key === 'sort' && value === 'default') continue
    params.set(key, String(value))
  }

  const query = params.toString()
  return query ? `?${query}` : ''
}

/**
 * @param {unknown} value
 * @returns {number|undefined}
 */
function toPositiveId(value) {
  if (typeof value === 'number') {
    return Number.isInteger(value) && value > 0 ? value : undefined
  }
  if (typeof value === 'string' && /^\d+$/.test(value)) {
    const parsed = Number(value)
    return parsed > 0 ? parsed : undefined
  }
  return undefined
}

/**
 * @typedef {Object} ProductSearch
 * @property {number|undefined} color
 * @property {number|undefined} size
 */

/**
 * Валидирует выбранный цвет и размер в URL карточки товара.
 * @param {Record<string, unknown>} search
 * @returns {ProductSearch}
 */
export function validateProductSearch(search) {
  return {
    color: toPositiveId(search.color),
    size: toPositiveId(search.size),
  }
}
