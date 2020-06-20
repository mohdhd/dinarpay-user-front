import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import vuetify from './plugins/vuetify';
import i18n from './i18n';
import * as VueGoogleMaps from 'vue2-google-maps'
import VueClipboard from 'vue-clipboard2'
import 'leaflet/dist/leaflet.css';

import { Icon } from 'leaflet';

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

Vue.config.productionTip = false


Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyC2hF7KZWuIa-y4upfwn2weqep-YeJD8pk',
    libraries: 'places', // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)
 
    //// If you want to set the version, you can do so:
    // v: '3.26',
  },

})

import * as Fingerprint2 from 'fingerprintjs2'
Vue.prototype.$fingerprint = Fingerprint2;


Vue.use(require('vue-moment'));
Vue.use(VueClipboard)


new Vue({
  router,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')
