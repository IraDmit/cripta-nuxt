// import axios from 'axios'
const apiKey =
  'd580e57d5249755e75ac50f672d6a99a3b607971503abb8373efd9ecc6039ac6'

const tickersHendlers = new Map()
const AGGR_INDEX = '5'
let socket

const createSocket = () => {
  if (process.client) {
    socket = new WebSocket(
      `wss://streamer.cryptocompare.com/v2?api_key=${apiKey}`
    )
  }
}

const sendToWS = (ticker, action) => {
  const message = JSON.stringify({
    action,
    subs: [`5~CCCAGG~${ticker}~USD`],
  })
  if (socket && socket.readyState === 1) {
    socket.send(message)
  }
  if (socket) {
    socket.addEventListener('open', () => {
      socket.send(message)
    })
  }
}

// 'BTC': [functions...]

export const subscribeToTicker = (ticker, callback) => {
  const subscriber = tickersHendlers.get(ticker, []) || []
  tickersHendlers.set(ticker, [...subscriber, callback])
  sendToWS(ticker, 'SubAdd')
}

export const unsubscribeFormTicker = (ticker) => {
  tickersHendlers.delete(ticker)
  sendToWS(ticker, 'SubRemove')
  // const subscriber = tickers.get(ticker, []) ? tickers.get(ticker, []) : []
  // tickers.set(
  //   ticker,
  //   subscriber.filter((func) => func !== callback)
  // )
}

createSocket()

if (socket) {
  socket.addEventListener('message', (e) => {
    const { TYPE, PRICE: newPrice, FROMSYMBOL: currency } = JSON.parse(e.data)
    if (TYPE !== AGGR_INDEX || !newPrice) return

    const handler = tickersHendlers.get(currency) || []
    handler.forEach((func) => func(newPrice))
  })
}
