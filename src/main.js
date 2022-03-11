import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElIconModules from '@element-plus/icons-vue'
// import Editor from '@tinymce/tinymce-vue'
import mavonEditor from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';

const app = createApp(App)
// app.component('mavonEditor', mavonEditor)
app.use(store).use(router).use(ElementPlus).use(mavonEditor).mount('#app')
app.use(ElementPlus, { size: 'small', zIndex: 2000 })
Object.keys(ElIconModules).forEach(function (key) {
    app.component(ElIconModules[key].name, ElIconModules[key])
})