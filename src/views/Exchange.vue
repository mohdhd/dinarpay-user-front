<template>
    <v-container>

        <v-form v-model="valid" @submit.prevent="handleSubmit" ref="form">
                    <v-select
                    :label="$t('from')"
                    :items="currencies"
                    v-model="from"
                    @change="getRate"
                    :rules="[
                        v => !!v || $t('fromRequired')
                    ]"
                />

                <div v-if="fromBalance" style="margin-top:-15px;font-weight:bold">{{$t('availableBalance')}} : {{this.fromBalance}} {{this.from}}</div>

                <v-select 
                    :label="$t('to')"
                    :items="currencies.filter(item=>item != this.from)"
                    v-model="to"
                    @change="getRate"
                    :rules="[
                        v => !!v || $t('toRequired')
                    ]"
                />

                <div v-if="toBalance" style="margin-top:-15px;font-weight:bold">{{$t('availableBalance')}} : {{this.toBalance}} {{this.to}}</div>


              <v-row>
                  <v-col cols="6">
                        <v-text-field
                        :label="$t('amount')"
                        v-model="amount"
                        type="number"
                        @keyup="calcReceived"
                        :rules="[
                            v => !!v || $t('amountRequired')
                        ]"
                        ></v-text-field>

                  </v-col>

                  <v-col cols="6">

                        <v-text-field
                        :label="$t('received')"
                        v-model="recieved"
                        type="number"
                        readonly
                        ></v-text-field>
                  </v-col>
              </v-row>

                <v-text-field
                :label="$t('pin')"
                type="password"
                v-model="pin"
                :rules="[
                    v => !!v || $t('PINRequired'),
                    v => validatePin(v) || $t('invalidPIN')
                ]"
                ></v-text-field>


                <p style="font-weight:bold" v-html="rateText"></p>

                <div class="d-flex justify-center mt-4">
                    <v-progress-circular
                        v-if="loading"
                        :indeterminate="true"
                        size="40"
                        color="#66a6ff"
                    ></v-progress-circular>

                    <v-btn v-else type="submit" dark color="light-blue">{{$t('exchange')}}</v-btn>
                </div>
        </v-form>

        <v-snackbar left bottom v-model="snackbar" :color="color">
          {{message}}
        </v-snackbar>
    </v-container>
</template>

<script>
import axios from 'axios';

import {
  WRONG_PIN,INACTIVE_ACC,AMOUNT_MIN_ERR
  ,AMOUNT_LESS_MIN
} from '../config/err_code';

//eslint-disable-next-line
const pinRe = /^(?!(.)\1{3})(?!19|20)\d{4}$/i;

export default {
    name:'Exchange',
    mounted(){
        axios.get('/api/wallet/balance').then(res=>{

        this.balance = res.data.balance;
      })
    },
    data(){
        return {
            from:'',
            to:'',
            amount:'',
            currencies:['USD','EUR','ILS'],
            rate:0,
            balance:{},
            rateText:'',
            recieved:0.00,
            pin:'',
            loading:false,
            valid:false,
            snackbar:false,
            message:'',
            color:'',
            fromBalance:'',
            toBalance:''
        }
    },
    methods:{
        getRate(){
            if(!this.from || !this.to){
                return 
            }

            axios.get(`/api/wallet/exchange-rate?base=${this.from}&to=${this.to}`).then(res=>{
                this.rate = res.data.rates[this.to];
                this.rateText = `1 ${this.from} &asymp; ${this.rate} ${this.to}`
            })

            this.fromBalance = this.balance[this.from];
            this.toBalance = this.balance[this.to];
        },
        calcReceived(){
            if(this.rate){
                this.recieved = (this.rate * this.amount).toFixed(2);
            }
        },
        validatePin(v){
            return pinRe.test(v);
        },
        handleSubmit(){
            this.$refs.form.validate();
            if(!this.valid){
                return
            }

        this.loading = true;

          axios.post('/api/wallet/exchange',{
            base:this.from,
            amount:this.amount,
            pin:this.pin,
            to:this.to
          }).then(res=>{
            this.loading = false;
            let {error,errMsg} = res.data;

            if(error){
              if(errMsg ==WRONG_PIN){
                this.snackbar = true;
                this.color = 'error';
                this.message = this.$i18n.t('wrongPin')

              }else if(errMsg == INACTIVE_ACC){
                this.snackbar = true;
                this.color = 'error';
                this.message = this.$i18n.t('errorMessage')
              }else if(errMsg == AMOUNT_MIN_ERR){
                this.snackbar = true;
                this.color = 'error';
                this.message = this.$i18n.t('lowBalance')
              }else if(errMsg == AMOUNT_LESS_MIN){
              this.snackbar = true;
              this.color = 'error';
              this.message = this.$i18n.t('amountLess')
            }else {
              this.snackbar = true;
              this.color = 'error';
              this.message = this.$i18n.t('errorMessage')
            }
            }else{
              axios.get('/api/wallet/balance').then(res=>{

                this.balance = res.data.balance;
                this.$refs.form.reset();
                this.loading = false;
                this.snackbar = true;
                this.color= 'success';
                this.message = this.$i18n.t('exchangeSuccessful')
            })
            }
          }).catch(err=>{
            console.log(err)
            this.snackbar = true;
            this.color = 'error';
            this.message = this.$i18n.t('errorMessage');

            this.loading = false;
          })
        }
    }
}
</script>