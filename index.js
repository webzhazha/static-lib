
// 引入config文件
import './lib/config/ele.js'
import './lib/config/nutui.js'
import './lib/config/rem.js'
import './lib/config/vant.js'
console.log('执行');

// 引入全局指令
import './directives/index.js'

// 引入全局过滤器
import './filters/index.js'

// 引入mixins全局
import mixins from './mixins/index.js'

// 引入plugins文件
import './plugins/fastclick/'
import './plugins/axios.js'
import './plugins/prototype.js'
import './plugins/components.js'
import router from './plugins/vueRouter'

export {
  minxins,
  router
}