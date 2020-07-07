import Vue from 'vue'

let _Vue

// 创建一个Store类
class Store{
  constructor(options){
    this.$options = options
    console.log(options)
    
    // - 实现getters，利用computed计算属性，要求有缓存
    let gettersForComputed = {}
    for(let key in options.getters){
      let fn = options.getters[key]
      gettersForComputed[key] = ()=>{
        fn.call(this,this._vm._data.$$state)
      }
      Object.defineProperty(this,key,{
        get(){
          return this._vm[key]
        }
      })
    }
    
    // - 通过Vue将state转为响应式数据，并使用$$隐藏起来
    this._vm = new Vue({
      data:{
        $$state:options.state // Vue中双$开头的data的属性，不会被代理至vue实例上，会被隐藏起来
      },
      computed:gettersForComputed
    })
  }
  // - 设置state的getter和setter，不直接暴露state
  get state(){
    return this._vm._data.$$state
  }
  set state(val){
    // 使用setter防止直接访问state修改
    console.error('不允许直接修改state:'+val);
  }
  // - 实现commit方法，用于执行mutation
  commit(name,payload){
    this.$options.mutations[name].call(this,this._vm._data.$$state,payload)
  }
  // - 实现dispatch方法,用于执行action，传递上下文
  dispatch(name,payload){
    this.$options.actions[name].call(this,this._vm._data.$$state,payload)
  }
}



// // 实现插件的install方法
// - mixin生命周期，以便于拿到Vue根实例创建时传入的store选项
Store.install=function(Vue){
  _Vue = Vue
  Vue.mixin({
    beforeCreate(){
      if(this.$options.store){
        Vue.prototype.$store = this.$options.store
      }
    }
  })
}

export default Store