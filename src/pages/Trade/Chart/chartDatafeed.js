import {getBinSizeAndUnit, getMarketChartUrl} from './helpers'
import {subscribeOnStream, unsubscribeFromStream} from './streaming'

// Reference: https://www.tradingview.com/charting-library-docs/latest/tutorials/implement_datafeed_tutorial/Widget-Setup

// DatafeedConfiguration implementation
const configurationData = {
  // Represents the resolutions for bars supported by your datafeed
  supported_resolutions: ['5', '15', '30', '60', '240', '720', '1D', '3D', '1W', '1M'],
}

// Keep a record of the most recent bar on the chart, for use in the realtime update callback
const lastBarsCache = new Map()

export default {
  onReady: callback => {
    setTimeout(() => callback(configurationData))
  },

  searchSymbols: async (userInput, exchange, symbolType, onResultReadyCallback) => {
    // Get all symbols
  },

  resolveSymbol: async (symbolName, onSymbolResolvedCallback, onResolveErrorCallback, extension) => {
    const {marketAddress, description, chainId} = JSON.parse(symbolName || '{}')
    
    const symbolInfo = {
      ticker: JSON.stringify({marketAddress, description, chainId}),
      name: description,
      description: description,
      type: 'crypto',
      session: '24x7',
      timezone: 'Etc/UTC',
      exchange: 'Overlay',
      minmov: 1,
      pricescale: 100,
      has_intraday: false,
      visible_plots_set: 'ohlc',
      has_weekly_and_monthly: false,
      supported_resolutions: configurationData.supported_resolutions,
      volume_precision: 2,
      data_status: 'streaming',
      marketAddress: marketAddress,
      has_intraday: true,
      format: 'volume',
    }

    onSymbolResolvedCallback(symbolInfo)
  },

  getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
    const {from, to, firstDataRequest} = periodParams
    
    const {binSize, binUnit} = getBinSizeAndUnit(resolution)

    const urlParameters = {
      market: symbolInfo?.marketAddress.toLowerCase(),
      binSize: binSize,
      binUnit: binUnit,
      from: from * 1000,
      to: to * 1000,
      limit: 2000,
    }
    const query = Object.keys(urlParameters)
      .map(name => `${name}=${encodeURIComponent(urlParameters[name])}`)
      .join('&')

    try {
      let bars = []

      const marketChartUrl = getMarketChartUrl(symbolInfo)

      let res = await fetch(`${marketChartUrl}?${query}`)

      res = await res.json()

      if (res.length === 0) {
        // "noData" should be set if there is no data in the requested period
        onHistoryCallback([], {noData: true})
        return
      }

      res.forEach(bar => {
        bars = [
          ...bars,
          {
            time: new Date(bar._id.time).getTime(),
            low: bar.low,
            high: bar.high,
            open: bar.open,
            close: bar.close,
          },
        ]
      })

      if (firstDataRequest) {
        lastBarsCache.set(symbolInfo.full_name, {...bars[bars.length - 1]})
      }
      onHistoryCallback(bars, {noData: false})
    } catch (error) {
      console.log('[getBars]: Get error', error)
      onErrorCallback(error)
    }
  },

  subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) => {
    subscribeOnStream(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback, lastBarsCache.get(symbolInfo.full_name))
  },

  unsubscribeBars: subscriberUID => {
    unsubscribeFromStream(subscriberUID)
  },
}
