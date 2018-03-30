<template>
  <div class="app">
    <div class="main">
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </div>
    <Console />
  </div>
</template>

<script>
import Console from './console.vue'
export default {
  components: {
    Console,
  },
}
</script>

<style lang="less">
.app {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  .main {
    width: 600px;
    height: 600px;
    padding: 48px;
    box-sizing: border-box;
    background-color: #ff8a30;
    overflow: hidden;
    .view {
      width: 100%;
      height: 100%;
    }
  }
  .console {
    display: none;
    width: 300px;
    height: 600px;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: all ease .4s;
  transform: translateX(0);
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.fade-enter {
  transform: translateX(24px) scale(0.95);
}
.fade-leave-to {
  transform: translateX(-24px) scale(1.05);
}
</style>
