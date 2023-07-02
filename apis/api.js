import axios from 'axios'

export const loadTicker = async (tickers)=>{
  console.log(tickers);
  const { data } = await axios.get(
    `https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=${tickers}&api_key=d580e57d5249755e75ac50f672d6a99a3b607971503abb8373efd9ecc6039ac6`
  )
  return data
}
