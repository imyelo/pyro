<template>
  <div class="main">
    <Navigator />
    <div class="view">
      <div class="console" npm v-chat-scroll>
        <pre v-for="log in logs" :key="log.index" v-bind:class="log.type">> {{ log.message }}</pre>
      </div>
      <div class="control">
        <input class="input" placeholder="Type the serial of device here." v-model.trim="serial" v-on:change="device = null" v-on:keyup.enter="search" autofocus />
        <button class="burn" v-bind:disabled="isAutoBurn || !device || !com" v-on:click="burn">BURN</button>
        <div class="footer">
          <div class="options">
            <button class="option" v-bind:class="isAutoBurn ? 'enabled' : 'disabled'" v-on:click="toggleAutoBurn">
              <span class="iconfont icon-dot"></span> Auto-Burn
            </button>
          </div>
          <div class="statuses">
            <button class="status" v-bind:class="!!com ? 'ok' : 'error'" v-on:click="toPorts">
              <span class="iconfont icon-dot"></span> Port: {{ com }}
            </button>
            <button class="status" v-bind:class="devices.length > 0 ? 'ok' : 'error'" v-on:click="toImport">
              <span class="iconfont icon-dot"></span> Data: {{ devices.length }} items
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState } from 'vuex'
import SerialPort from 'serialport'

import Navigator from '../components/navigator.vue'

function Port (com) {
  return new Promise((resolve, reject) => {
    let port = new SerialPort(com, (error) => {
      if (error) {
        return reject(error)
      }
      resolve(port)
    })
  })
}

export default {
  data () {
    return {
      serial: '',
      device: null,
    }
  },
  computed: mapState([
    'com',
    'devices',
    'logs',
    'isAutoBurn',
  ]),
  methods: {
    toImport () {
      this.$router.push('/import?backable')
    },
    toPorts () {
      this.$router.push('/ports')
    },
    toggleAutoBurn () {
      this.$store.dispatch('setAutoBurn', !this.isAutoBurn)
    },
    search () {
      if (!this.serial) {
        this.log('error', 'Serial must be not empty!')
        return
      }
      let device = _.find(this.devices, { serial: this.serial })
      if (!device) {
        this.log('error', `Device (serial: ${this.serial}) not found. Please check your serial and the data source.`)
        return
      }
      this.log('info', `Ready to burn device.\nSerial: ${device.serial}\nToken: ${device.token}\nStep: ${device.step}.`)
      this.device = device
      if (this.isAutoBurn) {
        this.burn()
      }
    },
    log (type, message) {
      this.$store.dispatch('log', { type, message })
    },
    async burn () {
      try {
        if (!this.device || !this.com) {
          return
        }
        let data = `${this.device.serial},${this.device.token},${this.device.step}`

        let port = await Port(this.com)

        port.on('data', (data) => {
          this.log('info', `Received a message from hardware: ${data.toString()}`)
        })
        port.on('end', () => {
          this.log('info', `Received a serial-port-end event.`)
        })

        this.log('venbose', `Writing data to hardware:\nData: ${data}\nCom: ${this.com}`)

        port.write(data)
        port.end()

        this.log('success', `The data have been burned into hardware successfully!\nData: ${data}\nCom: ${this.com}`)

        this.serial = ''
        this.device = null
      } catch (error) {
        this.log('error', error.message)
      }
    },
  },
  components: {
    Navigator,
  },
}
</script>

<style lang="less" scoped>
.view {
  color: #333;
  font-size: 12px;
  padding: 24px 48px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  .console, .control {
    width: 100%;
  }

  .console {
    height: 200px;
    background-color: #333;
    padding: 10px;
    font-size: 10px;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: scroll;
    -webkit-app-region: no-drag;

    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
    &::-webkit-scrollbar {
      width: 2px;
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #ccc;
    }

    pre {
      margin: 0;
      padding: 0;
      line-height: 2em;
      white-space: pre-wrap;
      word-wrap: break-word;
      overflow: hidden;
      color: #999;
      &.verbose {
        color: #999;
      }
      &.info {
        color: hsl(240, 100%, 80%);
      }
      &.error {
        color: hsl(0, 100%, 80%);
      }
      &.success {
        color: hsl(100, 100%, 80%);
      }
    }
  }

  .input {
    display: block;
    width: 100%;
    margin: 24px 0;
    text-align: center;
    font-size: 24px;
    height: 3em;
    border: none;
    outline: none;
    background-color: #333;
    box-shadow: 0 4px #000;
    color: #fff;
    -webkit-app-region: no-drag;
  }
  .burn {
    display: block;
    width: 100%;
    margin: 24px 0 36px;
    font-size: 24px;
    height: 3em;
    border: none;
    outline: none;
    background-color: hsl(0, 100%, 40%);
    box-shadow: 0 8px #600;
    color: #fff;
    cursor: pointer;
    transition: all 200ms ease;
    &:hover {
      background-color: hsl(0, 100%, 60%);
    }
    &:active {
      background-color: hsl(0, 100%, 30%);
    }
    &:disabled {
      background-color: rgba(0,0,0,0.25);
      color: rgba(255,255,255,0.5);
      box-shadow: none;
    }
  }

  .footer {
    display: flex;
    justify-content: space-between;
    padding-top: 24px;
    border-top: 1px solid rgba(0,0,0,0.25);
    .option, .status {
      display: inline-block;
      color: #333;
      outline: none;
      border: none;
      font-size: 10px;
      padding: 1em 2em;
      background-color: transparent;
      transition: all 200ms ease;
      cursor: pointer;

      .icon-dot {
        font-size: 10px;
        padding-right: 0.5em;
      }

      &:hover {
        background-color: rgba(255,255,255,0.75);
      }
      &.ok {
        color: hsla(100, 100%, 20%, 1);
      }
      &.error {
        color: hsla(0, 100%, 40%, 1);
        border-bottom: 1px solid hsla(0, 100%, 40%, 1);
      }
      &.disabled {
        color: rgba(0,0,0,0.25);
      }
      &.enabled {
        background-color: hsla(100, 100%, 20%, 1);
        color: #fff;
      }
    }
  }
}
</style>