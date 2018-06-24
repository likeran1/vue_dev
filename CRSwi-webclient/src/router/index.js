import Vue from 'vue'
import Router from 'vue-router'

import Login from '../components/login.vue'
import Index from '../components/index.vue'
import Home from '../components/home.vue'

import Workorder from '../components/blog/workorder.vue'

import DeviceBind from '../components/blog/devicebind.vue'
import DeviceUNBind from '../components/blog/deviceunbind.vue'
import DataCompare from '../components/blog/datacompare.vue'
import DeviceLog from '../components/blog/devicelog.vue'
import DeviceUpdate from '../components/blog/deviceupdate.vue'

import User from '../components/blog/user.vue'
import Orgmanag from '../components/blog/orgmanag.vue'
import Devicetype from '../components/blog/devicetype.vue'
import Device from '../components/blog/device.vue'
import Shieldmgr from '../components/blog/shieldmgr.vue'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  linkActiveClass: 'active',
  routes: [{
    path: '/',
    redirect: 'login'
  }, {
    path: '/login',
    component: Login,
    name: 'login',
  }, {
    path: '/index',
    component: Index,
    children: [{
      path: '/',
      name: 'index',
      redirect: '/home',
    },{
      path: '/home',
      component: Home,
      name: 'home'
    },{
      path: '/index/workorder',
      component: Workorder,
      name: 'workorder'
    },{
       path: '/index/devicebind',
       component: DeviceBind,
       name: 'devicebind'
     }, {
       path: '/index/deviceunbind',
       component: DeviceUNBind,
       name: 'deviceunbind'
     }, {
       path: '/index/datacompare',
       component: DataCompare,
       name: 'datacompare'
     },{
       path: '/index/devicelog',
       component: DeviceLog,
       name: 'devicelog'
     }, {
       path: '/index/deviceupdate',
       component: DeviceUpdate,
       name: 'deviceupdate'
     }, {
      path: '/index/user',
      component: User,
      name: 'user'
    }, {
      path: '/index/devicetype',
      component: Devicetype,
      name: 'devicetype'
    }, {
      path: '/index/device',
      component: Device,
      name: 'device'
    }, {
      path: '/index/orgmanag',
      component: Orgmanag,
      name: 'orgmanag'
    }, {
       path: '/index/shieldmgr',
       component: Shieldmgr,
       name: 'shieldmgr'
     }
    ]
  }]
})
