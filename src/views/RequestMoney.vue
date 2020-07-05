<template>
    <v-container>

        <v-form ref="form" v-model="valid">
             <v-text-field
          :label="$t('from')"
          v-model="from"
          style="direction:ltr"
          type="tel"
          :rules="[
              v => !!v || $t('phoneRequired'),
              v => validatePhone(v) || $t('invalidPhone')
          ]"
        ></v-text-field>

        <v-text-field
          :label="$t('amount')"
          type="number"
          v-model="amount"
          :rules="[
              v => !!v || $t('amountRequired')
          ]"
        ></v-text-field>


       <v-select
                    :label="$t('currency')"
                    :items="currencies"
                    v-model="currency"
                    :rules="[
                        v => !!v || $t('currencyRequired')
                    ]"
        />

        <div class="mt-5 d-flex justify-center">
          <v-progress-circular
              v-if="loading"
              :indeterminate="true"
              size="40"
              color="#66a6ff"
          ></v-progress-circular>

            <v-btn v-else @click.stop="handleSend" dark color="light-blue">{{$t('request')}}</v-btn>
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
  SELF_SEND,NO_RECV_ACC,AMOUNT_LESS_MIN
} from '../config/err_code';

//eslint-disable-next-line
const phoneRe = /^[1-9]\d{7}$|^[1-9]\d{8}$|^[1-9]\d{9}$/im;
//eslint-disable-next-line
const pinRe = /^(?!(.)\1{3})(?!19|20)\d{4}$/i;


export default {
    name:'RequestMoney',
    //eslint-disable-next-line
    data(){
        return {
            currency:'',
            from:'',
            amount:'',
            snackbar:false,
            color:'',
            message:'',
            currencies:[
              'USD',
              'EUR',
              'ILS'
            ],
            confirmDialog:false,
            valid:false,
            loading:false,
            paymentComplete:false
        }
    },
    methods:{
        validatePhone(v){
            return phoneRe.test(v);
        },
        validatePin(v){
            return pinRe.test(v);
        },
        handleSend(){
          this.loading = true;

          axios.post('/api/wallet/request',{
            from:this.from,
            amount:this.amount,
            currency:this.currency
          }).then(res=>{
            this.loading = false;
            let {error,errMsg} = res.data;

            if(error){
              if(errMsg == AMOUNT_LESS_MIN){
                this.snackbar = true;
                this.color = 'error';
                this.message = this.$i18n.t('amountLess')
              }else if(errMsg == SELF_SEND){
              this.snackbar = true;
              this.color = 'error';
              this.message = this.$i18n.t('errorMessage')
            }else if(errMsg == NO_RECV_ACC){
              this.snackbar = true;
              this.color = 'error';
              this.message = this.$i18n.t('noRecvAcc')
            }else {
              this.snackbar = true;
              this.color = 'error';
              this.message = this.$i18n.t('errorMessage')
            }
            }else{
              this.$refs.form.reset();
              this.snackbar= true;
              this.color = 'success';
              this.message = this.$i18n.t('sentSuccessful')
            }
          }).catch(err=>{
            console.log(err)
            this.snackbar = true;
            this.color = 'error';
            this.message = this.$i18n.t('errorMessage');

            this.loading = false;
          })
        }
    },
    
}
</script>