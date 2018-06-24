import Vuex from 'vuex';
import Vue from 'vue';
import axios from 'axios';
import indexstore from './modules/indexstore';


Vue.use(Vuex);

const store = new Vuex.Store({
    modules:{
        indexstore        
    }
})

  
 export default store