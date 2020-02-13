<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
  window.addEventListener('DOMContentLoaded', () => {
    const html = document.querySelector('html')
    let rootFontSize = window.innerWidth / 10
    rootFontSize = rootFontSize > 50 ? 50 : rootFontSize
    html.style.fontSize = rootFontSize + 'px'
  })
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    /*margin-top: 60px;*/
  }
</style>
