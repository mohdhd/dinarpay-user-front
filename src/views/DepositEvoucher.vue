<template>
    <v-container>

        <h4 class="grey--text text--darken-2">{{$t('depositEvoucher')}}</h4>

        <v-form ref="form" @submit.prevent="handleSubmit" v-model="valid">
        <v-text-field
          :label="$t('evoucherToken')"
          v-model="token"
          :rules="[
              v => !!v || $t('tokenRequired')
          ]"
        ></v-text-field>

        <div class="mt-5 d-flex justify-center">

            <v-progress-circular
                        v-if="loading"
                        :indeterminate="true"
                        size="40"
                        color="#66a6ff"
            ></v-progress-circular>

            <v-btn v-else type="submit" dark color="light-blue">{{$t('deposit')}}</v-btn>
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
    EXP_EVOUCHER,NO_EVOUCHER,
} from '../config/err_code';

export default {
    name:'DepositEvoucher',
    //eslint-disable-next-line
    data(){
        return {
            token:'',
            snackbar:false,
            color:'',
            message:'',
            loading:false,
            valid:false
        }
    },
    methods:{
        handleSubmit(){

          this.$refs.form.validate();

          if(!this.valid){
              return
          }

          this.loading = true;

          axios.post('/api/wallet/deposit/evoucher',{
            token:this.token.trim()
          }).then(res=>{
            this.loading = false;
            let {error,errMsg} = res.data;

            if(error){
              if(errMsg ==NO_EVOUCHER){
                this.snackbar = true;
                this.color = 'error';
                this.message = this.$i18n.t('noEvoucher')

              }else if(errMsg == EXP_EVOUCHER){
                this.snackbar = true;
                this.color = 'error';
                this.message = this.$i18n.t('expiredEvoucher')

              }
            }else{
                this.$refs.form.reset();
                this.loading = false;
                this.snackbar = true;
                this.color = 'success';
                this.message = this.$i18n.t('depositSuccess')
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