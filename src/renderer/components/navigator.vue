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
  -webkit-app-region: no-drag;
  cursor: pointer;
  button {
    opacity: 0;
    display: inline-block;
    width: 48px;
    height: 48px;
    font-size: 24px;
    border: none;
    outline: none;
    color: #999;
    background-color: transparent;
    cursor: pointer;
    transition: all 200ms ease;
    .iconfont {
      font-size: 1em;
    }
    &:hover {
      color: #333;
    }
    &.back {
      border-bottom-right-radius: 4px;
    }
    &.close {
      border-bottom-left-radius: 4px;
      float: right;
    }
  }
  &:hover {
    button {
      opacity: 1;
    }
  }
}


</style>
