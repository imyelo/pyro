<template>
  <div class="app">
    <transition name="transition-view" mode="out-in">
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
  // background-image: linear-gradient(#f6f6f6, #ccc);
  background-color: #f6f6f6;
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

.transition-view-enter-active, .transition-view-leave-active {
  transition: all ease .4s;
  transform: translateX(0);
}
.transition-view-enter, .transition-view-leave-to {
  opacity: 0;
}
.transition-view-enter {
  transform: translateX(24px) scale(0.95);
}
.transition-view-leave-to {
  transform: translateX(-24px) scale(1.05);
}
</style>
