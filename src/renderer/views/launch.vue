<template>
  <div class="main">
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: mapState([
    'devices',
  ]),
  mounted () {
    if (this.devices.length > 0) {
      return this.$router.replace('/furnace')
    }
    this.$router.replace('/import')
  },
}
</script>
