import axios from 'axios'
const apiKey =
  'd580e57d5249755e75ac50f672d6a99a3b607971503abb8373efd9ecc6039ac6'

const tickersHendlers = new Map()

const loadTicker = async () => {
  // if (tickersHendlers.size !== 0 ) return
  const { data } = await axios.get(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[
      ...tickersHendlers.keys(),
    ]}&tsyms=USD&api_key=${apiKey}`
  )

  Object.entries(data).forEach(([currency, newPrice]) => {
    // console.log(newPrice);
    const handler = tickersHendlers.get(currency) || []
    handler.forEach((func) => func(newPrice))
  })

  return data
}

// 'BTC': [functions...]

export const subscribeToTicker = (ticker, callback) => {
  const subscriber = tickersHendlers.get(ticker, []) || []
  tickersHendlers.set(ticker, [...subscriber, callback])
}

export const unsubscribeFormTicker = (ticker) => {
  tickersHendlers.delete(ticker)
  // const subscriber = tickers.get(ticker, []) ? tickers.get(ticker, []) : []
  // tickers.set(
  //   ticker,
  //   subscriber.filter((func) => func !== callback)
  // )
}

setInterval(() => {
  loadTicker()
}, 5000)
