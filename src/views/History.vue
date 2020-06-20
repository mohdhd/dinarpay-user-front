<template>
    <v-container class="px-0">
        <v-card class="mt-3 mx-0">
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