import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

import {isLoggedIn} from '@/auth';

Vue.use(VueRouter)

  const routes = [
  {
    path:'/login',
    name:'Login',
    component:()=>import('@/views/Login.vue'),
    meta:{
      notLoggedIn:true
    }
  },
  {
    path:'/signup',
    name:'Register',
    component:()=>import('@/views/Register.vue'),
    meta:{
      notLoggedIn:true
    }
  },
  {
    path: '/user/:id',
    name: 'User Info',
    component: () => import('@/views/PrivateKey.vue'),
    meta:{
      requiresAuth:true
    }
  },
  {
    path: '/forgot-password',
    name: 'Password Recovery',
    component: () => import('@/views/ForgotPassword.vue'),
    meta:{
      notLoggedIn:true
    }
  },
  {
    path:'/check-key',
    name:'Check Key',
    component:()=> import('@/views/CheckPrivateKey.vue'),
    requiresAuth:true
  },
  {
    path: '/',
    name: 'Index',
    meta:{
      requiresAuth:true
    },
    component: ()=>import('@/views/Index.vue'),
    children:[
      {
        name:'Home',
        component:Home,
        path:''
      },
      {
        path: '/deposit',
        name: 'Deposit',
      
        component: () => import('@/views/deposit.vue')
      },
      {
        path: '/withdraw',
        name: 'Withdraw',
      
        component: () => import('@/views/Withdraw.vue')
      },
      {
        path: '/send',
        name: 'Send',
      
        component: () => import('@/views/Send.vue')
      },
      {
        path: '/history',
        name: 'History',
      
        component: () => import('@/views/History.vue')
      },
      {
        path: '/exchange',
        name: 'Exchange',
      
        component: () => import('@/views/Exchange.vue')
      },
      {
        path: '/locations/agents',
        name: 'Agents Locations',
      
        component: () => import('@/views/AgentLocations.vue')
      },
      {
        path: '/locations/merchants',
        name: 'Merchants Locations',
      
        component: () => import('@/views/MerchantsLocations.vue')
      },
      {
        path: '/evoucher',
        name: 'E-Voucher',
      
        component: () => import('@/views/Evoucher.vue')
      },
      {
        path: '/withdraw/evoucher',
        name: 'Withdraw E-Voucher',
      
        component: () => import('@/views/WithdrawEvoucher.vue')
      },
      {
        path: '/deposit/evoucher',
        name: 'Deposit E-Voucher',
      
        component: () => import('@/views/DepositEvoucher.vue')
      },
      {
        path: '/deposit/paypal',
        name: 'Deposit Paypal',
      
        component: () => import('@/views/DepositPaypal.vue')
      },
      {
        path: '/deposit/credit',
        name: 'Deposit Credit Card',
      
        component: () => import('@/views/DepositCredit.vue')
      },
      {
        path: '/deposit/bitcoin',
        name: 'Deposit Bitcoin',
      
        component: () => import('@/views/DepositBitcoin.vue')
      },
      {
        path: '/deposit/eth',
        name: 'Deposit Ethereum',
      
        component: () => import('@/views/DepositEthereum.vue')
      },
      {
        path: '/edit-account',
        name: 'Edit Account',
      
        component: () => import('@/views/EditAccount.vue')
      },
      {
        path:'/request',
        name:'Request Money',
        component:()=> import('@/views/RequestMoney.vue')
      },
      {
        path:'/requests',
        name:'Money Requests',
        component:()=> import('@/views/Requests.vue')
      },
      {
        path:'/logout',
        name:'Logout',
        beforeEnter:(to,from,next)=>{
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          next('/login');
        }
      }
    ]
  },
  {
    path:'*',
    name:'404',
    component:()=>import('@/views/404.vue'),
  },
 
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => { 
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in 
    // if not, redirect to login page. 
    if(!isLoggedIn()){
      next("/login")
    }else{
      next();
    }
  } else if(to.matched.some(record => record.meta.notLoggedIn)){
      if(isLoggedIn()){
        next('/')
      }else{
        next()
      }
  }else {
    next(); // make sure to call next at the end
  }
}) 

export default router
