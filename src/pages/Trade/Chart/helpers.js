export const getBinSizeAndUnit = (input) => {
  const numValue = Number(input)

  if (!isNaN(numValue) && isFinite(numValue)) {
    return {
      binSize: numValue,
      binUnit: 'minute',
    }
  }

  const dayRegex = /^(\d+)D$/
  const weekRegex = /^(\d+)W$/
  const monthRegex = /^(\d+)M$/

  if (dayRegex.test(input)) {
    const match = dayRegex.exec(input)
    if (match) {
      const numValueD = Number(match[1])
      if (!isNaN(numValueD) && isFinite(numValueD)) {
        return {
          binSize: numValueD,
          binUnit: 'day',
        }
      }
    }
  }

  if (weekRegex.test(input)) {
    const match = weekRegex.exec(input)
    if (match) {
      const numValueW = Number(match[1])
      if (!isNaN(numValueW) && isFinite(numValueW)) {
        return {
          binSize: numValueW,
          binUnit: 'week',
        }
      }
    }
  }

  if (monthRegex.test(input)) {
    const match = monthRegex.exec(input)
    if (match) {
      const numValueM = Number(match[1])
      if (!isNaN(numValueM) && isFinite(numValueM)) {
        return {
          binSize: numValueM,
          binUnit: 'month',
        }
      }
    }
  }

  return null
}
