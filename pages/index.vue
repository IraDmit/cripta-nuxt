<template>
  <div class="container">
    <div class="first-row">
      <input
        v-model="ticker"
        type="text"
        class="form-control"
        @keyup.enter="searchTicker"
      />
      <div class="btn btn-info" @click="searchTicker">search</div>
      <app-coins-result :search-result='matchingTicker' @setTicker="setTicker"/>
      <span class="error">{{ error }}</span>
    </div>
    <div class="second-row row">
      <div
        v-for="(item, idx) in tickers"
        :key="idx"
        class="col-xxl-3 col-md-4 col-6"
        :class="{ selected: item.ticker === sel?.ticker }"
        @click="selectedTicker(item)"
      >
        <h2>{{ item.ticker }} to USD</h2>
        <p>{{ item.price }}</p>
        <button @click="deleteTicker(idx)">delete</button>
      </div>
    </div>
    <div v-if="sel" class="third-row">
      <div class="graph-wrp">
        <h2>{{ sel.ticker }} to USD</h2>
        <div class="graph">
          <div
            v-for="(bar, idx) in normalizeGraph()"
            :key="idx"
            class="bar"
            :style="{ height: `${bar}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'IndexPage',
  data() {
    return {
      ticker: null,
      tickers: [
        {
          ticker: 'demo',
          price: '123',
        },
        {
          ticker: 'demo2',
          price: '123',
        },
      ],
      sel: null,
      graph: [],
      matchingTicker: null,
      error: null,
      intervals: []
    }
  },
  computed: {
    ...mapGetters({ getCoinsList: 'coins/getCoinsList' }),
  },
  watch: {
    ticker() {
      if (this.ticker.length === 0) {
        this.matchingTicker = []
        return
      }
      this.matchingTicker = Object.values(this.getCoinsList).filter(
        (element) => {
          return element.FullName.toLowerCase()
            .trim()
            .includes(this.ticker.toLowerCase())
        }
      )
    },
  },
  created() {
    this.$store.dispatch('coins/fetchCoinsList')
  },
  methods: {
    searchTicker() {
      if (!this.tickers.find((el) => el.ticker === this.ticker)) {
        const currentTicker = {
          ticker: this.ticker,
          price: '-',
        }
        this.tickers.push(currentTicker)
        currentTicker.ticker = setInterval(async () => {
          const { data } = await this.$axios.get(
            `https://min-api.cryptocompare.com/data/price?fsym=${currentTicker.ticker}&tsyms=USD&api_key=d580e57d5249755e75ac50f672d6a99a3b607971503abb8373efd9ecc6039ac6`
          )
          if (!data.Response) {
            this.tickers.find(
              (el) => el.ticker === currentTicker.ticker
            ).price = data.USD > 1 ? data.USD.toFixed(2) : data.USD.toFixed(4)

            if (this.sel?.ticker === currentTicker.ticker) {
              this.graph.push(data.USD)
            }
          } else {
            this.error='coin dont exist'
          }
        }, 4000)

        this.ticker = ''
      } else{
        this.error='coin is exist'
      }
    },
    normalizeGraph() {
      const maxValue = Math.max(...this.graph)
      const minValue = Math.min(...this.graph)
      return this.graph.map(
        (el) => ((el - minValue) * 100) / (maxValue - minValue)
      )
    },
    deleteTicker(idx) {
      this.tickers.splice(idx, 1)

    },
    selectedTicker(ticker) {
      this.sel = ticker
      this.graph = []
    },
    setTicker(coin){
      this.sel = coin
      this.searchTicker()
    }
  },
}
</script>
<style lang="scss" scoped>
.row {
  div {
    border: 1px solid red;
    &.selected {
      border: 2px solid #000;
    }
  }
}
.first-row {
  display: flex;
  position: relative;
}

.graph {
  display: flex;
  grid-gap: 3px;
  height: 200px;
  width: 100%;
  border-left: 1px solid #000;
  border-bottom: 1px solid #000;
  align-items: flex-end;
  padding-left: 3px;
  .bar {
    width: 2.5rem;
    min-height: 10px;
    background-color: #000;
  }
}
</style>
