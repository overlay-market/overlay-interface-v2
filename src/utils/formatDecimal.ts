export const formatDecimalToPercentage = (decimal?: number | string) => {
  const number = typeof decimal === 'string' ? Number(decimal) : decimal
  
  return number ? number * 100 : undefined
}