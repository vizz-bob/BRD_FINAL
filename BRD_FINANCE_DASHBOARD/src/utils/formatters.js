const MILLION = 1_000_000
const LAKH = 100_000

export const formatCurrency = (value = 0) => {
  if (typeof value !== 'number') return '₹0'
  if (value >= MILLION) {
    return `₹${(value / MILLION).toFixed(1)}M`
  }
  if (value >= LAKH) {
    return `₹${(value / LAKH).toFixed(1)}L`
  }
  return `₹${value.toLocaleString('en-IN')}`
}

export const formatPercent = (value = 0, options = {}) => {
  const fractionDigits = options.digits ?? 0
  return `${(value * 100).toFixed(fractionDigits)}%`
}

export const formatTrend = (value = 0) => {
  const numericValue = Number(value) || 0
  const prefix = numericValue > 0 ? '+' : ''
  return `${prefix}${numericValue.toFixed(1)}%`
}

