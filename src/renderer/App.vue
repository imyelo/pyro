<template>
  <div class="app">
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="less">
.app {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #ff8a30;
  overflow: hidden;
  .main {
    display: flex;
    flex-direction: column;
    width: 600px;
    height: 100%;
    overflow: hidden;
    .view {
      flex: 1;
      width: 100%;
      height: 100%;
      // padding: 48px;
      box-sizing: border-box;
    }
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
