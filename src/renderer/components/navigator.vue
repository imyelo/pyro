<template>
  <div class="header">
    <button v-show="backable" class="back" v-on:click="back"><span class="iconfont icon-left-circle"></span></button>
    <button class="close" v-on:click="close"><span class="iconfont icon-cross-circle"></span></button>
  </div>
</template>

<script>
import { remote } from 'electron'

export default {
  props: ['backable'],
  methods: {
    back () {
      this.$router.back()
    },
    close () {
      remote.getCurrentWindow().close()
    },
  },
}
</script>

<style lang="less" scoped>
.header {
  width: 100%;
  height: 48px;
  line-height: 48px;
  button {
    display: inline-block;
    width: 48px;
    height: 48px;
    font-size: 24px;
    border: none;
    outline: none;
    color: hsl(30, 50%, 30%);
    background-color: transparent;
    cursor: pointer;
    transition: all 200ms ease;
    .iconfont {
      font-size: 1em;
    }
    &:hover {
      color: #333;
      background-color: rgba(255,255,255,0.5);
    }
    &.back {
      border-bottom-right-radius: 4px;
    }
    &.close {
      border-bottom-left-radius: 4px;
      float: right;
    }
  }
}


</style>
