<template>
  <div class="main">
    <Navigator :backable="!isSetup" />
    <div class="view">
      <h2>Type the baud rate:</h2>
      <input class="input" placeholder="Baud rate." type="tel" v-model.trim="baudRate" autofocus />
      <button class="button" v-bind:disabled="!baudRate" v-on:click="save">Save</button>
    </div>
  </div>
</template>

<script>
import { remote } from 'electron'
import { mapState } from 'vuex'

import Navigator from '../components/navigator.vue'

export default {
  data () {
    return {
      baudRate: this.$store.state.baudRate,
    }
  },
  computed: {
    isSetup () {
      return 'setup' in this.$route.query
    },
  },
  mounted () {
    remote.getCurrentWindow().setSize(600, 600, true)
  },
  methods: {
    save () {
      this.$store.dispatch('setBaudRate', +this.baudRate)
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
  padding: 24px 60px 72px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;

  h2 {
    font-size: 24px;
    line-height: 1em;
    padding: 0 0 48px;
    margin: 0 0 0;
    position: relative;
  }

  .input, .button {
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
  }
  .input {
    background-color: #333;
    box-shadow: 0 2px 0 2px #444 inset;
    color: #ccc;
    margin-bottom: 12px;
    font-size: 24px;
    font-family: 'Ubuntu Mono';
  }
  .button {
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
}
</style>
