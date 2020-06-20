<template>
    <v-container>
        <v-select
            v-model="amount"
            :label="$t('amount')"
            :items="[
            
                {
                    text:'5$',
                    value: 5
                },
                {
                    text:'10$',
                    value: 10
                },
                {
                    text:'15$',
                    value: 15
                },
                {
                    text:'25$',
                    value: 25
                },
                {
                    text:'50$',
                    value:50
                },
                {
                    text:'100$',
                    value:100
                }
            ]"

        />

        <div class="d-flex justify-center">

            <v-progress-circular
                        v-if="loading"
                        :indeterminate="true"
                        size="40"
                        color="#66a6ff"
            ></v-progress-circular>

            <v-btn @click.stop="handlePayment" v-else dark color="light-blue">{{$t('continue')}}</v-btn>

        </div>

        <v-alert v-model="paymentSuccess" class="mt-5" type="success">
            {{$t('paymentSuccess')}}
        </v-alert>

        <v-alert v-model="paymentFail" class="mt-5" type="error">
            {{$t('paymentCancel')}}
        </v-alert>

        <v-snackbar left bottom v-model="snackbar" :color="color">
          {{message}}
        </v-snackbar>
    </v-container>
</template>

<script>
import axios from 'axios';

import {
    AMOUNT_LESS_MIN, //eslint-disable-line
} from '../config/err_code';

export default {
    name:'DepositPaypal',
    mounted(){

        if(this.$route.query.payment == 'success'){
            this.paymentSuccess = true;
        }


        if(this.$route.query.payment == 'fail'){
            this.paymentFail = true;
        }
    },
    data(){
        return {
            amount:'',
            loading:false,
            snackbar:false,
            color:'',
            message:'',
            paymentSuccess:false,
            paymentFail:false
        }
    },
    methods:{
        handlePayment(){

            if(!this.amount){
                this.snackbar = true;
                this.color = 'error';
                this.message = this.$i18n.t('amountRequired');

                return;
            }

            this.loading = true;

            axios.post('/api/wallet/paypal/create_payment',{
                amount:this.amount
            }).then(res=>{
                
                this.loading = false;
                window.location.href = res.data.approvalUrl
            })
        }
    }
}
</script>