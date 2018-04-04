<template>
  <div class="main">
    <Navigator :backable="true" />
    <div class="view">
      <h2>Select the output serial port:</h2>
      <div class="ports">
        <div v-for="port in ports" :key="port.comName" class="port" v-bind:class="{ selected: com === port.comName }" v-on:click="select(port)">
          <h3>{{ port.comName || '-'  }}</h3>
          <p>Location ID: {{ port.locationId || '-' }}</p>
          <p>Manufacturer: {{ port.manufacturer || '-'  }}</p>
          <p>PnP ID: {{ port.pnpId || '-'  }}</p>
          <p>Product ID: {{ port.productId || '-'  }}</p>
          <p>Serial Number: {{ port.serialNumber || '-'  }}</p>
          <p>Vendor Id: {{ port.vendorId || '-'  }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { remote } from 'electron'
import SerialPort from 'serialport'
import { mapState } from 'vuex'

import Navigator from '../components/navigator.vue'

export default {
  data () {
    return {
      ports: [],
    }
  },
  computed: {
    ...mapState([
      'com',
    ]),
    isSetup () {
      return 'setup' in this.$route.query
    },
  },
  mounted () {
    this.scan()
    remote.getCurrentWindow().setSize(600, 600, true)
  },
  methods: {
    async scan () {
      let ports = await SerialPort.list()
      this.ports = ports
    },
    select (port) {
      this.$store.dispatch('setCom', port.comName)
      if (this.isSetup) {
        return this.$router.push('/adapter?setup')
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
  color: #333;
  font-size: 12px;
  -webkit-app-region: no-drag;
  padding: 24px 60px 72px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  h2 {
    font-size: 24px;
    line-height: 1em;
    padding: 0 0 48px;
    margin: 0 0 0;
    position: relative;
  }

  .ports {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    padding-right: 24px;
    box-sizing: border-box;

    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
    &::-webkit-scrollbar {
      width: 0;
      background-color: transparent;
    }
    &:hover::-webkit-scrollbar {
      width: 2px;
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #413d51;
    }
  }
  .port {
    display: block;
    min-height: 176px;
    background-color: #656168;
    margin: 0 12px 48px 8px;
    padding: 24px;
    box-sizing: border-box;
    width: 100%;
    word-break: break-all;
    word-wrap: break-word;
    border: 2px solid #413d51;
    box-shadow: 0 4px #413d51;
    transition: all 200ms ease;
    position: relative;
    color: #c8c8c8;
    cursor: pointer;
    font-family: 'VT323';
    font-size: 14px;

    &:before, &:after {
      content: '';
      position: absolute;
      display: block;
      background-color: #413d51;
    }
    &:before {
      height: 84px;
      width: 8px;
      left: -8px;
      top: 24px;
    }
    &:after {
      height: 32px;
      width: 6px;
      left: -6px;
      top: 120px;
    }

    h3, p {
      margin: 0;
      padding: 0;
    }
    h3 {
      font-weight: bold;
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 2px solid #413d51;
    }

    &:hover, &.selected {
      background-color: #0099ff;
      color: #fff;
      h3 {
        border-bottom: 2px solid transparent;
      }
    }
    &:hover {
      box-shadow: 0 8px 0 2px #413d51;
    }

  }
}
</style>
