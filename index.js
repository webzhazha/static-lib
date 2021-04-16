// 引入config文件
import './lib/config/ele.js'
import './lib/config/rem.js'
console.log('执行');

// 引入全局指令
import './lib/directives/index.js'

// 引入全局过滤器
import './lib/filters/index.js'


// 引入plugins文件
import './lib/plugins/fastclick/'
import './lib/plugins/axios.js'
import './lib/plugins/prototype.js'
import router from './lib/plugins/vueRouter'

// 引入utils文件
import * as util from './lib/utils/util.js'
console.log(util);
export {
  router,
  util
}