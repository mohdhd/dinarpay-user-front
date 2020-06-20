<template>
    <v-container>

        <h4 class="grey--text text--darken-2">{{$t('generateEvoucher')}}</h4>

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


        <v-form ref="form" v-model="valid">
        <v-text-field
          :label="$t('value')"
          type="number"
          v-model="amount"
          :rules="[
              v => !!v || $t('amountRequired')
          ]"
        ></v-text-field>

        <v-text-field
          :label="$t('pin')"
          type="password"
          v-model="pin"
          :rules="[
              v => !!v || $t('PINRequired'),
              v => validatePin(v) || $t('invalidPIN')
          ]"
        ></v-text-field>


        <v-alert
        class="my-5"
        dark
        v-model="alert"
        color="success"

        >
        
        <div class="d-flex align-center">
            <div class="mx-3 hidden-sm-and-down">
                <v-icon color="white">fas fa-ticket-alt</v-icon>
            </div>
            <div>
                {{$t('generatedSuccessful')}} {{token}}
            </div>

            <v-btn @click.stop="onCopy" class="ml-auto" icon tile>
            <v-icon size="20" color="white">fas fa-clipboard</v-icon>
        </v-btn>
        </div>
        </v-alert>

        <div class="mt-5 d-flex justify-center">
            <v-btn @click.stop="onSend" dark color="light-blue">{{$t('generate')}}</v-btn>
        </div>

        </v-form>

        <v-dialog max-width="500" v-model="confirmDialog">

          <v-card>
            <v-card-title>{{$t('generateEvoucher')}}</v-card-title>

              <v-card-text>
              <div>
                <span style="font-weight:bold" class="mr-3">{{$t('value')}}:</span>
                <span>{{this.amount}}</span>
              </div>

              <div>
                <span style="font-weight:bold" class="mr-3">{{$t('currency')}}:</span>
                <span>{{this.currency}}</span>
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

                <v-btn class="ma-2" type="button" @click="handleSubmit" color="primary">{{$t('confirm')}}</v-btn>
               <v-btn class="ma-2" @click.stop="confirmDialog=!confirmDialog" dark color="grey">{{$t('cancel')}}</v-btn>
              </div>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-snackbar left bottom v-model="snackbar" :color="color">
          {{message}}
        </v-snackbar>
    </v-container>
</template>

<script>
import axios from 'axios';
import {
  WRONG_PIN,INACTIVE_ACC,AMOUNT_MIN_ERR,
    AMOUNT_LESS_MIN,
} from '../config/err_code';

//eslint-disable-next-line
const pinRe = /^(?!(.)\1{3})(?!19|20)\d{4}$/i;


export default {
    name:'Send',
    //eslint-disable-next-line
    mounted(){
      axios.get('/api/wallet/balance').then(res=>{

        this.balance = res.data.balance;
      })
    },
    data(){
        return {
            currency:'',
            amount:'',
            pin:'',
            snackbar:false,
            color:'',
            message:'',
            currencies:['USD','EUR','ILS'],
            confirmDialog:false,
            valid:false,
            loading:false,
            alert:false,
            token:'',
            balance:{},
            availableBalance:''
        }
    },
    methods:{
        onCopy(){
            this.$copyText(this.token)
            this.snackbar = true;
            this.color = 'success';
            this.message = this.$i18n.t('copySuccessful')
        },
        onSend(){

          if(!this.currency){
              this.snackbar = true;
              this.color = 'error';
              this.message = this.$i18n.t('checkFields');
              return
          }

          this.$refs.form.validate();
          if(!this.valid){
            this.snackbar = true;
            this.color = 'error';
            this.message = this.$i18n.t('checkFields');

            return;
          }

          this.confirmDialog = true;
        },
        validatePin(v){
            return pinRe.test(v);
        },
        handleSubmit(){
          this.loading = true;

          axios.post('/api/wallet/gen-evoucher',{
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
                this.$refs.form.reset();
                this.loading = false;
                this.token = res.data.token;
                this.alert = true;
                this.confirmDialog = false;
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