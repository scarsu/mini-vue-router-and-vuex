<template>
  <div id="app">
    <div>
      <img src="./assets/logo.png">
    </div>
    <!-- <router-link to="/">Home</router-link> |
    <router-link to="/home/about">About</router-link> |
    <router-link to="/home/hello">HelloWorld</router-link> -->
    <router-view/>
  </div>
</template>

<script>
import Home from './components/Home'

export default {
  name: 'App',
  // components:[Home]
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
