<template>
  <div class="main">
    <Navigator :backable="!isSetup" />
    <div class="view" v-bind:class="{ dragging: isDragging }"
      v-on:dragover.prevent.stop="isDragging = true" v-on:dragleave="isDragging = false"
      v-on:drop.prevent.stop="drop" v-on:click="select">
      <p><img src="../assets/floppy.png" draggable="false" /></p>
      <p>Drop the data file here.</p>
      <input type="file" v-on:change="_select" hidden ref="file" />
    </div>
  </div>
</template>

<script>
import { remote } from 'electron'
import Bluebird from 'bluebird'
import Navigator from '../components/navigator.vue'

const fs = Bluebird.promisifyAll(require('fs'))
const csv = Bluebird.promisifyAll(require('csv'))

export default {
  data () {
    return {
      isDragging: false,
    }
  },
  computed: {
    isSetup () {
      return 'setup' in this.$route.query
    },
  },
  mounted () {
    remote.getCurrentWindow().setSize(400, 400, true)
  },
  methods: {
    select () {
      this.$refs.file.click()
    },
    _select (event) {
      if (!event.currentTarget.files[0]) {
        return
      }
      this.loadFile(event.currentTarget.files[0].path)
    },
    drop (event) {
      this.isDragging = false
      if (!event.dataTransfer.files || !event.dataTransfer.files[0]) {
        return
      }
      this.loadFile(event.dataTransfer.files[0].path)
    },
    async loadFile (path) {
      let plain = await fs.readFileAsync(path, 'utf8')
      let devices = await csv.parseAsync(plain, {
        columns: true,
      })
      this.$store.dispatch('setDevices', devices)
      if (this.isSetup) {
        return this.$router.push('/ports?setup')
      }
      this.$router.back()
    },
  },
  components: {
    Navigator,
  },
}
</script>

<style lang="less" scoped>
.view {
  -webkit-app-region: no-drag;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  padding-bottom: 48px;
  p {
    margin: 12px 0;
    padding: 0;
    color: #413d51;
    font-size: 12px;
    font-weight: bold;
    img {
      width: 120px;
    }
  }
  &.dragging {
    background-color: rgba(255,255,255,0.5);
    p {
      opacity: 0.5;
    }
  }
}
</style>
