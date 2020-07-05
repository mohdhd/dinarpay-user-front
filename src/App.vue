<template>
    <router-view />
</template>

<script>

import axios from 'axios';
import {token} from './auth';

// axios.defaults.baseURL = 'https://backend.dinarpay.net' || 'http://localhost:8000';
axios.defaults.baseURL =  'http://localhost:8000';

axios.defaults.headers.common = {
  Authorization:`Bearer ${token()}`
};


export default {
  name: 'App',
  mounted(){
    axios.interceptors.response.use(res=>{
    return res
  },
  err=>{
    if(err.response.status == 401){
      localStorage.removeItem('token');
    }
    this.$router.push('/login')
    }
    );

    this.$fingerprint.get((components) => {
                this.finger = this.$fingerprint.x64hash128(components.map((pair) => { return pair.value }).join(), 31)
                
                axios.post('/api/wallet/devices/check',{
                  fingerprint:this.finger
                }).then(res=>{
                  if(res.data.error){
                    this.$router.push('/check-key')
                  }
                })
        });
  },
  data(){
    
    return {
    drawer:false,
    drawerItems:[
      {
        title:this.$i18n.t('home') ,
        icon:'fas fa-home',
        to:"/"
      },
       {
          title:this.$i18n.t('deposite'),
          icon:'fas fa-plus',
          to:"/deposit"
        },
        {
          title:this.$i18n.t('exchange'),
          icon:'fas fa-sync-alt',
          to:'/exchange'
        },
        {
          title:this.$i18n.t('withdraw'),
          icon:'fas fa-hand-holding-usd',
          to:"/withdraw"
        },
        {
          title:this.$i18n.t('send'),
          icon:'fas fa-arrow-circle-up',
          to:"/send"
        },
         {
          title:this.$i18n.t('evoucher'),
          icon:'fas fa-ticket-alt',
          to:'/evoucher'
        },
        {
          title:this.$i18n.t('history'),
          icon:'fas fa-history',
          to:'/history'
        },
        {
          title:this.$i18n.t('locations'),
          icon:'fas fa-map-marked-alt',

        },
    ]
  }
  },
};
</script>


<style>

#app{
  background:#F5F6F8;
}

.v-list-item__title{
  color:grey;
}

.v-list-item__icon{
  color:grey;
}

.v-list-item--active  .v-list-item__icon{
  color:#3BAFDA;
}

.v-list-item--active .v-list-item__title {
  color:#3BAFDA;
}

.v-application--is-rtl .v-btn {
    letter-spacing: 0 !important;
}

*{
      font-family: 'Cairo', sans-serif;
}

body::-webkit-scrollbar {
  display: none;
}

.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.4s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}

.v-btn__content{
  text-transform: none;
}

.v-btn-toggle{
  direction: ltr;
}
</style>