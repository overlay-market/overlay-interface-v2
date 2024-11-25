import {getBinSizeAndUnit, getMarketChartUrl} from './helpers'

// Reference: https://www.tradingview.com/charting-library-docs/latest/tutorials/implement_datafeed_tutorial/Streaming-Implementation

const idToSubscription = new Map()

export const subscribeOnStream = (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback, lastBarCached) => {
  let subscriptionItem = idToSubscription.get(subscriberUID)

  if (subscriptionItem) return

  const {binSize, binUnit} = getBinSizeAndUnit(resolution)

  const urlParameters = {
    market: symbolInfo?.marketAddress.toLowerCase(),
    binSize: binSize,
    binUnit: binUnit,
  }
  const query = Object.keys(urlParameters)
    .map(name => `${name}=${encodeURIComponent(urlParameters[name])}`)
    .join('&')

  const marketChartUrl = getMarketChartUrl(symbolInfo)
  const endpoint = `${marketChartUrl}/sse?${query}`

  const eventSource = new EventSource(endpoint)

  eventSource.onmessage = event => {
    const lastBar = JSON.parse(event.data)[0]
    updateLastDailyBar(lastBar, subscriberUID)
  }

  eventSource.onerror = error => {
    eventSource.close()
  }

  subscriptionItem = {
    resolution,
    lastBarCached,
    callback: onRealtimeCallback,
    eventSource,
  }

  idToSubscription.set(subscriberUID, subscriptionItem)
}

const updateLastDailyBar = (lastBar, subscriberUID) => {
  const subscriptionItem = idToSubscription.get(subscriberUID)

  if (subscriptionItem) {
    const lastBarCached = subscriptionItem.lastBarCached
    const latestPrice = lastBar.close
    const latestTime = new Date(lastBar._id.time).getTime()

    let bar

    // If the latest bar has the same timestamp as the previous one, it is an update.
    // Otherwise, it is a new bar.
    if (latestTime > lastBarCached.time) {
      bar = {
        time: latestTime,
        open: lastBar.open,
        high: lastBar.high,
        low: lastBar.low,
        close: latestPrice,
      }
    } else if (latestTime == lastBarCached.time) {
      bar = {
        ...lastBarCached,
        high: Math.max(lastBarCached.high, latestPrice),
        low: Math.min(lastBarCached.low, latestPrice),
        close: latestPrice,
      }
    } else {
      // If the latest bar is older than the previous one, we ignore it.
      return
    }

    subscriptionItem.lastBarCached = bar

    // Update the tradingview chart with the latest price
    subscriptionItem.callback(bar)
  }
}

export const unsubscribeFromStream = (subscriberUID) => {
  const subscriptionItem = idToSubscription.get(subscriberUID)

  if (subscriptionItem) {
    subscriptionItem.eventSource.close()
    idToSubscription.delete(subscriberUID)
  }
}
