<template>
  <div>
    <ul class='list_res'>
      <li v-for="(item, idx) in searchResult" :key="idx" @click="$emit('setTicker', item)">
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
}
</script>

<style lang="scss" scoped>
.list_res{
  background-color: #fff;
  position: absolute;
  top: 39px;
  left: 0;
  overflow-y: scroll;
  height: 350px;
  width: 100%;
}
</style>
