<template>
    <v-container>
        
        <v-btn @click.stop="qrDialog=!qrDialog" fab bottom fixed right color="light-blue" >
            <v-icon color="white">fas fa-qrcode</v-icon>
        </v-btn>

        <v-form ref="form" v-model="valid">
             <v-text-field
          :label="$t('recipient')"
          style="direction:ltr"
          v-model="to"
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
                    @change="getBalance"
                    :rules="[
                        v => !!v || $t('currencyRequired')
                    ]"
          />

        <div v-if="availableBalance" style="margin-top:-15px;font-weight:bold">{{$t('availableBalance')}} : {{this.availableBalance}} {{this.currency}}</div>


         <v-text-field
          :label="$t('pin')"
          type="password"
          v-model="pin"
          :rules="[
              v => !!v || $t('PINRequired'),
              v => validatePin(v) || $t('invalidPIN')
          ]"
        ></v-text-field>



        <div class="mt-5 d-flex justify-center">
            <v-btn @click.stop="onSend" dark color="light-blue">{{$t('send')}}</v-btn>
        </div>

        </v-form>
        <v-dialog v-model="qrDialog" max-width="650">
            <v-card>

                <qrcode-stream @decode="onDecode" ></qrcode-stream>


                <v-card-text class="mt-3">
                    {{$t('qrMessage')}}
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog max-width="500" v-model="confirmDialog">

          <v-card>
            <v-card-title>{{$t('payment')}}</v-card-title>

            <div v-if="paymentComplete">
              <v-card-text class="d-flex justify-center align-center flex-column">
                <v-icon size="100" color="success">fas fa-check-circle</v-icon>
                <div style="font-size:20px" class="mt-2">{{$t('paymentComplete')}}</div>
            </v-card-text>

            <v-card-actions class="d-flex justify-center">
                <v-btn @click.stop="confirmDialog=!confirmDialog" color="success">{{$t('close')}}</v-btn>
            </v-card-actions>
            </div>

            <div v-else>
              <v-card-text>
              <div>
                <span style="font-weight:bold;font-size:17px" class="mx-2">{{$t('to')}}:</span>
                <span style="font-size:16px">{{this.to}}</span>
              </div>

              <div>
                <span style="font-weight:bold;font-size:17px" class="mx-2">{{$t('amount')}}:</span>
                <span style="font-size:16px">{{this.amount}}</span>
              </div>

              <div>
                <span style="font-weight:bold;font-size:17px" class="mx-2">{{$t('currency')}}:</span>
                <span style="font-size:16px">{{this.currency}}</span>
              </div>
            </v-card-text>

            <v-card-actions class="d-flex justify-center">
                    <v-progress-circular
                        v-if="loading"
                        :indeterminate="true"
                        size="40"
                        color="#66a6ff"
                    ></v-progress-circular>

                <div v-else>

                <v-btn class="ma-2" type="button" @click="handleSend" color="primary">{{$t('confirm')}}</v-btn>
               <v-btn class="ma-2" @click.stop="confirmDialog=!confirmDialog" dark color="grey">{{$t('cancel')}}</v-btn>
              </div>
            </v-card-actions>
            </div>
          </v-card>
        </v-dialog>

        <v-snackbar left bottom v-model="snackbar" :color="color">
          {{message}}
        </v-snackbar>
    </v-container>
</template>

<script>
import { QrcodeStream,  } from 'vue-qrcode-reader'
import axios from 'axios';
import {
  WRONG_PIN,INACTIVE_ACC,AMOUNT_MIN_ERR,
  SELF_SEND,NO_RECV_ACC
} from '../config/err_code';

//eslint-disable-next-line
const phoneRe = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,6}$/im;//eslint-disable-next-line
const pinRe = /^(?!(.)\1{3})(?!19|20)\d{4}$/i;


export default {
    name:'Send',
    //eslint-disable-next-line
    components:{QrcodeStream,},
    mounted(){
      axios.get('/api/wallet/balance').then(res=>{

        this.balance = res.data.balance;
      })
    },
    data(){
        return {
            qrDialog:false,
            currency:'',
            to:'',
            amount:'',
            pin:'',
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
            paymentComplete:false,
            balance:{},
            availableBalance:''
        }
    },
    methods:{
        onDecode(text){
            this.to = text;
            this.qrDialog = false;
        },
        onSend(){
          this.paymentComplete = false;

          if(!this.to||!this.currency||!this.amount){
            this.snackbar= true;
            this.color = 'error';
            this.message = this.$i18n.t('checkFields');
            return 
          }

          if(!this.valid){
            this.snackbar = true;
            this.color = 'error';
            this.message = this.$i18n.t('invalidPhone');

            return;
          }

          this.confirmDialog = true;
        },
        validatePhone(v){
            return phoneRe.test(v);
        },
        validatePin(v){
            return pinRe.test(v);
        },
        handleSend(){
          this.loading = true;

          axios.post('/api/wallet/send',{
            recvPhone:this.to,
            amount:this.amount,
            pin:this.pin,
            currency:this.currency
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
              this.paymentComplete= true;
            }
          }).catch(err=>{
            console.log(err)
            this.snackbar = true;
            this.color = 'error';
            this.message = this.$i18n.t('errorMessage');

            this.loading = false;
          })
        },
        getBalance(){
            this.availableBalance = this.balance[this.currency];
        }
    },
    
}
</script>