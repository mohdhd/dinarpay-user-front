<template>
    <v-container dark class="px-0">

      <h3 class="mb-3 grey--text text--darken-1 d-flex">{{$t('welcome')}}: <span class="mx-1" style="direction:ltr"> {{phone}}</span></h3>

      <v-btn @click.stop="qrDialog =!qrDialog" fab fixed bottom :left="($vuetify.rtl) ? true : false" :right="($vuetify.rtl) ? false : true" color="primary">
        <v-icon>fas fa-qrcode</v-icon>
      </v-btn>

      <v-row>
        
        <v-col class="px-0" cols="12" lg="5">

            <v-card :style="($vuetify.rtl) ? 'margin-right:9px;margin-left:5px' : 'margin-left:9px;margin-right:5px'" flat color="#2392BC" class="py-3">
              <v-card-title class="d-flex flex-column justify-center align-center">
                <div class="d-flex">
                  <!-- <v-icon color="light-blue lighten-4" class="mx-2 ">fas fa-dollar-sign</v-icon> -->
                  <div class="light-blue--text text--lighten-4" style="font-size:18px;font-weight:bold">{{$t('usd')}} <span v-if="!$vuetify.rtl">{{$t('availableBalance')}}</span></div>
                </div>

                <div>
                  <span style="font-weight:bold;font-size:22px" class="white--text">{{this.balance.USD}}</span> <span class="white--text" style="font-weight:bold;font-size:22px">USD</span>
                </div>
              </v-card-title>

            </v-card>

                  <v-row class="ma-0 pa-0 px-1">
                   <v-col class="px-1 pt-1" cols="6">
                        <v-card flat color="#2392BC" class="py-2">
                        <v-card-text>
                          <div class="d-flex justify-center">
                            <!-- <v-icon size="23" color="light-blue lighten-4" class="mx-2">fas fa-shekel-sign</v-icon> -->
                            <div class="light-blue--text text--lighten-4" style="font-size:16px">{{$t('shekel')}} <span v-if="!$vuetify.rtl">{{$t('balance')}}</span></div>
                          </div>

                          <div class="text-center mt-3">
                          <span style="font-weight:bold;font-size:18px" class="white--text">{{this.balance.ILS}}</span> <span class="white--text" style="font-weight:bold;font-size:17px">ILS</span>
                        </div>
                        </v-card-text>
                      </v-card>
                   </v-col>

                    <v-col class="px-0 pt-1" cols="6">
                      <v-card flat color="#2392BC" class="py-2">
                        <v-card-text>
                          <div class="d-flex justify-center">
                        <!-- <v-icon size="23" color="light-blue lighten-4" class="mx-2">fas fa-euro-sign</v-icon> -->
                        <div class="light-blue--text text--lighten-4" style="font-size:16px">{{$t('euro')}} <span v-if="!$vuetify.rtl">{{$t('balance')}}</span></div>
                      </div>

                      <div class="text-center mt-3">
                      <span style="font-weight:bold;font-size:18px" class="white--text">{{this.balance.EUR}}</span> <span class="white--text" style="font-weight:bold;font-size:17px">EUR</span>
                    </div>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>


        </v-col>


        <v-col style="margin-top:-12px" cols="12" lg="7">
          <v-row>
            <v-col v-for="item in navItems" :key="item.title" class="px-1" cols="4" lg="4">
                <v-card class="" ripple :to="item.to" :color="item.color" dark >
                  <v-card-text class="d-flex align-center justify-start flex-column">
                      <v-icon>
                         {{item.icon}}
                      </v-icon>

                      <div style="font-size:16px" class="main-btn-text px-2 pa-3">{{$t(item.title)}}</div>
                  </v-card-text>
                </v-card>
            </v-col>
            
          </v-row>
        </v-col>
        
      </v-row>


 

      <v-card class="mt-3 hidden-sm-and-down">
        <v-card-title>{{$t('summary')}}</v-card-title>

       <v-simple-table fixed-header>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-center">{{$t('transactionId')}}</th>
          <th class="text-center">{{$t('account')}}</th>
          <th class="text-center">{{$t('type')}}</th>
          <th class="text-center">{{$t('amount')}}</th>
          <th class="text-center">{{$t('fee')}}</th>
          <th class="text-center hidden-sm-and-down">{{$t('date')}}</th>
          <th class="text-center hidden-sm-and-down">{{$t('status')}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in transactions" :key="item.id">
          <td class="text-center hidden-sm-and-down">{{item.id}}</td>
          <td style="direction:ltr" class="text-center">{{item.account}}</td>
          <td class="text-center">{{item.type}}</td>
          <td class="text-center">{{item.value.toFixed(2)}} {{item.currency}}</td>
          <td class="text-center">{{item.fee.toFixed(2)}} {{item.currency}}</td>
          <td class="text-center">{{$moment(item.createdAt).format('DD/MM/YYYY')}}</td>
          <td class="text-center">
            <v-btn small depressed :color="item.color">{{(item.complete) ? $t('complete'): $t('incomplete')}}</v-btn>
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>

    

  </v-card>

      <div class="hidden-lg-and-up mt-5">
    
        <h2 class="grey--text text--darken-3">{{$t('summary')}}</h2>

       <v-card v-for="item in transactions" :key="item.id"  class="d-flex mt-5">
        <div class="primary" style="width:4px;"></div>

        <v-card-text class="px-2">
            <div class="d-flex">
                <span :class="($vuetify.rtl) ?'ml-auto' : 'mr-auto'">{{$moment(item.createdAt).format('DD/MM/YYYY')}}</span>
                <div style="font-size:17px"  :class="($vuetify.rtl) ? 'mr-auto' : 'ml-auto'">
                  <span><v-btn small depressed :color="item.color">{{(item.complete) ? $t('complete'): $t('incomplete')}}</v-btn></span>
                </div>
            </div>

            <div class="d-flex mt-3">
                <span style="font-size:16px" :class="($vuetify.rtl) ?'ml-auto' : 'mr-auto'">{{$t('account')}}</span>
                <span style="font-size:18px" :class="($vuetify.rtl) ? 'mr-auto success--text' :'ml-auto success--text'">{{item.value.toFixed(2)}}</span> <span style="font-size:16px" class="mx-2">{{item.currency}}</span>
            </div>

             <div class="d-flex mt-2">
                <span style="font-size:16px;direction:ltr" :class="($vuetify.rtl) ?'ml-auto' : 'mr-auto'">{{item.account}}</span>
                <span style="font-size:15px" :class="($vuetify.rtl) ? 'mr-auto mx-2' : 'ml-auto mx-2' ">{{$t('fee')}} {{item.fee.toFixed(2)}} {{item.currency}}</span>
            </div>

            <v-divider class="my-3" />

            <div class="d-flex flex-column mt-2">
                <span style="font-size:15px" :class="($vuetify.rtl) ?'ml-auto' : 'mr-auto'"> {{$t('transactionId')}}: {{item.id}}</span>
                <span class="mt-1" style="font-size:15px">{{$t('transactionType')}} : <span style="font-size:16px" class="light-blue--text">{{item.type}}</span></span>
            </div>
        </v-card-text>

      </v-card>

      </div>

      
      <v-dialog max-width="350"  v-model="qrDialog">
        <v-card class="d-flex flex-column">
            <v-card-title class="mt-2 pa-0 d-flex justify-center">{{$t('qrTextHome')}}</v-card-title>
            <vue-qr bindElement :text="phone" size="300" qid="testid"></vue-qr>
        </v-card>
      </v-dialog>

    </v-container>
</template>

<script>
// @ is an alias to /src
import VueQr from 'vue-qr'
import {user} from '@/auth'
import axios from 'axios';
import {
  G_VOUCHER,W_TRANS,DW_EVOUCHER,
  BTC_DEPOSIT,ETH_DEPOSIT,REQ_MONEY,PAYPAL_DEPOSIT,CC_DEPOSIT
} from '../config/err_code';

export default {
  name: 'Home',
  components:{VueQr},
  mounted(){
      axios.get('/api/wallet/balance').then(res=>{

        this.balance = res.data.balance;
      })

      axios.get('/api/wallet/last-transactions').then(res=>{
          this.transactions = res.data.transactions.map(item=>{

            if(item.desc == W_TRANS){
              if(item.from.phone == this.phone){
                item.type = this.$i18n.t('send');
                item.account = item.to.phone;
              }else{
                item.type = this.$i18n.t('receive')
                item.account = item.from.phone;
              }
            }else if(item.desc == G_VOUCHER){
               item.account = this.phone;
               item.type = this.$i18n.t('transactionGenVoucherText')
            }else if(item.desc ==DW_EVOUCHER){
              item.account =this.phone;
              item.type = this.$i18n.t('transactionDepositVoucherText');
            }else if(item.desc ==BTC_DEPOSIT){
              item.account =this.phone;
              item.type = this.$i18n.t('btcDepositTransactionText');
            }else if(item.desc ==ETH_DEPOSIT){
              item.account =this.phone;
              item.type = this.$i18n.t('ethDepositTransactionText');
            }else if(item.desc ==PAYPAL_DEPOSIT){
              item.account =this.phone;
              item.type = this.$i18n.t('paypalDepositTransactionText');
            }else if(item.desc ==CC_DEPOSIT){
              item.account =this.phone;
              item.type = this.$i18n.t('creditCardDepositTransactionText');
            }else if(item.desc ==REQ_MONEY){
              if(item.from.phone == this.phone){
                item.type = this.$i18n.t('moneyRequestPaymentTransactionText');
                item.account = item.to.phone;
              }else{
                item.type = this.$i18n.t('moneyRequestTransactionText');
                item.account = item.from.phone;

              }
            }else{
              item.account = this.phone;
            }

            item.color = (item.complete) ? 'success' : 'error';

            return item;
          });
      })
  },
  data(){
    return {
       qrDialog:false,
       phone:user().phone,
       balance:{},
       transactions:[],
       navItems:[
        {
          title:'deposit',
          icon:'fas fa-plus',
          to:"/deposit",
          color:'#27ae60'
        },
        {
          title:'exchange',
          icon:'fas fa-sync-alt',
          to:'/exchange',
          color:'#3498db'
        },
        {
          title:'withdraw',
          icon:'fas fa-hand-holding-usd',
          to:'/withdraw',
          color:'#e74c3c'
        },
        {
          title:'send',
          icon:'fas fa-arrow-circle-up',
          to:'/send',
          color:'#9b59b6'
        },
        {
          title:'request',
          icon:'fas fa-handshake',
          to:'/request',
          color:'#20b2aa'
        },
        {
          title:'QRPay',
          icon:'fas fa-qrcode',
          color:'#2b5797'
        }
      ]
    }
  }
}
</script>

<style>
.main-board{
background: rgb(2,0,36);
background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(37,128,162,1) 0%, rgba(59,175,218,1) 65%);
}

@media screen and (max-width:650px) {

    .main-btn-text{
      font-size:15px!important;
    }
}
</style>