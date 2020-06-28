<template>
    <v-container class="px-0">
        <v-card class="mt-3 mx-0 class hidden-md-and-down">
        <v-card-title>{{$t('history')}}</v-card-title>

          <v-data-table
            :headers="headers"
            :items="transactions"
          >

          <template v-slot:item.account="{ item}">
            <div style="direction:ltr">{{item.account}}</div>
          </template>

          <template v-slot:item.fee="{item}">
            0 {{item.currency}}
          </template>
          
           <template v-slot:item.status="{ item }">
             <v-btn small depressed :color="item.color">{{(item.complete) ? $t('complete'): $t('incomplete')}}</v-btn>
          </template> 

            <template v-slot:item.date="{ item }">
            {{$moment(item.createdAt).format('DD/MM/YYYY')}}
          </template> 

          <template v-slot:item.amount="{item}">
            {{item.value.toFixed(2)}} {{item.currency}}
          </template>
          
          </v-data-table>


      </v-card>

      <div class="hidden-lg-and-up">
        <h3 class="grey--text text--darken-2">{{$t('history')}}</h3>
        
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
                <span style="font-size:15px" :class="($vuetify.rtl) ? 'mr-auto mx-2' : 'ml-auto mx-2' ">{{$t('fee')}} 0.00 {{item.currency}}</span>
            </div>

            <v-divider class="my-3" />

            <div class="d-flex flex-column mt-2">
                <span style="font-size:15px" :class="($vuetify.rtl) ?'ml-auto' : 'mr-auto'"> {{$t('transactionId')}}: {{item.id}}</span>
                <span class="mt-1" style="font-size:15px">{{$t('transactionType')}} : <span style="font-size:16px" class="light-blue--text">{{item.type}}</span></span>
            </div>
        </v-card-text>

      </v-card>
      </div>


    </v-container>
</template>

<script>
import axios from 'axios';
import {user} from '@/auth';

import {
  G_VOUCHER,W_TRANS,DW_EVOUCHER,
  BTC_DEPOSIT,ETH_DEPOSIT,REQ_MONEY,PAYPAL_DEPOSIT,CC_DEPOSIT
} from '../config/err_code';


export default {
    name:'History',
    mounted(){
        axios.get('/api/wallet/history').then(res=>{
          this.transactions = res.data.transactions.map(item=>{

            if(!item.to){
              item.to = {};
              item.to.phone = '';
            }

            if(!item.from){
              item.from = {};
              item.from.phone = ''
            }

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
            }else if(item.desc ==ETH_DEPOSIT){
              item.account =this.phone;
              item.type = this.$i18n.t('ethDepositTransactionText');
            }else if(item.desc ==BTC_DEPOSIT){
              item.account =this.phone;
              item.type = this.$i18n.t('btcDepositTransactionText');
            }else if(item.desc ==PAYPAL_DEPOSIT){
              item.account =this.phone;
              item.type = this.$i18n.t('paypalDepositTransactionText');
            }else if(item.desc ==CC_DEPOSIT){
              item.account =this.phone;
              item.type = this.$i18n.t('creditCardDepositTransactionText');
            }else if(item.desc ==REQ_MONEY){
              if(item.from.phone == this.phone){
                item.type = this.$i18n.t('moneyRequestTransactionText');
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
          transactions:[],
          phone:user().phone,
           headers: [
          {
            text: this.$i18n.t('transactionId'),
            align: 'center',
            value: 'id',
          },
          { text: this.$i18n.t('account'), value: 'account',align: 'center', },
          { text: this.$i18n.t('type'), value: 'type',align: 'center', },
          { text: this.$i18n.t('amount'), value: 'amount',align: 'center', },
          { text: this.$i18n.t('fee'), value: 'fee',align: 'center', },
          { text: this.$i18n.t('date'), value: 'date',align: 'center', },
          { text: this.$i18n.t('status'), value: 'status',align: 'center', },
        ]
        }
    }
}
</script>