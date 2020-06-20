<template>
    <v-container>
        <div v-if="!payment">
            <v-text-field
            :label="$t('amount')"
            v-model="amount"
            type="number"
            prepend-icon="fas fa-dollar-sign"
            @keyup="onChange"
            ></v-text-field>

        <v-text-field
            :label="$t('amount')"
            v-model="btc"
            prepend-icon="fab fa-btc"
            readonly
        ></v-text-field>

            <div class="d-flex justify-center">
                <v-progress-circular
                        v-if="loading"
                        :indeterminate="true"
                        size="40"
                        color="#66a6ff"
                    ></v-progress-circular>

                <v-btn v-else @click="createPayment" dark color="light-blue">
                    {{$t('continue')}}
                </v-btn>
            </div>
        </div>

        <div v-else>
            <v-card >
                <v-card-title>
                    {{$t('btcDeposit')}}
                </v-card-title>

                <v-card-text class="d-flex justify-center flex-column align-center">
                    <vue-qr bindElement :text="this.address" size="220" qid="testid"></vue-qr>

                    <p class="my-2">{{$t('cryptoDepositText')}}</p>
                </v-card-text>

                <v-card-text class="px-8">
                        
                    <div class="d-flex">
                        <v-text-field
                        :label="$t('btcAddress')"
                        v-model="this.address"
                        readonly=""
                    ></v-text-field>

                        <div class="mt-5">
                                <v-btn @click.stop="onCopy" icon tile>
                                    <v-icon size="23">fas fa-clipboard</v-icon>
                                </v-btn>
                        </div>
                    </div>

                    <v-text-field
                        :label="$t('amount')"
                        v-model="paymentAmount"
                        readonly=""
                    ></v-text-field>

                </v-card-text>
            </v-card>
        </div>

        <v-snackbar left bottom v-model="snackbar" :color="color">
          {{message}}
        </v-snackbar>
    </v-container>
</template>

<script>
import axios from 'axios';
import VueQr from 'vue-qr'

export default {
    name:'DepositBitcoin',
    components:{VueQr},

    data(){
        return {
            amount:'',
            btc:0,
            loading:false,
            snackbar:false,
            color:'',
            message:'',
            payment:false,
            address:'',
            paymentAmount:''
        }
    },
    methods:{
        onChange(){
            axios.get(`/api/wallet/btc/rates?amount=${this.amount}`).then(res=>{
                this.btc=res.data.rates.estimated_amount;
            })
        },
        createPayment(){
            if(!this.amount){
                this.snackbar = true;
                this.color = 'error';
                this.message = this.$i18n.t('checkFields')

                return;
            }

            this.loading= true;

            axios.get(`/api/wallet/btc/create?amount=${this.amount}`).then(res=>{
                this.loading = false;

                if(res.data.error){
                    this.snackbar = true;
                    this.color = 'error';
                    this.message = this.$i18n.t('amountLess')
                }else{
                    this.address =res.data.data.pay_address;
                    this.paymentAmount = res.data.data.pay_amount + ' BTC';
                    this.payment = true;
                }
            })
        },
        onCopy(){
            this.$copyText(this.address);
            this.snackbar = true;
            this.color='success';
            this.message = this.$i18n.t('copySuccessful')
        }
    }
}
</script>