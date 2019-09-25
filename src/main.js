import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/css/index.less'

import {
  Button,
  Table,
  Input,
  Select,
  Message,
  Alert,
  Tag,
  Icon,
  Modal,
  Form,
  FormItem,
  Option
} from 'iview'

Vue.component('Button', Button)
Vue.component('Table', Table)
Vue.component('Input', Input)
Vue.component('Select', Select)
Vue.component('Message', Message)
Vue.component('Alert', Alert)
Vue.component('Tag', Tag)
Vue.component('Icon', Icon)
Vue.component('Modal', Modal)
Vue.component('Form', Form)
Vue.component('Form', Form)
Vue.component('FormItem', FormItem)
Vue.component('Option', Option)

Vue.prototype.$Message = Message
Vue.prototype.$Modal = Modal

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
