<template>
    <v-app>
        <v-layout class="pa-4" fill-height justify-center align-center>
            <v-card width="650">

                <v-card-title>{{$t('userInfo')}}</v-card-title>

                <v-card-text>
                    
                    <div class="d-flex">
                        <v-text-field
                    :label="$t('privateKey')"
                    readonly
                    prepend-icon="fas fa-key"
                    v-model="privateKey"
                    ></v-text-field>

                    <v-btn @click="copy" tile icon class="mt-6">
                        <v-icon size="20">fas fa-clipboard</v-icon>
                    </v-btn>
                    </div>

                    <p style="font-size:17px">{{$t('privateKeyText')}}</p>
                </v-card-text>

                <v-spacer class="my-3" />

                <v-card-actions class="d-flex justify-center">
                    <v-btn to="/" dark color="light-blue">
                        {{$t('continue')}}
                    </v-btn>
                </v-card-actions>
            </v-card>

            <v-snackbar left bottom v-model="snackbar" :color="color">
            {{message}}
            </v-snackbar>
        </v-layout>
    </v-app>
</template>

<script>
import axios from 'axios';
export default {
    name:'PrivateKey',
    mounted(){
        axios.get('/api/wallet/privatekey/'+this.$route.params.id).then(res=>{
            this.privateKey = res.data.privateKey

            if(res.data.error){
                this.snackbar = true;
                this.color = 'error';
                this.message = this.$i18n.t('errorMessage')
            }
        })

        window.onbeforeunload = function(){
                return "Are you sure you want to close the window?";
            }
    },
    data(){
        return {
            privateKey:'',
            snackbar:false,
            color:'',
            message:''
        }
    },
    methods:{
        copy(){
            this.$copyText(this.privateKey);
            this.snackbar = true;
            this.color = 'success';
            this.message = this.$i18n.t('copySuccessful')
        }
    }
}
</script>