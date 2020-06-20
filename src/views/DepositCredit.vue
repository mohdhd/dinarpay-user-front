<template>
    <v-container>
       <v-card>
           <v-card-text>
                <card class='stripe-card'
      stripe='pk_test_kASeukE7o2jkdszhXYjHt26p00FPZnbDPM'
    />
           </v-card-text>
       </v-card>

        <v-select
            class="mt-4"
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

       <div class="d-flex justify-center mt-5">

            <v-progress-circular
                        v-if="loading"
                        :indeterminate="true"
                        size="40"
                        color="#66a6ff"
            ></v-progress-circular>

            <v-btn @click.stop="pay" v-else dark color="light-blue">{{$t('continue')}}</v-btn>

        </div>


        <v-alert v-model="paymentSuccess" class="mt-5" type="success">
            {{$t('paymentSuccess')}}
        </v-alert>


        <v-snackbar left bottom v-model="snackbar" :color="color">
          {{message}}
        </v-snackbar>
    </v-container>
</template>

<script>
//eslint-disable-next-line
import { Card, createToken } from 'vue-stripe-elements-plus'
import axios from 'axios';

export default {
    name:'DepositCredit',
    components: { Card },
    data(){
        return {
            snackbar:false,
            message:'',
            color:'',
            loading:false,
            amount:'',
            paymentSuccess:false
        }
    },
    methods:{
        pay(){

            if(!this.amount){
                this.snackbar = true;
                this.color = 'error';
                this.message = this.$i18n.t('amountRequired');
                return;
            }

            this.loading = true;
            createToken().then(data => {
                if(data.error){
                    this.snackbar = true;
                    this.color = 'error';
                    this.message = data.error.message;
                    this.loading = false;
                    return
                }

            
            axios.post('/api/wallet/stripe/create_payment',{
                token:data.token.id,
                amount:this.amount
            }).then(res=>{
               
               this.loading = false;

               if(res.data.error){
                   this.snackbar = true;
                   this.color = 'error';
                   this.message = this.$i18n.t('errorMessage');
               }else{
                   this.paymentSuccess = true;
                   this.amount = '';
               }
            }).catch(err=>{
                this.snackbar = true;
                this.color = 'error';
                this.message = this.$i18n.t('errorMessage');
                this.loading = false;
                console.log(err);
            })

            }).catch(err=>{
                this.snackbar = true;
                this.color = 'error';
                this.message = this.$i18n.t('incorrectCardInfo')
                console.log(err);
            })

        }
    }
}
</script>