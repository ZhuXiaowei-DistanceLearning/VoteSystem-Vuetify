import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);
// const Msite = () => import("../page/MSite/MSite.vue") 导入页面路径
// import Shop from '../pages/Shop/Shop.vue' 导入组件
function route(path, file, name, children) {
  return {
    exact: true,
    path,
    name,
    children,
    component: () => { // 导入页面
      return import('../pages' + file)
    }
  }
}
export default new VueRouter({
  routes: [
    route("/", "/Login", "Login"),
    {
      path:"/Layout",
      component:()=>import("../pages/Layout"),
      redirect:'/index/dashboard',
      children:[
        route("/index/dashboard","/Dashboard","Dashboard"),
        route("/vote/maintainVote","/vote/MaintainVote","MaintainVote"),
        route("/vote/pubVote","/vote/PubVote","PubVote"),
        route("/vote/findAll","/vote/Vote","Vote"),
        route("/vote/vote","/vote/Voting","Voting"),
        route("/role/mainRole","/role/mainRole","mainRole"),
        route("/role/maintainRole","/role/MaintainRole","MaintainRole"),
      ]
    }
  ]
})
