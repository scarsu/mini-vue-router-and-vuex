import Vue from 'vue'
import Store from './store'

Vue.use(Store)

export default new Store({
  state:{
    count:0
  },
  mutations: {
    addCount(state){
      state.count++
    }
  },
  actions: {
    addCountAsync(state){
      setTimeout(()=>{
        state.count++
      },1000)
    }
  },
  getters: {
    doubleCount(state){
      debugger
      return state.count*2
    }
  }
})