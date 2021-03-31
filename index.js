
// 引入config文件
import './lib/config/ele.js'
import './lib/config/nutui.js'
import './lib/config/rem.js'
import './lib/config/vant.js'
console.log('执行');

// 引入全局指令
import './lib/directives/index.js'

// 引入全局过滤器
import './lib/filters/index.js'

// 引入mixins全局
import mixins from './lib/mixins/index.js'

// 引入plugins文件
import './lib/plugins/fastclick/'
import './lib/plugins/axios.js'
import './lib/plugins/prototype.js'
import './lib/plugins/components.js'
import router from './lib/plugins/vueRouter'

export {
  mixins,
  router
}