<template>
    <v-container>
        
       <v-card color="blue white--text">
           <v-card-title>{{$t('merchantLocationsText')}}</v-card-title>

     

          <l-map style="height: 300px;z-index:0" :zoom="12" :center="this.location">
        <l-tile-layer :url="url">
        </l-tile-layer>
        <l-marker :lat-lng="location" ></l-marker>
        <l-marker :lat-lng="[location[0]-0.2,location[1]]" ></l-marker>
        </l-map>
       </v-card>

    
    </v-container>
</template>

<script>

import { LMap, LTileLayer,LMarker } from "vue2-leaflet";

export default {
    name:'Locations',
    components: {
    LMap,
    LTileLayer,
    LMarker,
  },
    data(){
        return {
            location:[0,0],
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        }
    },
    created(){
     navigator.geolocation.getCurrentPosition(pos => {
      this.location = [pos.coords.latitude,pos.coords.longitude];
    }, err => {
      console.log(err)
      this.location = [10,10]
    })
    },
    methods:{
       zoomUpdated (zoom) {
      this.zoom = zoom;
    },
    centerUpdated (center) {
      this.center = center;
    },
    boundsUpdated (bounds) {
      this.bounds = bounds;
    }
    }
}
</script>