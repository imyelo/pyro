<template>
  <div class="main">
    <Navigator />
    <div class="view">
      <div class="console">
        <div class="logs" ref="logs">
          <transition-group name="transition-log" v-on:enter="scrollToLastLog">
            <pre v-for="(log, index) in logs" :key="index" v-bind:class="log.type">> {{ log.message }}</pre>
          </transition-group>
        </div>
        <button class="clear" v-on:click="clearLogs">Clear</button>
      </div>
      <div class="control">
        <form class="identity" v-on:submit.prevent="search">
          <input class="input" placeholder="Type the identity of device here." v-model.trim="identity" v-on:change="device = null" autofocus />
          <div v-if="identity" class="clear" v-on:click="identity = ''"><i class="iconfont icon-cross-circle"></i></div>
        </form>
        <button class="burn" v-bind:disabled="isAutoBurn || !device || !com" v-on:click="burn">BURN</button>
        <div class="footer">
          <div class="options">
            <button class="option" v-bind:class="isAutoBurn ? 'enabled' : 'disabled'" v-on:click="toggleAutoBurn">
              <span class="iconfont icon-dot"></span> Auto-Burn
            </button>
          </div>
          <div class="statuses">
            <button class="status" v-bind:class="!!com ? 'ok' : 'error'" v-on:click="toPorts">
              <span class="iconfont icon-dot"></span> Port
            </button>
            <button class="status" v-bind:class="devices.length > 0 ? 'ok' : 'error'" v-on:click="toImport">
              <span class="iconfont icon-dot"></span> Data
            </button>
            <button class="status" v-bind:class="adapter.code ? 'ok' : 'error'" v-on:click="toAdapter">
              <span class="iconfont icon-dot"></span> Adapter
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { remote } from 'electron'
import _ from 'lodash'
import { mapState } from 'vuex'
import { Port } from '../ports'
import vm from 'vm'

import Navigator from '../components/navigator.vue'

const PORT_OPTIONS = {
  baudRate: 115200,
}

function AdapterScript (adapter, method) {
  return function () {
    let sandbox = { exports: {}, args: arguments, returns: null }
    let script = new vm.runInNewContext(adapter + `;returns = exports.${method}.apply(this, args)`, sandbox)
    return sandbox.returns
  }
}

export default {
  data () {
    return {
      identity: '',
      device: null,
    }
  },
  computed: mapState([
    'com',
    'devices',
    'logs',
    'adapter',
    'isAutoBurn',
  ]),
  mounted () {
    this.scrollToLastLog()
    remote.getCurrentWindow().setSize(600, 600, true)
  },
  methods: {
    scrollToLastLog () {
      this.$refs.logs.scrollTop = this.$refs.logs.scrollHeight
    },
    toImport () {
      this.$router.push('/import?backable')
    },
    toPorts () {
      this.$router.push('/ports')
    },
    toAdapter () {
      this.$router.push('/adapter')
    },
    toggleAutoBurn () {
      this.$store.dispatch('setAutoBurn', !this.isAutoBurn)
    },
    clearLogs () {
      this.$store.dispatch('clearLogs')
    },
    reset () {
      this.identity = ''
      this.device = null
    },
    search () {
      if (!this.identity) {
        this.log('error', 'Identity must be not empty!')
        return
      }
      let device = AdapterScript(this.adapter.code, 'find')(this.devices, this.identity)
      if (!device) {
        this.log('error', `Device (identity: ${this.identity}) not found. Please check your identity and the data source.`)
        return
      }
      this.log('info', `Ready to burn device.\n${JSON.stringify(device, null, 2)}`)
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
        let data = AdapterScript(this.adapter.code, 'format')(this.device)

        let port = await Port(this.com, PORT_OPTIONS)

        this.log('venbose', `Writing data to hardware:\nData: ${data}\nCom: ${this.com}`)

        setTimeout(() => port.write(data), 0)

        this.log('success', `The data have been sent to hardware successfully!\nData: ${data}\nCom: ${this.com}`)

        this.reset()
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
  padding: 12px 48px 48px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  .console, .control {
    width: 100%;
  }

  .console {
    flex: 1;
    height: 200px;
    background-color: #333;
    padding: 12px 18px;
    font-size: 12px;
    box-sizing: border-box;
    position: relative;

    .logs {
      height: 100%;
      width: 100%;
      overflow-x: hidden;
      overflow-y: scroll;
      -webkit-app-region: no-drag;
      -webkit-user-select: text;
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

    .clear {
      position: absolute;
      top: 12px;
      right: 24px;
      font-size: 8px;
      padding: 2px 4px;
      background-color: #333333;
      border: 1px solid #fff;
      outline: none;
      color: #fff;
      cursor: pointer;
      transition: all 200ms ease;
      opacity: 0;
      &:hover {
        background-color: #fff;
        color: #333;
      }
    }

    &:hover {
      .clear {
        opacity: 1;
      }
    }
  }

  .input, .burn {
    display: block;
    width: 100%;
    margin: 24px 0;
    text-align: center;
    font-size: 24px;
    height: 3em;
    border: none;
    outline: none;
    -webkit-app-region: no-drag;
  }
  .identity {
    position: relative;
    .input {
      background-color: #333;
      box-shadow: 0 4px 0 4px #444 inset;
      color: #fff;
      padding: 0 3em 0;
      box-sizing: border-box;
      font-size: 16px;
      height: 72px;
    }
    .clear {
      position: absolute;
      top: 0;
      right: 0;
      margin: 0.5em;
      padding: 0.5em;
      color: rgba(255,255,255,0.25);
      line-height: 1em;
      font-size: 24px;
      transition: all 200ms ease;
      -webkit-app-region: no-drag;
      cursor: pointer;

      .iconfont {
        font-size: 24px;
      }

      &:hover {
        color: #fff;
      }
    }
  }
  .burn {
    margin: 24px 0 36px;
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
    border-top: 1px solid #e6e6e6;
    .options, .statuses {
      width: 50%;
      display: flex;
    }
    .option, .status {
      display: block;
      color: #333;
      outline: none;
      border: none;
      font-size: 10px;
      padding: 1em;
      background-color: transparent;
      transition: all 200ms ease;
      cursor: pointer;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 50%;
      overflow: hidden;
      flex: 1;

      .icon-dot {
        font-size: 10px;
        padding-right: 0.5em;
        text-shadow: 0 0 6px;
      }

      &:hover {
        background-color: rgba(221,221,221,0.75);
      }
      &.ok {
        color: hsla(100, 100%, 20%, 1);
      }
      &.error {
        color: hsla(0, 100%, 40%, 1);
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

  .transition-log-enter-active {
    transition: all ease .2s;
    transform: translateX(0);
  }
  .transition-log-enter {
    opacity: 0;
    transform: translateX(12px);
  }
}
</style>
