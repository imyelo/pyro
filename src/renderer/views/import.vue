<template>
  <div class="view" v-bind:class="{ dragging: isDragging }"
    v-on:dragover.prevent.stop="isDragging = true" v-on:dragleave="isDragging = false"
    v-on:drop.prevent.stop="drop" v-on:click="select">
    <p><img src="../assets/floppy.png" draggable="false" /></p>
    <p>Drop the data file here.</p>
    <input type="file" v-on:change="_select" hidden ref="file" />
  </div>
</template>

<script>
const Bluebird = require('bluebird')
const fs = Bluebird.promisifyAll(require('fs'))
const csv = Bluebird.promisifyAll(require('csv'))

export default {
  data () {
    return {
      isDragging: false,
    }
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
      console.log(devices)
      console.log(JSON.stringify(devices))
      this.$router.push('/ports')
    },
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
  &.dragging {
    background-color: hsla(26, 100%, 69%, 1);
  }
  p {
    margin: 12px 0;
    padding: 0;
    color: #413d51;
    font-size: 12px;
    img {
      width: 120px;
    }
  }
  .button {
    display: block;
    margin: 0 auto;
    padding: 24px 48px;
    border: none;
    background-color: #333;
    color: #fff;
    border-radius: 0;
    font-size: 18px;
    text-transform: uppercase;
    transition: all 400ms ease;
    cursor: pointer;
    outline: none;
    box-shadow: none;
    &:hover {
      box-shadow: 0 4px 0 #fff;
      background: #ab3f00;
    }
  }
}
</style>
