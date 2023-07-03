import axios from 'axios'

const apiKey = "d580e57d5249755e75ac50f672d6a99a3b607971503abb8373efd9ecc6039ac6"

export const loadTicker = async (tickers)=>{
  const { data } = await axios.get(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tickers}&tsyms=USD&api_key=${apiKey}`
  )
  return data
}
