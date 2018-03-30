<template>
  <div class="view">
    <h2><span class="iconfont icon-left-circle back" v-on:click="back"></span> Select the output serial port:</h2>
    <div class="ports">
      <div v-for="port in ports" :key="port.comName" class="port">
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
</template>

<script>
const Bluebird = require('bluebird')
const fs = Bluebird.promisifyAll(require('fs'))
const csv = Bluebird.promisifyAll(require('csv'))

const SerialPort = require('serialport')

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
      ports: [],
    }
  },
  mounted () {
    this.search()
  },
  methods: {
    async search () {
      let ports = await SerialPort.list()
      this.$data.ports = ports
    },
    back () {
      this.$router.push('/import')
    },
  },
}
</script>

<style lang="less" scoped>
.view {
  color: #333;
  font-size: 12px;
  -webkit-app-region: no-drag;
  padding: 12px 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  h2 {
    font-size: 36px;
    line-height: 1em;
    padding: 0 0 48px;
    margin: 0 0 0;
    position: relative;
    .back {
      font-size: 1em;
      position: absolute;
      left: -1.5em;
      cursor: pointer;
      -webkit-app-region: no-drag;
    }
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

  }
}
</style>
