<template>
  <v-container>
    <v-overlay z-index="10" :value="overlay" color="#fff">
        <v-progress-circular indeterminate size="65" color="primary" />
    </v-overlay>

    <h3 class="grey--text text--darken-1 text-center">{{$t('depositHeaderText')}}</h3>

    <v-row>
      <v-col 
        v-for="item in options"
        :key="item.title"
        cols="12"
        sm="6"
        lg="4">

        <v-card
          :disabled="!settings[item.value]"
          height="20vh"
          :color="item.color"
          ripple
          :to="(item.to) ? item.to : ''"
          class="d-flex justify-center flex-column align-center pa-5 white--text"
        >
          <v-icon color="white" size="40">{{item.icon}}</v-icon>
          <div class="mt-3">{{item.title}}</div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: "Deposit",
  mounted(){
    this.overlay = true;
    axios.get('/api/admin/deposit_methods').then(res=>{
      this.settings = res.data.deposit;
      this.overlay = false;
    })
  },
  data() {
    return {
      settings:{},
      overlay:false,
      options: [
        {
          title: this.$i18n.t('paypal'),
          icon: "fab fa-paypal",
          color: "indigo",
          to:'/deposit/paypal',
          value:'paypal'
        },
        {
            title:this.$i18n.t('creditCard'),
            color:"light-blue darken-1",
            icon:"fas fa-credit-card",
            to:'/deposit/credit',
            value:'creditCard'
        },
        {
            title:this.$i18n.t('bitcoin'),
            color:'orange',
            icon:'fab fa-btc',
            to:'/deposit/bitcoin',
            value:'bitcoin'
        },
        {
            title:this.$i18n.t('ethereum'),
            color:'purple darken-3',
            icon:'fab fa-ethereum',
            to:'/deposit/eth',
            value:'ethereum'
        },
        {
            title:this.$i18n.t('bank'),
            color:'indigo lighten-1',
            icon:'fas fa-university',
            value:'bank'
        },
        {
            title:this.$i18n.t('evoucher'),
            color:"red darken-2",
            icon:'fas fa-hand-holding-usd',
            to:'/deposit/evoucher',
            value:'evoucher'
        }
      ]
    };
  }
};
</script>