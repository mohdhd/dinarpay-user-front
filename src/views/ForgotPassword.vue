<template>
    <v-app>
        <v-layout class="pa-5" fill-height justify-center align-center>
            <v-card class="pa-5" width="600">
                <div class="d-flex justify-center">
                    <v-card-title class="grey--text text--darken-1">{{$t('passwordRecovery')}} </v-card-title>
                </div>
                <v-card-text>
                    
                <v-form  @submit.prevent="checkPrivatekey" v-if="!validPrivatekey" v-model="valid" ref="form">
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

                   <v-form v-else ref="passForm" @submit.prevent="handleSubmit" v-model="valid">
                            <v-text-field
                            :label="$t('newPass')"
                            v-model="newPass"
                            type="password"
                            :rules="[
                            v => !!v || $t('passwordRequired'),
                            v => v.length >= 8 || $t('minPassword')
                            ]"
                            ></v-text-field>

                            <v-text-field
                            :label="$t('confirmPass')"
                            type="password"
                            v-model="confirmPass"
                            :rules="[
                            v => !!v || $t('passwordRequired'),
                            v => checkPass(v) || $t('noPassMatch')
                            ]"
                            ></v-text-field>

                    <v-spacer class="mt-4" />

                    


                    <v-spacer></v-spacer>

                    <div v-if="loading" class="d-flex justify-center">
                                 <v-progress-circular
                                :indeterminate="true"
                                size="40"
                                color="#66a6ff"
                    ></v-progress-circular>

                    </div>
                        
                     <v-btn class="mt-3" v-else type="submit" dark block color="#66a6ff">{{$t('confirm')}}</v-btn>
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
            privateKey:''
        }
    },
    methods:{
        handleSubmit(){
            this.$refs.passForm.validate();

            if(!this.valid){
                this.snackbar = true;
                this.color = 'error';
                this.message = this.$i18n.t('checkFields');
                return
            }
        this.loading = true;

        axios.post('/api/wallet/recover',{
            password:this.newPass,
            privateKey:this.privateKey
        }).then(res=>{
            let {error} = res.data;
            this.loading = false;
            if(error){
                this.snackbar = true;
                this.color = 'error';
                this.message = this.$i18n.t('errorMessage');
            }else{
                this.snackbar = true;
                this.color = 'success';
                this.message = this.$i18n.t('changeSuccessful');

                this.$refs.passForm.reset();

                this.validPrivatekey = false;
                this.privateKey = '';

                setTimeout(()=>this.$router.push('/login'),1200)
            }
        }).catch(err=>{
            this.loading = false;
            console.log(err)
             this.snackbar = true;
            this.color = 'error';
            this.message = this.$i18n.t('errorMessage')
        })
        },

        checkPass(v){
            if(v !== this.newPass){
                return false
            }else{
                return true;
            }
        },
        checkPrivatekey(){

            this.$refs.form.validate();

            if(!this.valid){
                this.snackbar = true;
                this.color = 'error';
                this.message = this.$i18n.t('checkFields');
                
                return;
            }

            this.loading = true;

            axios.post('/api/wallet/privatekey/check',{
                privateKey:this.privateKey.trim()
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
                    this.validPrivatekey = true;
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