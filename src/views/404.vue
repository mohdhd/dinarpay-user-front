<template>
    <v-app>
        <v-layout class="pa-4" fill-height justify-center align-center>
        <v-card width="640" class="pa-4">
            <v-card-text class="text-center d-flex">
                <v-img src="https://www.vippng.com/png/full/375-3750100_404-404-png.png"  />
            </v-card-text>

            <v-card-text style="font-size:22px" class="d-flex justify-center">
                {{$t('404Text')}}
            </v-card-text>

            <v-card-actions class="d-flex justify-center">
                <v-btn
                to="/"
                dark
                color="light-blue"
                >
                    {{$t('return')}}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-layout>
    </v-app>
</template>

<script>
export default {
    name:'404'
}
</script>