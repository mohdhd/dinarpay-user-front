<template>
    <v-app>
    <v-app-bar
      app
      color="#3BAFDA"
      class="elevation-0"
      dark
    >

       <v-btn @click.stop="drawer=!drawer" tile icon>
          <v-icon color="grey lighten-3" size="22">fas fa-bars</v-icon>
        </v-btn>

        <div class="d-flex align-center">
        <div cl style="font-size:25px" :class="($vuetify.rtl) ? 'mr-3' : 'ml-3'">{{$t('dinarpay')}}</div>
      </div>

      <v-spacer></v-spacer>

         <v-menu

      offset-y
      origin="top right"
      transition="scale-transition"
      nudge-width="250"
      nudge-bottom="12"
      max-height="240"
    >
      <template v-slot:activator="{ attrs, on }">
        <v-btn
          class="ml-2"
          min-width="0"
          text
          v-bind="attrs"
          v-on="on"
          @click.stop="readNotifications"
        >
          <v-badge
            v-if="notificationCount > 0"
            color="red"
            overlap
          >
            <template v-slot:badge>
              <span>{{notificationCount}}</span>
            </template>

            <v-icon>mdi-bell</v-icon>
          </v-badge>

          <v-icon v-else>mdi-bell</v-icon>
        </v-btn>
      </template>

          <div v-for="item in notifications" :key="item.id" class="white pa-2">
            <h4 class="grey--text text--darken-2">{{item.vtitle}}</h4>
          <div style="font-size:15px" class="grey--text text--darken-1">{{item.vcontent}}</div>
          <div style="font-size:13px" class="grey--text text-right">{{$moment(item.date).format('DD/MM/YY')}}</div>

          <v-divider class="my-2" />
          </div>

          <div v-if="notifications.length == 0" class="white pa-5 text-center">
            <h4 class="grey--text text--darken-2"></h4>
          <div style="font-size:15px" class="grey--text text--darken-1">{{$t('noNotifications')}}</div>

          </div>


    </v-menu>

     <v-menu
      v-model="settings"
      offset-y
      origin="top right"
      transition="scale-transition"
      nudge-width="130"
      nudge-bottom="12"
      nudge-right="15"
      class="elevation-0"
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ attrs, on }">
        <v-btn
          class="ml-2"
          min-width="0"
          text
          v-bind="attrs"
          v-on="on"
        >
            <v-icon>fas fa-cog</v-icon>
        </v-btn>
      </template>

      <v-list
        tile
        nav
      >
        <v-list-item @click.stop="closeSettingsMenu" to="/edit-account">

                
              <v-icon class="mx-2" color="grey" size="17" >fas fa-edit</v-icon>
              <div class="grey--text">{{$t('editAccount')}}</div>
          </v-list-item>

          <v-list-group
        >
            <template v-slot:activator>
                 <v-list-item>
                   <v-icon color="grey" :class="($vuetify.rtl) ? 'ml-2' : 'mr-2'" size="17" >fas fa-language</v-icon>
                    <div class="grey--text">{{$t('langauge')}}</div>


                </v-list-item>
             </template>

          <v-list>
             <v-list-item @click.stop="setLang('en')">
            <v-list-item-icon>
              <v-img src="@/assets/english.svg" height="20" width="20" />
            </v-list-item-icon>
              
            <v-list-item-content>
              <v-list-item-title>English</v-list-item-title>
            </v-list-item-content>


          </v-list-item>

          <v-list-item @click.stop="setLang('ar')">
            <v-list-item-icon>
              <v-img src="@/assets/arabic.svg" height="20" width="20" />
            </v-list-item-icon>
              
            <v-list-item-content>
              <v-list-item-title>العربية</v-list-item-title>
            </v-list-item-content>


          </v-list-item>


          </v-list>
        </v-list-group>

        <v-list-item to="/logout">

                
              <v-icon class="mx-2" color="grey" size="17" >fas fa-sign-out-alt</v-icon>
              <div class="grey--text">{{$t('logout')}}</div>
          </v-list-item>
      </v-list>
    </v-menu>

    </v-app-bar>

    <v-content>
      
      <v-navigation-drawer
        v-model="drawer"
        hide-overlay
        mobile-break-point="960"
        light
        :right="($vuetify.rtl) ? true :false"
        app
      >

        <div style="height:64px;background:#3BAFDA" class="white--text d-flex flex-column justify-center align-center">
          <h2 class="hidden-lg-and-up">{{$t('dinarpay')}}</h2>
        </div>
        <v-list
          dense
          nav
        >

          <v-list-item
            v-for="item in drawerItems"
            :key="item.title"
            link
            :to="item.to"
          >
            <v-list-item-icon>
              <v-icon >{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title :style="($vuetify.rtl) ? '14px' : '16px'" >{{ $t(item.title) }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

            <v-list-group>
            <template v-slot:activator>
                 <v-list-item class="ma-0 pa-0">
                   
                   <v-list-item-icon>
                     <v-icon>fas fa-map-marked-alt</v-icon>
                   </v-list-item-icon>


                  <v-list-item-content>
                  <v-list-item-title :style="($vuetify.rtl) ? '14px' : '16px'" >{{$t('locations')}}</v-list-item-title>
                </v-list-item-content>
                </v-list-item>
             </template>

          <v-list>
             <v-list-item to="/locations/merchants" >
            <v-list-item-icon>
            </v-list-item-icon>
              
            <v-list-item-content>
              <v-list-item-title style="font-size:16px">{{$t('merchants')}}</v-list-item-title>
            </v-list-item-content>


          </v-list-item>

          <v-list-item to="/locations/agents" >
            <v-list-item-icon>
              
            </v-list-item-icon>
              
            <v-list-item-content>
              <v-list-item-title style="font-size:16px">{{$t('agents')}}</v-list-item-title>
            </v-list-item-content>


          </v-list-item>


          </v-list>
        </v-list-group>


        </v-list>
      </v-navigation-drawer>

      <v-container>
          <router-view />

      </v-container>
    
    </v-content>

    
  </v-app>
</template>

<script>
import axios from 'axios';
import {
  RW_MONEY,REQ_MONEY
} from '../config/err_code'
import io from 'socket.io-client';

import {user} from '../auth';

const socket = io('https://backend.dinarpay.net');



//eslint-disable-next-line
// function disconnectUser () {  // Called whenever a user signs out
//   var userId = user().id  // Retrieve userId
//   if (!userId) return;
//   socket.emit('userDisconnected', userId);
// }



export default {
    name:'Index',
    mounted(){
      axios.get('/api/wallet/notifications').then(res=>{
        this.notifications = res.data.notifications.map(item=>{
          if(item.title == RW_MONEY){
            item.vtitle = this.$i18n.t('moneyReceived')
            item.vcontent = `${this.$i18n.t('receivedNotificationText')} ${item.amount} ${item.currency}`
          }else if(item.title == REQ_MONEY){
            item.vtitle = this.$i18n.t('moneyRequest');
            item.vcontent = `${this.$i18n.t('moneyRequestNotifictionText')} ${item.from.phone.replace('+','')}`
          }

          if(!item.read){
            this.notificationCount +=1;
          }

          return item;
        });
      })

      let lang = localStorage.getItem('lang') || ''


      if(lang){
        this.setLang(lang)
      }

      socket.on('connectme',()=>{
        
        socket.emit('userConnect',user().id)
      })

      socket.on('newNotification',(e)=>{
          const audio = new Audio(require('../assets/ring.mp3'));

          audio.play()

          let item = e;

          if(item.title == RW_MONEY){
            item.vtitle = this.$i18n.t('moneyReceived')
            item.vcontent = `${this.$i18n.t('receivedNotificationText')} ${item.amount} ${item.currency}`
          }else if(item.title == REQ_MONEY){
            item.vtitle = this.$i18n.t('moneyRequest');
            item.vcontent = `${this.$i18n.t('moneyRequestNotifictionText')} ${item.from.phone}`
          }

          this.notifications = [item,...this.notifications];
          this.notificationCount += 1;
      })

      
    },
    data(){
    
    return {
    drawer:false,
    notifications:[],
    notificationCount:0,
    settings:false,
    lang:'',
    drawerItems:[
      {
        title:'home',
        icon:'fas fa-home',
        to:"/"
      },
       {
          title:'deposit',
          icon:'fas fa-plus',
          to:"/deposit"
        },
        {
          title:'exchange',
          icon:'fas fa-sync-alt',
          to:'/exchange'
        },
        {
          title:'withdraw',
          icon:'fas fa-hand-holding-usd',
          to:"/withdraw"
        },
        {
          title:'send',
          icon:'fas fa-arrow-circle-up',
          to:"/send"
        },
         {
          title:'requestMoney',
          icon:'fas fa-handshake',
          to:'/request'
        },
         {
          title:'evoucher',
          icon:'fas fa-ticket-alt',
          to:'/evoucher'
        },
        {
          title:'moneyRequests',
          icon:'fas fa-inbox',
          to:'/requests'
        },
        {
          title:'history',
          icon:'fas fa-history',
          to:'/history'
        },

    ]
  }
  },
  methods:{
    readNotifications(){
      //eslint-disable-next-line
      axios.get('/api/wallet/read-notifications').then(res=>{
          this.notificationCount = 0;
          this.notifications = this.notifications.map(item=>{
            item.read = true;
            return item;
          })
      })
    },
    setLang(lang){
      this.settings = false;
      if(lang == 'ar'){
        this.$vuetify.rtl = true;
      }else{
        this.$vuetify.rtl = false;
      }

      this.lang = lang;

      this.$i18n.locale= lang
      localStorage.setItem('lang',lang)
    },
    closeSettingsMenu(){
      this.settings = false;
    },

  },
}
</script>