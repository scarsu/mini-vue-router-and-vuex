import Vue from 'vue'
import Router from './vue-router'
import HelloWorld from '../components/HelloWorld.vue'
import Home from '../components/Home.vue'
import About from '../components/About.vue'

// 安装插件
Vue.use(Router)

// 实例化一个Router 暴露出去
export default new Router({
  routes:[
    {
      path: '/', 
      component:Home,
      name:'home',
      children:[
        {
          path: 'about', 
          name: 'about', 
          component:About 
        },
        {
          path: 'hello', 
          name: 'hello', 
          component:HelloWorld 
        }
      ]
    }
  ]
})