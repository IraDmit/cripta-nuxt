import axios from 'axios'
const apiKey =
  'd580e57d5249755e75ac50f672d6a99a3b607971503abb8373efd9ecc6039ac6'

const tickers = new Map()

const loadTicker = async () => {
  const { data } = await axios.get(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[
      ...tickers.keys(),
    ]}&tsyms=USD&api_key=${apiKey}`
  )

  Object.entries(data).forEach(([currency, newPrice]) => {
    const handler = tickers.get(currency) || []
    handler.forEach((func) => func(newPrice))
  })

  return data
}

// 'BTC': [functions...]

export const subscribeToTicker = (ticker, callback) => {
  const subscriber = tickers.get(ticker, []) || []
  tickers.set(ticker, [...subscriber, callback])
}

export const unsubscribeFormTicker = (ticker, callback) => {
  const subscriber = tickers.get(ticker, []) ? tickers.get(ticker, []) : []
  tickers.set(
    ticker,
    subscriber.filter((func) => func !== callback)
  )
}

setInterval(() => {
  loadTicker()
}, 5000)
