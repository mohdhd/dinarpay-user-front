<template>
    <v-app>
        <v-layout class="pa-5" fill-height justify-center align-center>
            <v-card class="pa-5" width="600">
                <div class="d-flex justify-center">
                    <v-card-title class="grey--text text--darken-1">{{$t('signup')}} </v-card-title>
                </div>
                <v-card-text>

                    <v-form ref="form" v-model="valid" @submit.prevent="handleSubmit">
                            <v-text-field
                            :label="$t('name')"
                            :rules="[
                                    v => !!v|| $t('usernameRequired'),
                                    ]"
                            v-model="name"
                            ></v-text-field>

                            <v-row>
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

                            <v-text-field
                            :label="$t('pin')"
                            type="password"
                            v-model="pin"
                            :rules="[
                            v => !!v || $t('PINRequired'),
                            v => validatePin(v) || $t('invalidPIN')
                            ]"
                            ></v-text-field>

                            <v-spacer class="mt-4" />

                            

                            <p>{{$t('haveAccountText')}} <router-link style="text-decoration:none" to="/login">{{$t('login')}}</router-link></p>

                            <v-spacer></v-spacer>

                             <div class="d-flex justify-center">
                                 <v-progress-circular
                                v-if="loading"
                                :indeterminate="true"
                                size="40"
                                color="#66a6ff"
                            ></v-progress-circular>

                            <v-btn v-else type="submit" dark block color="#66a6ff">{{$t('signup')}}</v-btn>
                             </div>
                    </v-form>
                </v-card-text>
            </v-card>

            <v-snackbar v-model="snackbar" :color="color" bottom left>
                {{messsage}}
            </v-snackbar>
        </v-layout>
    </v-app>
</template>

<script>
import axios from 'axios';
import {codes} from '@/config.js';

//error codes
import {ACC_EXIST} from '../config/err_code';

//eslint-disable-next-line
const phoneRe = /^[1-9]\d{7}$|^[1-9]\d{8}$|^[1-9]\d{9}$/im;
//eslint-disable-next-line
const pinRe = /^(?!(.)\1{3})(?!19|20)\d{4}$/i;

export default {
    name:'Register',
    mounted(){
    axios.get('https://ipapi.co/json/').then(res=>{
        this.countryCode = res.data.country_calling_code
    })

    this.codes = codes.map(item=>{
        return '+' + item;
    })

    this.$fingerprint.get((components) => {
                this.fingerprint = this.$fingerprint.x64hash128(components.map((pair) => { return pair.value }).join(), 31)
                
        });

    },
    data(){
        return {
            name:'',
            phone:'',
            password:'',
            countryCode:'',
            pin:'',
            codes:[],
            loading:false,
            snackbar:false,
            messsage:'',
            color:'',
            valid:false,
            fingerprint:''
        }
    },

    methods:{
        handleSubmit(){
            if(!this.valid){
                this.snackbar = true;
                this.color = 'error';
                this.messsage = this.$i18n.t('checkFields');
                return
            }
            this.loading = true;
            let phoneWithCode = this.countryCode + this.phone;
            axios.post('/api/wallet/signup',{
                username:this.name,
                phone:phoneWithCode,
                password:this.password,
                pin:this.pin,
                fingerprint:this.fingerprint

            }).then(res=>{
                this.loading = false;
                let {error,errMsg} = res.data;

                if(error){
                    if(errMsg == ACC_EXIST){
                        this.snackbar = true;
                        this.color = 'error';
                        this.messsage = this.$i18n.t('accountExistError')
                    }
                }else{
                    this.snackbar = true;
                    this.color = 'success';
                    this.messsage = this.$i18n.t('createdSuccessfully')
                    this.$refs.form.reset();
                    setTimeout(()=>this.$router.push('/login'),1300)
                }
            }).catch(err=>{
                console.log(err)
                this.snackbar = true;
                this.messsage = this.$i18n.t('errorMessage');
                this.color = 'error';
                this.loading =false;
            })
        },
        validatePhone(v){
            return phoneRe.test(v);
        },
        validatePin(v){
            return pinRe.test(v);
        }
    }

}
</script>

<style scoped>
#app{
background-image: linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%);
}
</style>