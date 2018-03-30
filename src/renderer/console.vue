<template>
  <div class="console">
    {{ logs }}
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: mapState({
    logs: ({ logs }) => logs.join('\n'),
  }),
}
</script>

<style lang="less">
.console {
  width: 400px;
  height: 800px;
  background-color: #333333;
  color: #ccc;
}
</style>
