import Vue from 'vue'
import GIO from '../wechat/js/gio.js'
import DataBI from '../wechat/js/dataBI.js'

Vue.prototype.urlFormat = (path, params) => { // 自动生成URL
  const origin = window.location.origin
  let queryString = ''
  origin.indexOf('loacalhost') == -1 ? origin : 'https://wap.91160.com'
  if (params) {
    queryString += '?'
    for (const k in params) {
      queryString += `${k}=${params[k]}&`
    }
  }
  return origin + path + queryString.slice(0, -1)
}

Vue.prototype.GIO = GIO
Vue.prototype.DataBI = DataBI
