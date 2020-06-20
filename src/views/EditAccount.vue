<template>
    <v-container>

        <h4 class="mt-4 grey--text text--darken-2">{{$t('changePassword')}}</h4>

        <v-form ref="passwordForm" v-model="passwordForm">
             <v-text-field
            :label="$t('currentPass')"
            v-model="currentPass"
            type="password"
            :rules="[
                v => !!v || $t('passwordRequired'),
                v => v.length >= 8 || $t('minPassword')
            ]"
            ></v-text-field>

            <v-text-field
            :label="$t('newPass')"
            v-model="newPass"
            type="password"
            :rules="[
                v => !!v || $t('passwordRequired'),
                v => v.length >= 8 || $t('minPassword')
            ]"
            ></v-text-field>

            <v-btn 
            v-if="!passwordLoading" 
            :disabled="loading" 
            dark 
            color="light-blue"
            @click.stop="changePassword"
            class="mt-4"
            >{{$t('change')}}</v-btn>

            <div v-else class="d-flex justify-center mt-4">
                    <v-progress-circular
                        :indeterminate="true"
                        size="40"
                        color="#66a6ff"
                    ></v-progress-circular>
            </div>
        </v-form>

        <h4 class="mt-10 grey--text text--darken-2">{{$t('changePin')}}</h4>

        <v-form ref="pinForm" v-model="pinForm">
             <v-text-field
            :label="$t('password')"
            v-model="pinPass"
            type="password"
            :rules="[
                v => !!v || $t('passwordRequired'),
                v => v.length >= 8 || $t('minPassword')
            ]"
            ></v-text-field>

            <v-text-field
            :label="$t('newPin')"
            v-model="newPin"
            type="password"
            :rules="[
                v => !!v || $t('PINRequired'),
                v => validatePin(v) || $t('invalidPIN')
            ]"
            ></v-text-field>

             <v-btn 
            v-if="!pinLoading" 
            :disabled="loading" 
            dark 
            color="light-blue"
            @click.stop="changePin"
            class="mt-4"
            >{{$t('change')}}</v-btn>

            <div v-else class="d-flex justify-center mt-4">
                    <v-progress-circular
                        :indeterminate="true"
                        size="40"
                        color="#66a6ff"
                    ></v-progress-circular>
            </div>
        </v-form>

        <v-snackbar left bottom v-model="snackbar" :color="color">
          {{message}}
        </v-snackbar>
    </v-container>
</template>

<script>
import axios from 'axios';

import {WRONG_PASS} from '../config/err_code';

//eslint-disable-next-line
const pinRe = /^(?!(.)\1{3})(?!19|20)\d{4}$/i;

export default {
    name:"EditAccount",
    mounted(){
        axios.get('/api/wallet/info').then(res=>{
            this.name = res.data.name;
        })
    },
    data(){
        return {
            name:'',
            passwordForm:false,
            nameForm:false,
            currentPass:'',
            newPass:'',
            pinPass:'',
            newPin:'',
            snackbar:false,
            color:'',
            message:'',
            nameLoading:false,
            loading:false,
            passwordLoading:false,
            pinForm:'',
            pinLoading:false
        }
    },
    methods:{
        changeName(){

            this.$refs.nameForm.validate();

            if(!this.nameForm){
                this.snackbar = true;
                this.color = 'error';
                this.message = this.$i18n.t('checkFields');
                return
            }

            this.nameLoading = true;
            this.loading = true;

            axios.post('/api/wallet/info',{
                name:this.name
            }).then(res=>{
                this.nameLoading = false;
                this.loading= false;

                if(res.data.error){
                    this.snackbar = true;
                    this.color = 'error';
                    this.message = this.$i18n.t('errorMessage');
                }else{
                    this.snackbar = true;
                    this.color = 'success';
                    this.message = this.$i18n.t('changeSuccessful')
                }
            }).catch(err=>{
                console.log(err)
                this.loading = false;
                this.nameLoading= false;
                this.snackbar = true;
                this.color = 'error';
                this.message = this.$i18n.t('errorMessage');
            })
        },
        changePassword(){

            this.$refs.passwordForm.validate();

            if(!this.passwordForm){
                this.snackbar = true;
                this.color = 'error';
                this.message = this.$i18n.t('checkFields');
                return;
            }

            this.loading = true;
            this.passwordLoading = true;

            axios.post('/api/wallet/change-password',{
                currentPassword:this.currentPass,
                newPassword:this.newPass
            }).then(res=>{
                this.loading = false;
                this.passwordLoading = false;

                let {error,errMsg} = res.data;

                if(error){

                    if(errMsg == WRONG_PASS){
                        this.snackbar = true;
                        this.color = 'error';
                        this.message = this.$i18n.t('wrongPassword');
                    }
                }else{
                        this.snackbar = true;
                        this.color = 'success';
                        this.message = this.$i18n.t('changeSuccessful')
                }

            }).catch(err=>{
                console.log(err)
                console.log(err)
                this.loading = false;
                this.passwordLoading= false;
                this.snackbar = true;
                this.color = 'error';
                this.message = this.$i18n.t('errorMessage');
            })
        },
        changePin(){
            this.$refs.pinForm.validate();

            if(!this.pinForm){
                this.snackbar = true;
                this.color = 'error';
                this.message = this.$i18n.t('checkFields');
                return;
            }

            this.loading = true;
            this.pinLoading = true;

            axios.post('/api/wallet/change-pin',{
                currentPassword:this.pinPass,
                newPIN:this.newPin
            }).then(res=>{
                this.loading = false;
                this.pinLoading = false;

                let {error,errMsg} = res.data;

                if(error){

                    if(errMsg == WRONG_PASS){
                        this.snackbar = true;
                        this.color = 'error';
                        this.message = this.$i18n.t('wrongPassword');
                    }
                }else{
                        this.snackbar = true;
                        this.color = 'success';
                        this.message = this.$i18n.t('changeSuccessful')
                }

            }).catch(err=>{
                console.log(err)
                console.log(err)
                this.loading = false;
                this.passwordLoading= false;
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

<style scoped>

</style>