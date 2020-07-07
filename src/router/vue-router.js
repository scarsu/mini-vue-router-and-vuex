import Vue from 'vue'
let _Vue;

/* 创建Router类 */
class Router{
  // - 事件处理函数职责：变更响应式属性current
  constructor(options){
    // - 转存options
    this.$options = options

    // - 通过Vue.util.defineReactive API定义一个响应式数据
    // Vue.util.defineReactive(this,'current','')
    this.current = window.location.hash.slice(1) || '/'
    
    // - 提前处理路由表，缓存path和route的映射map，避免每次都循环遍历
      // TODO:解决嵌套路由
    this._routeMap = {'':{}}
    this.walkRoutes(this.$options.routes)
    // console.log(this._routeMap)
    
    // - 添加hashChange事件和load事件监听
    window.addEventListener('hashchange',this.onHashChange.bind(this))
    window.addEventListener('load',this.onHashChange.bind(this))
  }
  onHashChange(){
    let path = window.location.hash.slice(1)
    if(path){
      this.current = this.getNameFromPath(path)
    }else{
      this.current = ''
    }
  }
  getNameFromPath(path){
    //路由匹配时获取代表深度层级的 matched数组
    return this.recursePath(this.$options.routes,'',path)
  }
  recursePath(routes,curPath,targetPath){
    let i=0
    while(i<routes.length){
      const route = routes[i]
      i++
      let temp = curPath
      curPath = curPath + route.path
      if(curPath === targetPath){
        return route.name
      }else if(targetPath.startsWith(curPath) && Array.isArray(route.children)){
        return this.recursePath(route.children,curPath,targetPath)
      }else{
        curPath = temp
        continue
      }
    }
    return ''
  }
  walkRoutes(routes){
    if(!Array.isArray(routes)){
      console.error('routes 应该是数组')
      return
    }
    let i=0
    while(i<routes.length){
      const route = routes[i]
      i++
      if(!route.name){
        console.error('route必须定义name属性')
        return
      }
      if(this._routeMap[route.name]){
        console.error('route name重复')
        continue
      }
      this._routeMap[route.name] = route
      if(Array.isArray(route.children)){
        this.walkRoutes(route.children)
      }
    }
  }
}

/* 实现插件install方法 */
Router.install = function(Vue){
  // 转存构造函数
  _Vue = Vue
  
  // 通过全局混入，将 传给Vue根实例的 router实例 挂载在Vue原型上
  Vue.mixin({
    beforeCreate () {
      // 生命周期钩子里 this是组件实例
      if(this.$options.router){
        // 
        Vue.prototype.$router = this.$options.router
      }
    }
  })

  // 注册全局组件 vue-link
  // link组件:<router-link to="/home">home</router-link>
  // link组件是一个超链接:<a href="#/xxx"/>
  // TODO: to:{name:'', path:'', query:{参数}}
  Vue.component('router-link',{
    props:{
      to:{
        type:String,
        require:true
      }
    },
    render(h){
      // 添加一个标记 用于判断一个组件是不是routerView组件
      this.$vnode.data.isRouterView = true

      // routerView的深度标记
      let depth = 0
      let parent = this.$parent
      while(parent){
        if(
          parent.$vnode && 
          parent.$vnode.data && 
          parent.$vnode.data.isRouterView){
            depth++
          }
        parent = parent.$parent
      }

      // render函数一定要有return!
      // render函数里的this是vue实例!
      // h(tag, attrs, children)
      return h('a',{
        attrs:{
          href:'#' + this.to
        }
      },this.$slots.default)
    }
  })

  // 注册全局组件 vue-view
  // view组件是一个容器
  Vue.component('router-view',{
    render(h){
      const current = this.$router.current
      const component = this.$router._routeMap[current].component || null
      return h(component)
    }
  })
}
  export default Router