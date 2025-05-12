import {MARKET_CHART_URL} from '../../../constants/applications'
import {SUPPORTED_CHAINID} from '../../../constants/chains'

export const isSepolia = (chainId) => {
  return chainId === Number(SUPPORTED_CHAINID.ARBITRUM_SEPOLIA)
}

export const isImola = (chainId) => {
  return chainId === Number(SUPPORTED_CHAINID.IMOLA)
}

export const isBartio = (chainId) => {
  return chainId === Number(SUPPORTED_CHAINID.BARTIO)
}

export const isBscTestnet = (chainId) => {
  return chainId === Number(SUPPORTED_CHAINID.BSC_TESTNET)
}

export const getMarketChartUrl = (value) => {
  const chainId = typeof value === 'number' ? value : JSON.parse(value.ticker).chainId

  if (isSepolia(chainId)) {
    return MARKET_CHART_URL.SEPOLIA
  } else if (isImola(chainId)) {
    return MARKET_CHART_URL.IMOLA
  } else if (isBartio(chainId)) {
    return MARKET_CHART_URL.BARTIO
  } else if (isBscTestnet(chainId)) {
    return MARKET_CHART_URL.BSC_TESTNET
  } else {
    return MARKET_CHART_URL.DEFAULT
  }
}

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
