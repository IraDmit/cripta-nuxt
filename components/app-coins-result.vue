<template>
  <div>
    <ul class="list_res" :class="{ scroll: scroll }">
      <li
        v-for="(item, idx) in searchResult"
        :key="idx"
        class="coin"
        @click="$emit('setTicker', item)"
      >
        {{ item.FullName }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    searchResult: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    scroll() {
      return this.searchResult.length > 10
    }
  },
}
</script>

<style lang="scss" scoped>
.list_res {
  background-color: #fff;
  position: absolute;
  top: 39px;
  left: 0;
  width: 100%;
  list-style-type: none;
  padding-left: 0;
  border-radius: 0 0 10px 10px;
  border: 1px solid #ccc;
  border-top: 0px;
  height: fit-content;
  z-index: 10;
  &.scroll {
    overflow-y: scroll;
    height: 350px;
  }
  .coin {
    cursor: pointer;
    font-size: 16px;
    padding: 5px;
    &:not(:first-of-type) {
      border-top: 1px solid #ccc;
    }
  }
}

::-webkit-scrollbar {
  width: 0.35rem;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(27, 27, 27, 0.4);
  border-radius: 3px;
}
::-webkit-scrollbar-track {
  background: transparent;
}

/* Navbar */
#navbar {
  width: 100vw;
}

#scroll {
  opacity: 0.7;
}
</style>
