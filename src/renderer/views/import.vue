<template>
  <div class="main">
    <Navigator :backable="!isSetup" />
    <transition name="transition-fade" mode="out-in">
      <div v-if="!devices.length" key="import" class="view view-import" v-bind:class="{ dragging: isDragging }"
        v-on:dragover.prevent.stop="isDragging = true" v-on:dragleave="isDragging = false"
        v-on:drop.prevent.stop="drop" v-on:click="select">
        <p><img src="../assets/floppy.png" draggable="false" /></p>
        <p>Drop the data file here.</p>
        <input type="file" v-on:change="_select" hidden ref="file" />
      </div>
      <div v-else key="preview" class="view view-preview" v-bind:class="{ dragging: isDragging }"
        v-on:dragover.prevent.stop="isDragging = true" v-on:dragleave="isDragging = false"
        v-on:drop.prevent.stop="drop">
        <div class="sheet">
          <table>
            <thead>
              <tr>
                <th v-for="key in keys" :key="key">
                  {{ key }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(device, index) in devices.slice(0, visibleTotal)" :key="index">
                <td v-for="key in keys" :key="key">
                  {{ device[key] }}
                </td>
              </tr>
              <tr v-if="devices.length > visibleTotal" class="more" v-on:click="more">
                <td>
                  {{ visibleTotal }} / {{ devices.length }} visible now. Click here to load more.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="actions">
          <button class="button reset" v-on:click="reset">Reset</button>
          <button class="button" v-on:click="save">Save</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { remote } from 'electron'
import Bluebird from 'bluebird'
import Navigator from '../components/navigator.vue'

const fs = Bluebird.promisifyAll(require('fs'))
const csv = Bluebird.promisifyAll(require('csv'))

const DEFAULT_VISIBLE_TOTAL = 10
const VISIBLE_STEP = DEFAULT_VISIBLE_TOTAL

export default {
  data () {
    return {
      isDragging: false,
      devices: this.$store.state.devices,
      visibleTotal: DEFAULT_VISIBLE_TOTAL,
    }
  },
  computed: {
    isSetup () {
      return 'setup' in this.$route.query
    },
    keys () {
      if (!this.devices[0]) {
        return []
      }
      return Object.keys(this.devices[0])
    },
  },
  mounted () {
    remote.getCurrentWindow().setSize(600, 600, true)
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
      this.devices = devices
    },
    reset () {
      this.devices = []
      this.visibleTotal = DEFAULT_VISIBLE_TOTAL
    },
    more () {
      this.visibleTotal += VISIBLE_STEP
    },
    save () {
      this.$store.dispatch('setDevices', this.devices)
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
.view.view-import {
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

.view.view-preview {
  color: #333;
  font-size: 12px;
  padding: 0 48px 48px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  &.dragging {
    opacity: 0.5;
  }

  .button {
    display: block;
    width: 100%;
    margin: 0;
    padding: 0 1em;
    box-sizing: border-box;
    text-align: center;
    font-size: 24px;
    height: 3em;
    border: none;
    outline: none;
    -webkit-app-region: no-drag;
    background-color: hsl(204, 100%, 50%);
    box-shadow: 0 8px hsl(204, 100%, 20%);
    color: #fff;
    cursor: pointer;
    transition: all 200ms ease;
    &:hover {
      background-color: hsl(204, 100%, 70%);
    }
    &:active {
      background-color: hsl(204, 100%, 40%);
    }
    &:disabled {
      background-color: rgba(0,0,0,0.25);
      color: rgba(255,255,255,0.5);
      box-shadow: none;
    }
  }
  .actions {
    display: flex;
    .reset {
      margin-right: 24px;
      background-color: hsl(0, 0%, 60%);
      box-shadow: 0 8px hsl(0, 0%, 30%);
      &:hover {
        background-color: hsl(0, 0%, 80%);
      }
      &:active {
        background-color: hsl(0, 0%, 50%);
      }
    }
  }

  .sheet {
    flex: 1;
    margin-bottom: 24px;
    overflow: hidden;
    table {
      height: 100%;
      width: 100%;
      font-family: "Ubuntu Mono";
      line-height: 2em;
      margin-bottom: 24px;
      border-collapse: collapse;
      display: flex;
      flex-flow: column;
      border: 2px solid #ddd;
      border-right: none;
      box-sizing: border-box;
      th, td {
        padding: 1.5em 2em;
        line-height: 1em;
        text-align: left;
        word-wrap: break-word;
        word-break: break-all;
      }
      thead {
        flex: 0 0 auto;
        width: 100%;
        display: table;
        table-layout: fixed;
        tr {
          background-color: #ddd;
        }
      }
      tbody {
        flex: 1 1 auto;
        display: block;
        overflow-y: scroll;
        background-color: #ddd;
        -webkit-app-region: no-drag;
        tr {
          width: 100%;
          display: table;
          table-layout: fixed;
          background-color: #eee;
          transition: all 200ms ease;
          -webkit-user-select: text;
          &:nth-child(2n) {
            background-color: #e6e6e6;
          }
          &:hover {
            background-color: #f6f6f6;
          }
          &.more {
            cursor: pointer;
            background-color: #ddd;
            td {
              color: #666;
              text-align: center;
              transition: all 200ms ease;
              &:hover {
                color: #333;
                text-decoration: underline;
              }
            }
          }
        }

        &::-webkit-scrollbar-track {
          background-color: transparent;
        }
        &::-webkit-scrollbar {
          width: 2px;
          background-color: #ddd;
        }
        &::-webkit-scrollbar-thumb {
          background-color: #666;
        }
      }
    }
  }
}

.transition-fade-enter-active, .transition-fade-leave-active {
  transition: all ease .4s;
}
.transition-fade-enter, .transition-fade-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
