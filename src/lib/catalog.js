/**
 * @typedef {import('./types.js').Product} Product
 * @typedef {import('./types.js').ProductColor} ProductColor
 * @typedef {import('./types.js').Size} Size
 */

/**
 * Минимальная цена среди всех цветов товара.
 * @param {Product} product
 * @returns {number}
 */
export function getMinPrice(product) {
  const prices = product.colors.map((color) => Number(color.price))
  return prices.length ? Math.min(...prices) : 0
}

/**
 * Товар в наличии, если хотя бы у одного цвета есть хотя бы один размер.
 * @param {Product} product
 * @returns {boolean}
 */
export function isInStock(product) {
  return product.colors.some((color) => color.sizes.length > 0)
}

/**
 * Изображение для карточки каталога.
 * @param {Product} product
 * @returns {string}
 */
export function getCoverImage(product) {
  return product.colors.find((color) => color.images.length > 0)?.images[0] ?? ''
}

/**
 * Цвет по умолчанию: первый доступный, иначе первый в списке.
 * @param {Product} product
 * @returns {ProductColor|null}
 */
export function getDefaultColor(product) {
  return product.colors.find((color) => color.sizes.length > 0) ?? product.colors[0] ?? null
}

/**
 * Находит размер по ID в справочнике.
 * @param {Size[]} sizes
 * @param {number|undefined|null} sizeId
 * @returns {Size|null}
 */
export function findSize(sizes, sizeId) {
  if (sizeId == null) return null
  return sizes.find((size) => size.id === sizeId) ?? null
}

/**
 * Склоняет цвет для подписи: «цвет: чёрный».
 * @param {ProductColor} color
 * @returns {string}
 */
export function colorLabel(color) {
  return color.name.charAt(0).toUpperCase() + color.name.slice(1)
}
