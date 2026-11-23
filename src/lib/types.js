/**
 * Общие JSDoc-типы проекта. Файл не содержит runtime-кода и существует
 * только для автодополнения и описания структур данных.
 */

/**
 * @typedef {Object} ProductColor
 * @property {number} id
 * @property {string} name
 * @property {string} [hex] Цвет свотча. Добавлен к данным API по условию задания.
 * @property {string[]} images
 * @property {string} price Цена в виде строки, как в API.
 * @property {string} description
 * @property {number[]} sizes ID доступных размеров.
 */

/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} name
 * @property {number} categoryId
 * @property {string} brand
 * @property {ProductColor[]} colors
 */

/**
 * @typedef {Object} Size
 * @property {number} id
 * @property {string} name
 * @property {number} number
 */

/**
 * @typedef {Object} CartItem
 * @property {number} productId
 * @property {number} colorId
 * @property {number} sizeId
 * @property {number} quantity
 */

/**
 * @typedef {Object} CartState
 * @property {CartItem[]} items
 * @property {string|null} promoCode
 */

/**
 * Позиция корзины, обогащённая данными каталога.
 * @typedef {Object} CartLine
 * @property {string} key
 * @property {Product} product
 * @property {ProductColor} color
 * @property {Size} size
 * @property {number} quantity
 * @property {number} price
 * @property {number} total
 */

/**
 * @typedef {Object} Promo
 * @property {string} code
 * @property {'percent'|'fixed'} type
 * @property {number} value
 */

export {}
