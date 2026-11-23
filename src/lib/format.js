const priceFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})

/**
 * Форматирует цену в рублях без копеек.
 * @param {number} value
 * @returns {string}
 */
export function formatPrice(value) {
  return priceFormatter.format(Number.isFinite(value) ? value : 0)
}

/**
 * Выбирает форму слова для числа.
 * @param {number} count
 * @param {[string, string, string]} forms Формы для 1, 2-4 и 5+.
 * @returns {string}
 */
export function pluralize(count, forms) {
  const mod10 = count % 10
  const mod100 = count % 100

  if (mod10 === 1 && mod100 !== 11) return forms[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1]
  return forms[2]
}

/**
 * Возвращает количество товаров в правильной форме.
 * @param {number} count
 * @returns {string}
 */
export function formatCount(count) {
  return `${count} ${pluralize(count, ['товар', 'товара', 'товаров'])}`
}
