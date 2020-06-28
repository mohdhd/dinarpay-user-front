<template>
    <v-container>

    <div v-if="!show" class="d-flex justify-center align-center" style="height:200px;">
      <v-card class="mt-10" width="650" >
      <v-card-text>
        <v-text-field
          class="mt-8"
          :label="$t('pin')"
          type="password"
          v-model="pin"
          :rules="[
              v => !!v || $t('PINRequired'),
              v => validatePin(v) || $t('invalidPIN')
          ]"
      ></v-text-field>


      <div class="d-flex justify-center mt-5">
                <v-progress-circular
                            v-if="loading"
                            :indeterminate="true"
                            size="40"
                            color="#66a6ff"
                ></v-progress-circular>

                <v-btn @click.stop="checkPIN" v-else dark color="#66a6ff">{{$t('continue')}}</v-btn>



       </div>
                        

      </v-card-text>
    </v-card>
    </div>

    <v-card v-else class="mt-3 pa-4">
            <v-card-title>{{$t('evoucher')}}</v-card-title>

            <v-simple-table class="hidden-sm-and-down">
                    <template v-slot:default>
                    <thead>
                        <tr>
                        <th class="text-center">{{$t('token')}}</th>
                        <th class="text-center">{{$t('value')}}</th>
                        <th class="text-center">{{$t('date')}}</th>
                        <th class="text-center">{{$t('status')}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in evouchers" :key="item.id" >
                        <td class="text-center">{{item.token}}</td>
                        <td class="text-center">{{item.value}} {{item.currency}}</td>
                        <td class="text-center">{{$moment(item.createdAt).format('DD/MM/YY')}}</td>
                        <td class="text-center">{{(item.active) ? $t('active') : $t('expired')}}</td>
                        </tr>
                    </tbody>
                    </template>
        </v-simple-table>

        <div v-for="item in evouchers" :key="item.id" class="hidden-lg-and-up">
        <div class="grey--text text--darken-2 d-flex align-center">
          <span style="width:100px;display:inline-block;" class="mx-3">{{$t('token')}}</span>
          <span style="font-size:1.8vh">{{item.token}}</span>

        </div>
        <div class="grey--text text--darken-2">
          <span style="width:100px;display:inline-block" class="mx-3">{{$t('value')}}</span>
          <span>{{item.value}} {{item.currency}}</span>
        </div>
        <div class="grey--text text--darken-2">
          <span style="width:100px;display:inline-block" class="mx-3">{{$t('date')}}</span>
          <span>{{$moment(item.createdAt).format('DD/MM/YY')}}</span>
        </div>
        <div class="grey--text text--darken-2">
          <span style="width:100px;display:inline-block" class="mx-3">{{$t('status')}}</span>
          <span>{{(item.active) ? $t('active') : $t('expired')}}</span>
        </div>

        <v-divider class="my-2" />
      </div>

      </v-card>

      <v-snackbar left :color="color" v-model="snackbar">
        {{message}}
      </v-snackbar>

    </v-container>
</template>


<script>
import axios from 'axios';
const pinRe = /^(?!(.)\1{3})(?!19|20)\d{4}$/i;


export default {
    name:'Evoucher',
    mounted(){
        axios.get('/api/wallet/evouchers').then(res=>{
            this.evouchers = res.data.evouchers;
        })
    },
    data(){
        return {
            evouchers:[],
            pin:'',
            snackbar:false,
            color:'',
            message:'',
            show:false
        }
    },
    methods:{
      checkPIN(){
        if(!this.pin){
          
          this.snackbar = true;
          this.color = 'error';
          this.message = this.$i18n.t('PINRequired')
          return
        }

        this.loading = true;

        axios.post('/api/wallet/pin/check',{
          pin:this.pin
        }).then(res=>{
          this.loading = false;
          if(res.data.error){
            this.snackbar = true;
            this.color = 'error';
            this.message = this.$i18n.t('wrongPin')
          }else{
            this.show = true;
          }
        }).catch(err=>{
          console.log(err);

          this.loading = false;
          this.snackbar = true;
          this.color = 'error';
          this.message = this.$i18n.t('errorMessage');
        })
      },
      validatePin(v){
            return pinRe.test(v);
        }
    }
}
</script>