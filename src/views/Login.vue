<template>
    <v-app>
        <v-layout class="pa-5" fill-height justify-center align-center>
            <v-card class="pa-5" width="600">
                <div class="d-flex justify-center">
                    <v-card-title class="grey--text text--darken-1">{{$t('login')}} </v-card-title>
                </div>
                <v-card-text>
                   <v-form @submit.prevent="handleSubmit" v-model="valid">
                        <v-row style="direction:ltr">
                        <v-col class="px-0" cols="4">
                            <v-select
                                v-model="countryCode"
                                :label="$t('countryCode')"
                                :items="codes"
                                 />
                        </v-col>

                                <v-col cols="8">
                                    <v-text-field
                                    :label="$t('phone')"
                                    v-model="phone"
                                    :rules="[
                                    v => !!v|| $t('phoneRequired'),
                                    v => validatePhone(v) || $t('invalidPhone')
                                    ]"
                                    ></v-text-field>
                                </v-col>
                            </v-row>

                            <v-text-field
                            :label="$t('password')"
                            type="password"
                            v-model="password"
                            :rules="[
                            v => !!v || $t('passwordRequired'),
                            v => v.length >= 8 || $t('minPassword')
                            ]"
                            ></v-text-field>

                    <v-spacer class="mt-4" />

                    

                    <p>{{$t('noAccountText')}} <router-link style="text-decoration:none" to="/signup">{{$t('createAccount')}}</router-link></p>

                    <v-spacer></v-spacer>

                     <p><router-link style="text-decoration:none" to="/forgot-password">{{$t('forgotPassword')}}</router-link></p>
                    <div v-if="loading" class="d-flex justify-center">
                                 <v-progress-circular
                                :indeterminate="true"
                                size="40"
                                color="#66a6ff"
                    ></v-progress-circular>

                    </div>
                        
                     <v-btn v-else type="submit" dark block color="#66a6ff">{{$t('login')}}</v-btn>
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
import {codes} from '@/config.js';

//error codes
import {NO_ACC,WRONG_PASS} from '../config/err_code';

//eslint-disable-next-line
const phoneRe = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,6}$/im;

import {login} from '@/auth.js'

export default {
    name:'Login',
    mounted(){
    axios.get('https://ipapi.co/json/').then(res=>{
        this.countryCode = res.data.country_calling_code
    })

    this.codes = codes.map(item=>{
        return '+' + item;
    })
    },
    data(){
        return {
            countryCode:'',
            phone:'',
            password:'',
            valid:false,
            snackbar:false,
            color:'',
            message:'',
            codes:[],
            loading:false
        }
    },
    methods:{
        validatePhone(v){
            return phoneRe.test(v);
        },
        handleSubmit(){
            if(!this.valid){
                this.snackbar = true;
                this.color = 'error';
                this.message = this.$i18n.t('checkFields');
                return
            }
        this.loading = true;

        axios.post('/api/wallet/login',{
            phone:this.countryCode +this.phone,
            password:this.password
        }).then(res=>{
            let {error,message} = res.data;
            if(error){
                this.loading = false;
                if(message.message == NO_ACC){
                    this.snackbar = true;
                    this.color = 'error';
                    this.message = this.$i18n.t('noAccount')
                }else if(message.message == WRONG_PASS){
                    this.snackbar = true;
                    this.color = 'error';
                    this.message = this.$i18n.t('wrongPassword')
                }else{
                    this.snackbar = true;
                    this.color = 'error';
                    this.message = this.$i18n.t('errorMessage')
                }
            }else{
                let {token,user} = res.data;
                login(user,token,()=>{
                    this.loading = false;
                    axios.defaults.headers.common = {
                        Authorization:`Bearer ${token}`
                    }
                    if(res.data.firstLogin){
                        this.$router.push('/user/' + user.id)
                    }else{
                        window.location.href = '/'
                    }
                    
                });

            }
        }).catch(err=>{
            this.loading = false;
            console.log(err)
             this.snackbar = true;
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