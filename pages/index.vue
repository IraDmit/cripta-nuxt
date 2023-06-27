<template>
  <div class="container">
    <section class="first-row">
      <div class="search">
        <input
          v-model="ticker"
          type="text"
          class="form-control"
          @keyup.enter="searchTicker"
        />
        <app-coins-result
          v-if="matchingTicker?.length"
          :search-result="matchingTicker"
          @setTicker="setTicker"
        />
      </div>
      <div class="btn btn-info" @click="searchTicker">search</div>
      <span class="error">{{ error }}</span>
    </section>
    <section class="second-row row">
      <input v-model="filter" type="text" />
      <div
        v-for="(item, idx) in paginatedTickers"
        :key="idx"
        class="ticker col-md-4 col-6"
        :class="{ selected: item.ticker === sel?.ticker }"
        @click="selectedTicker(item)"
      >
        <h2>{{ item.ticker }} to USD</h2>
        <p>{{ item.price }}</p>
        <button @click.stop="deleteTicker(item, idx)">delete</button>
        <div class="fix" @click="fixTicker(item)">zakr</div>
      </div>
      <div v-if="isNext" class="next" @click="nextPage()">next</div>
      <div v-if="isPrev" class="prev" @click="prevPage()">prev</div>
    </section>
    <section v-if="sel" class="third-row">
      <div class="graph-wrp">
        <h2>{{ sel.ticker || sel.Symbol }} to USD</h2>
        <div class="graph">
          <div
            v-for="(bar, idx) in normalizeGraph"
            :key="idx"
            class="bar"
            :style="{ height: `${bar}%` }"
          ></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'IndexPage',
  data() {
    return {
      page: this.$route.query.page ? +this.$route.query.page : 1,
      ticker: null,
      tickers: [
        {
          ticker: 'demo',
          price: '-',
        },
        {
          ticker: 'demo',
          price: '-',
        },
        {
          ticker: 'demo',
          price: '-',
        },
        {
          ticker: 'demo',
          price: '-',
        },
        {
          ticker: 'demo',
          price: '-',
        },
        {
          ticker: 'demo1',
          price: '-',
        },
        {
          ticker: 'demo',
          price: '-',
        },
        {
          ticker: 'demo',
          price: '-',
        },
        {
          ticker: 'demo',
          price: '-',
        },
        {
          ticker: 'demo',
          price: '-',
        },
        {
          ticker: 'demo',
          price: '-',
        },
        {
          ticker: 'demo2',
          price: '-',
        },
        {
          ticker: 'demo',
          price: '-',
        },
        {
          ticker: 'demo',
          price: '-',
        },
        {
          ticker: 'demo',
          price: '-',
        },
        {
          ticker: 'demo',
          price: '-',
        },
        {
          ticker: 'demo',
          price: '-',
        },
        {
          ticker: 'demo',
          price: '-',
        },
        {
          ticker: 'demo3',
          price: '-',
        },
        {
          ticker: 'demo',
          price: '-',
        },
        {
          ticker: 'demo',
          price: '-',
        },
      ],
      sel: null,
      graph: [],
      matchingTicker: null,
      error: null,
      fixed_tickers: [],
      tickers_on_page: 6,
      filter: this.$route.query.filter ? this.$route.query.filter : '',
    }
  },
  computed: {
    ...mapGetters({ getCoinsList: 'coins/getCoinsList' }),
    maxPage() {
      return Math.ceil(this.tickers.length / this.tickers_on_page)
    },
    startIndex() {
      return this.endIndex - this.tickers_on_page
    },
    endIndex() {
      return this.page * this.tickers_on_page
    },
    filterTickers() {
      return this.tickers.filter((el) => el.ticker.includes(this.filter))
    },
    paginatedTickers() {
      return this.filterTickers.slice(this.startIndex, this.endIndex)
    },
    pageStateOptions() {
      return {
        page: this.page,
        filter: this.filter,
      }
    },
    normalizeGraph() {
      const maxValue = Math.max(...this.graph)
      const minValue = Math.min(...this.graph)
      return this.graph.map(
        (el) => ((el - minValue) * 100) / (maxValue - minValue)
      )
    },
    isNext() {
      return this.page < this.maxPage
    },
    isPrev() {
      return this.page > 1
    },
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
    pageStateOptions(value) {
      let params = ''
      if (value.filter && value.page > 1) {
        params = `?filter=${value.filter}&page=${value.page}`
      } else if (value.page > 1 && !value.filter) {
        params = `?page=${value.page}`
      } else if (value.filter && value.page === 1) {
        params = `?filter=${value.filter}`
      }
      history.pushState({}, '', `${location.origin}${params}`)
    },
    filter() {
      this.page = 1
    },
  },
  created() {
    this.$store.dispatch('coins/fetchCoinsList')
  },
  mounted() {
    this.setData()
  },
  methods: {
    setData() {
      if (process.browser && localStorage && localStorage.fixed_tickers) {
        this.tickers.push(...JSON.parse(localStorage?.fixed_tickers))
      }
    },
    searchTicker() {
      if (!this.tickers.find((el) => el.ticker === this.ticker)) {
        const currentTicker = {
          ticker: this.ticker,
          price: '-',
          interval_ticker: '',
        }
        this.tickers.push(currentTicker)
        currentTicker.interval_ticker = setInterval(async () => {
          const { data } = await this.$axios.get(
            `https://min-api.cryptocompare.com/data/price?fsym=${currentTicker.ticker}&tsyms=USD&api_key=d580e57d5249755e75ac50f672d6a99a3b607971503abb8373efd9ecc6039ac6`
          )
          if (!data.Response) {
            this.tickers.find(
              (el) => el.ticker === currentTicker.ticker
            ).price = data.USD > 1 ? data.USD.toFixed(2) : data.USD.toFixed(4)

            if (
              this.sel?.ticker === currentTicker.ticker ||
              this.sel?.Symbol === currentTicker.ticker
            ) {
              this.graph.push(data.USD)
            }
          } else {
            this.error = 'coin dont exist'
          }
        }, 4000)

        this.ticker = ''
      } else {
        this.error = 'coin is exist'
      }
    },
    deleteTicker(item, idx) {
      this.tickers.splice(idx, 1)
      clearInterval(item.interval_ticker)
      this.sel = null
    },
    selectedTicker(ticker) {
      this.sel = ticker
      this.graph = []
    },
    setTicker(coin) {
      this.sel = coin
      this.ticker = coin.Symbol
      this.searchTicker()
    },
    fixTicker(item) {
      this.fixed_tickers.push(item)
      localStorage.fixed_tickers = JSON.stringify(this.fixed_tickers)
    },
    nextPage() {
      if (this.page <= this.maxPage) {
        this.page++
      }
    },
    prevPage() {
      if (this.page > 1) {
        this.page--
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.row {
  div {
    border: 1px solid red;
    border-radius: 10px;
    &.selected {
      border: 2px solid #000;
    }
  }
}

section {
  margin: 100px 0px;
}

.first-row {
  display: flex;
  position: relative;
  .search {
    width: 100%;
  }
}

.second-row {
  .ticker {
    position: relative;
    .fix {
      position: absolute;
      top: 4px;
      right: 4px;
    }
  }
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
