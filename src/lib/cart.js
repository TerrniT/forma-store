/**
 * @typedef {import('./types.js').CartItem} CartItem
 * @typedef {import('./types.js').Product} Product
 * @typedef {import('./types.js').Size} Size
 * @typedef {import('./types.js').CartLine} CartLine
 */

/**
 * Уникальный ключ позиции: товар + цвет + размер.
 * @param {number} productId
 * @param {number} colorId
 * @param {number} sizeId
 * @returns {string}
 */
export function getCartItemKey(productId, colorId, sizeId) {
  return `${productId}:${colorId}:${sizeId}`
}

/**
 * Сопоставляет сохранённые позиции с актуальными данными каталога.
 * Позиции с несуществующими или несовместимыми вариантами отбрасываются.
 * @param {CartItem[]} items
 * @param {Product[]} products
 * @param {Size[]} sizes
 * @returns {CartLine[]}
 */
export function resolveCartLines(items, products, sizes) {
  const productsById = new Map(products.map((product) => [product.id, product]))
  const sizesById = new Map(sizes.map((size) => [size.id, size]))

  return items.flatMap((item) => {
    const product = productsById.get(item.productId)
    const color = product?.colors.find((itemColor) => itemColor.id === item.colorId)
    const size = sizesById.get(item.sizeId)

    if (!product || !color || !size || !color.sizes.includes(size.id)) {
      return []
    }

    const price = Number(color.price)

    return [
      {
        key: getCartItemKey(product.id, color.id, size.id),
        product,
        color,
        size,
        quantity: item.quantity,
        price,
        total: price * item.quantity,
      },
    ]
  })
}
