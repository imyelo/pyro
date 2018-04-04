<template>
  <div class="main">
    <Navigator :backable="!isSetup" />
    <div class="view">
      <div class="url">
        <input class="input" placeholder="Type the url contains the adapter source codes here." v-model.trim="url" v-on:change="isSaved = false" v-on:keyup.enter="fetch" autofocus />
        <button class="button" v-bind:disabled="isFetching || !url || !code" v-on:click="fetch">{{ !isFetching ? 'Fetch' : 'Fetching'}}</button>
      </div>
      <div class="code">
        <Prism class="prism" language="javascript">{{ code }}</Prism>
      </div>
      <button class="button" v-bind:disabled="!isSaved || !code" v-on:click="save">Save</button>
    </div>
  </div>
</template>

<script>
import { remote } from 'electron'
import { mapState } from 'vuex'
import Prism from 'vue-prism-component'
import axios from 'axios'

import Navigator from '../components/navigator.vue'

export default {
  data () {
    return {
      isSaved: false,
      isFetching: false,
      url: this.$store.state.adapter.url,
      code: this.$store.state.adapter.code,
    }
  },
  computed: {
    ...mapState([
      'adapter',
    ]),
    isSetup () {
      return 'setup' in this.$route.query
    },
  },
  mounted () {
    remote.getCurrentWindow().setSize(600, 600, true)
  },
  methods: {
    async fetch () {
      try {
        this.isFetching = true
        this.code = ''
        let { data } = await axios.get(this.url)
        this.code = data
        this.isSaved = true
      } catch (error) {
        alert(error)
      } finally {
        this.isFetching = false
      }
    },
    save () {
      this.$store.dispatch('setAdapter', {
        url: this.url,
        code: this.code,
      })
      if (this.isSetup) {
        return this.$router.push('/furnace')
      }
      this.$router.back()
    },
  },
  components: {
    Navigator,
    Prism,
  },
}
</script>

<style lang="less" scoped>
.view {
  color: #333;
  font-size: 12px;
  padding: 0 48px 48px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

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
    font-size: 12px;
    font-family: 'Ubuuntu Mono';
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

  .url {
    display: flex;
    margin-bottom: 12px;
    border-bottom: 1px solid #e6e6e6;
    .button {
      flex: 1;
      margin-left: 12px;
      font-size: 12px;
      box-shadow: 0 2px hsl(204, 100%, 20%);
      &:disabled {
        box-shadow: none;
      }
    }
  }

  .code {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin: 0 0 12px;
    border-bottom: 1px solid #e6e6e6;
    -webkit-app-region: no-drag;
    .prism {
      flex: 1;
      margin: 0 0 12px;
    }
  }
}
</style>
