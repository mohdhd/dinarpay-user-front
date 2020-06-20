<template>
    <v-app>
        <v-layout class="pa-5" fill-height justify-center align-center>
            <v-card class="pa-5" width="600">
                <div class="d-flex justify-center">
                    <v-card-title class="grey--text text--darken-1">{{$t('enterPrivateKey')}} </v-card-title>
                </div>
                <v-card-text>
                    
                <v-form  @submit.prevent="checkPrivatekey" v-model="valid" ref="form">
                    <v-text-field
                        :label="$t('privateKey')"
                        v-model="privateKey"
                        :rules="[
                            v => !!v || $t('privatekeyRequired')
                        ]"></v-text-field>

                        <div class="d-flex justify-center">
                            <v-progress-circular
                                v-if="loading"
                                :indeterminate="true"
                                size="40"
                                color="#66a6ff"
                            ></v-progress-circular>

                            <v-btn class="mt-3" type="submit" color="light-blue" dark>{{$t('continue')}}</v-btn>
                        </div>
                </v-form>

                </v-card-text>
            </v-card>

            <v-snackbar left bottom :color="color" v-model="snackbar">
                {{message}}
            </v-snackbar>
        </v-layout>
    </v-app>
</template>

<script>
import axios from 'axios';
//error codes
import {WRONG_KEY} from '../config/err_code';

//eslint-disable-next-line
const phoneRe = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,6}$/im;


export default {
    mounted(){
        this.$fingerprint.get((components) => {
                this.fingerprint = this.$fingerprint.x64hash128(components.map((pair) => { return pair.value }).join(), 31)
                
                axios.post('/api/wallet/devices/check',{
                  fingerprint:this.fingerprint
                }).then(res=>{
                  if(!res.data.error){
                    this.$router.push('/')
                  }
                })
        });
    },
    name:'RecoverPassword',
    data(){
        return {
            valid:false,
            snackbar:false,
            color:'',
            message:'',
            loading:false,
            newPass:'',
            confirmPass:'',
            validPrivatekey:false,
            privateKey:'',
            fingerprint:''
        }
    },
    methods:{
        
        checkPrivatekey(){

            this.$refs.form.validate();

            if(!this.valid){
                this.snackbar = true;
                this.color = 'error';
                this.message = this.$i18n.t('checkFields');
                
                return;
            }

            this.loading = true;

            axios.post('/api/wallet/devices/add',{
                privateKey:this.privateKey.trim(),
                fingerprint:this.fingerprint
            }).then(res=>{
                this.loading = false;

                let {error,errMsg} = res.data;

                if(error){
                    if(errMsg ==WRONG_KEY){
                        this.snackbar= true;
                        this.color = 'error';
                        this.message = this.$i18n.t('wrongKey')
                    }
                }else{
                    this.$router.push('/')
                }
            }).catch(err=>{
                console.log(err);
                this.loading =false;
                this.snackbar= true;
                this.color = 'error';
                this.message = this.$i18n.t('errorMessage')
            })
        }
    }
}
</script>

<style scoped>
#app{
background-image: linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%);
}
</style>