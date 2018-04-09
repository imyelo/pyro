<template>
  <div class="main">
    <Navigator :backable="true" />
    <div class="view">
      <h2>Preferences</h2>
      <div class="fields">
        <div class="field">
          <input placeholder="baudrate" />
          <button>Save and Relaunch</button>
        </div>
        <div class="field">
          <button class="clear">Clear cache</button>
        </div>
      </div>
      <div class="about"><img src="../assets/logo.png" /></div>
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
    }
  },
  computed: {
    ...mapState([
    ]),
    isSetup () {
      return 'setup' in this.$route.query
    },
  },
  methods: {
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
  },
}
</script>

bottom<style lang="less" scoped>
.view {
  color: #333;
  font-size: 12px;
  padding: 0 48px 48px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  h2 {
    text-align: center;
    margin: 24px 0;
    font-size: 24px;
    color: #333;
  }
  .fields {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .field {
      border: 1px solid #e6e6e6;
      margin: 0 0 24px;
      padding: 24px;
      background-color: #fff;
      display: flex;
      justify-content: space-between;
      input, button {
        width: 100%;
        padding: 12px 12px;
        font-size: 12px;
        outline: none;
        -webkit-app-region: no-drag;
        transition: all 200ms ease;
      }
      input {
        background-color: #fff;
        border: 1px solid #eee;
      }
      button {
        background-color: #f6f6f6;
        border: none;
        cursor: pointer;
        &:hover {
          background-color: #fcfcfc;
          box-shadow: 0 2px 0 1px hsl(0,0%,67%);
        }
        &:active {
          background-color: #f3f3f3;
          box-shadow: 0 2px 0 1px hsl(0,0%,67%) inset;
        }
      }
    }
  }
  .about {
    text-align: right;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    img {
      width: 150px;
    }
  }
}
</style>
