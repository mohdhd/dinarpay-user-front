<template>
  <v-container>
    <h3 class="grey--text text--darken-1 text-center">{{$t('depositHeaderText')}}</h3>

    <v-row>
      <v-col 
        v-for="item in options"
        :key="item.title"
        cols="12"
        sm="6"
        lg="4">

        <v-card
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
export default {
  name: "Deposit",
  data() {
    return {
      options: [
        {
          title: this.$i18n.t('paypal'),
          icon: "fab fa-paypal",
          color: "indigo",
          to:'/deposit/paypal'
        },
        {
            title:this.$i18n.t('creditCard'),
            color:"light-blue darken-1",
            icon:"fas fa-credit-card",
            to:'/deposit/credit'
        },
        {
            title:this.$i18n.t('bitcoin'),
            color:'orange',
            icon:'fab fa-btc',
            to:'/deposit/bitcoin'
        },
        {
            title:this.$i18n.t('ethereum'),
            color:'purple darken-3',
            icon:'fab fa-ethereum',
            to:'/deposit/eth'
        },
        {
            title:this.$i18n.t('bank'),
            color:'indigo lighten-1',
            icon:'fas fa-university'
        },
        {
            title:this.$i18n.t('evoucher'),
            color:"red darken-2",
            icon:'fas fa-hand-holding-usd',
            to:'/deposit/evoucher'
        }
      ]
    };
  }
};
</script>