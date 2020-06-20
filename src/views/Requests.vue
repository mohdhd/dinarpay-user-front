<template>
    <v-container class="px-0">
        <v-card class="mt-3 pa-4 hidden-sm-and-down">
        <v-card-title>{{$t('moneyRequests')}}</v-card-title>

       <v-simple-table class="hidden-sm-and-down" fixed-header>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-center">{{$t('transactionId')}}</th>
          <th class="text-center">{{$t('account')}}</th>
          <th class="text-center">{{$t('amount')}}</th>
          <th class="text-center">{{$t('status')}}</th>
          <th class="text-center hidden-sm-and-down">{{$t('date')}}</th>
          <th class="text-center hidden-sm-and-down">{{$t('options')}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in requests" :key="item.id">
          <td class="text-center hidden-sm-and-down">{{item.id}}</td>
          <td class="text-center">{{item.to.phone}}</td>
          <td class="text-center">{{item.value.toFixed(2)}} {{item.currency}}</td>
          <td class="text-center">{{item.vstatus}}</td>
          <td class="text-center">{{$moment(item.createdAt).format('DD/MM/YY')}}</td>
          <td class="d-flex justify-center">
              <v-btn @click.stop="onSelect(item._id)" small class="ma-2" color="success">{{$t('approve')}}</v-btn>
              <v-btn @click.stop="onSelect(item._id,false)" small class="ma-2" color="error">{{$t('delete')}}</v-btn>
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>

     <div class="grey--text text-center hidden-sm-and-up" v-if="requests.length == 0">
         {{$t('noData')}}
     </div>


     

      </v-card>

      <h3 class="hidden-md-and-up grey--text text--darken-2">
       {{$t('moneyRequests')}}
     </h3>

      <v-card v-for="item in requests" :key="item.id" class="hidden-md-and-up my-2 pa-2">
        <div class="grey--text text--darken-2 d-flex">
          <span style="width:120px;display:inline-block" class="mx-3">{{$t('transactionId')}}</span>
          <span :class="($vuetify.rtl)? 'mr-auto' : 'ml-auto'">{{item.id}}</span>
        </div>
        <div class="grey--text text--darken-2 d-flex">
          <span style="width:120px;display:inline-block" class="mx-3">{{$t('account')}}</span>
          <span :class="($vuetify.rtl)? 'mr-auto' : 'ml-auto'" style="direction:ltr">{{item.to.phone}}</span>
        </div>
        <div class="grey--text text--darken-2 d-flex">
          <span style="width:120px;display:inline-block" class="mx-3">{{$t('status')}}</span>
          <span :class="($vuetify.rtl)? 'mr-auto' : 'ml-auto'">{{item.vstatus}}</span>
        </div>
        <div class="grey--text text--darken-2 d-flex">
          <span style="width:120px;display:inline-block" class="mx-3">{{$t('amount')}}</span>
          <span :class="($vuetify.rtl)? 'mr-auto' : 'ml-auto'">{{item.value.toFixed(2)}} {{item.currency}}</span>
        </div>
        <div class="grey--text text--darken-2 d-flex">
          <span style="width:120px;display:inline-block" class="mx-3">{{$t('date')}}</span>
          <span :class="($vuetify.rtl)? 'mr-auto' : 'ml-auto'">{{$moment(item.createdAt).format('DD/MM/YY')}}</span>
        </div>

        <div class="grey--text text--darken-2 d-flex justify-center mt-3">
          <span>
            <v-btn tile icon @click.stop="onSelect(item._id)" small class="ma-2" color="success">
              <v-icon color="success">fas fa-check-circle</v-icon>
            </v-btn>
              <v-btn icon tile @click.stop="onSelect(item._id,false)" small class="ma-2" color="error">
                <v-icon>fas fa-trash</v-icon>
              </v-btn>
          </span>
        </div>

      </v-card>

        <v-dialog v-model="pinDialog" max-width="650">
            <v-card>
                <v-card-title>{{$t('enterPin')}}</v-card-title>

                <v-card-text>
                    <v-form ref="form" @submit.prevent="handleApprove" v-model="valid">
                        <v-text-field
                            :label="$t('pin')"
                            type="password"
                            v-model="pin"
                            :rules="[
                            v => !!v || $t('PINRequired'),
                            v => validatePin(v) || $t('invalidPIN')
                            ]"
                        ></v-text-field>

                        <div class="d-flex justify-center">
                                 <v-progress-circular
                                  v-if="loading"
                                  :indeterminate="true"
                                   size="40"
                                   color="#66a6ff"
                                ></v-progress-circular>

                        <v-btn class="mt-3" v-else type="submit" dark color="#66a6ff">{{$t('confirm')}}</v-btn>

                    </div>
                        
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>

         <v-snackbar left bottom v-model="snackbar" :color="color">
          {{message}}
        </v-snackbar>
    </v-container>
</template>

<script>
import axios from 'axios';

//eslint-disable-next-line
const pinRe = /^(?!(.)\1{3})(?!19|20)\d{4}$/i;

import {
  WRONG_PIN,AMOUNT_LESS_MIN
} from '../config/err_code';

export default {
    name:'Requests',
    mounted(){
        axios.get('/api/wallet/requests').then(res=>{
            this.requests = res.data.requests.map(item=>{
                if(item.status== 'waiting'){
                    item.vstatus = this.$i18n.t('requestWaiting');
                }else if(item.status == 'cancel'){
                    item.vstatus = this.$i18n.t('requestCancel');
                }else if(item.status == 'complete'){
                    item.vstatus = this.$i18n.t('requestComplete');
                }

                return item;
            });
        })
    },
    data(){
        return {
            requests:[],
            pinDialog:false,
            pin:'',
            valid:false,
            selectedRequest:'',
            loading:false,
            snackbar:false,
            color:'',
            message:'',
            approve:false,
        }
    },
    methods:{
        onSelect(id,approve=true){
          this.selectedRequest = id;
          this.pinDialog = true;

          this.approve = approve;
        },
        validatePin(v){
            return pinRe.test(v);
        },
        handleApprove(){

          this.$refs.form.validate();

          if(!this.valid){

            this.snackbar = true;
            this.color = 'error';
            this.message = this.$i18n.t('checkFields');

            return
          }

          this.loading = true;


          if(this.approve){

              axios.post('/api/wallet/request/approve',{
                requestId:this.selectedRequest,
                pin:this.pin
              }).then(res=>{
                  this.loading = false;

                  let {error,errMsg} = res.data;

                  if(error){

                    if(errMsg ==WRONG_PIN){
                    this.snackbar = true;
                    this.color = 'error';
                    this.message = this.$i18n.t('wrongPin')

                  }else if(errMsg == AMOUNT_LESS_MIN){
                    this.snackbar = true;
                    this.color = 'error';
                    this.message = this.$i18n.t('lowBalance')
                  }else {
                  this.snackbar = true;
                  this.color = 'error';
                  this.message = this.$i18n.t('errorMessage')
                }

                  }else{
                    this.snackbar = true;
                    this.color ='success';
                    this.message = this.$i18n.t('paymentComplete');

                    this.requests = this.requests.filter(item => item._id != this.selectedRequest)
                    this.pinDialog = false;
                  }
              }).catch(err=>{
                console.log(err);

                this.snackbar = true;
                this.color = 'error';
                this.message = this.$i18n.t('errorMessage')
              })
            }else{

                axios.post('/api/wallet/request/delete',{
                requestId:this.selectedRequest,
                pin:this.pin
              }).then(res=>{
                  this.loading = false;

                  let {error,errMsg} = res.data;

                  if(error){

                    if(errMsg ==WRONG_PIN){
                    this.snackbar = true;
                    this.color = 'error';
                    this.message = this.$i18n.t('wrongPin')

                  }else {
                  this.snackbar = true;
                  this.color = 'error';
                  this.message = this.$i18n.t('errorMessage')
                }

                  }else{
                    this.snackbar = true;
                    this.color ='warning';
                    this.message = this.$i18n.t('deleteSuccessful');

                    this.requests = this.requests.filter(item => item._id != this.selectedRequest)
                    this.pinDialog = false;

                    this.$refs.form.reset();
                  }
              }).catch(err=>{
                console.log(err);

                this.snackbar = true;
                this.color = 'error';
                this.message = this.$i18n.t('errorMessage')
              })
            }
          }

          
    },
}
</script>

