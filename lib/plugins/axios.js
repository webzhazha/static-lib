import Vue from 'vue'
import axios from 'axios'
import store from '@/store/store'
import { getUrlParam, getAppToken, getSafeCid, transCityId, isInWechatMP } from '@/utils/util'

const instance = axios.create()
const customizeInstance = axios.create({
  headers: {
    'Cache-Control': 'no-cache',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

function addParamsToUrl(config, name, value) {
  if (config.url.indexOf('?') > -1) {
    config.url += '&' + name + '=' + value
  } else {
    config.url += '?' + name + '=' + value
  }
  return config
}

function requestConfig(configObj) {
  const config = configObj
  var vapp = getUrlParam('vapp')
  var cid = getSafeCid()
  var city_id = getUrlParam('city_id')
  var qqHealthOpenId = getUrlParam('qqHealthOpenId')
  // 所有请求添加qqHealthOpenId腾讯获取订单状态回传
  if (qqHealthOpenId) {
    addParamsToUrl(config, 'qqHealthOpenId', qqHealthOpenId)
  }
  // 所有请求添加app版本号
  if (vapp) {
    addParamsToUrl(config, 'vapp', vapp)
  }
  // 所有请求添加城市id
  if (city_id) {
    // 转换城市ID , 兼容微信城市服务
    city_id = transCityId(city_id)
    if (config.url.indexOf('city_id') == -1) {
      // 如果没有带参数，默认加上 city_id
      if (!config.params) {
        addParamsToUrl(config, 'city_id', city_id)
      }
      // 如果参数中没有 city_id，则加上 city_id
      if (config.params && !config.params.city_id) {
        addParamsToUrl(config, 'city_id', city_id)
      }
    }
  }
  if (config.url.indexOf('cid') == -1) {
    addParamsToUrl(config, 'cid', cid)
  }
  if (typeof (mJavaScriptObject) === 'object' && !config.url.includes('jstoken')) {
    addParamsToUrl(config, 'jstoken', encodeURIComponent(getAppToken(cid)))
  }
  if(isInWechatMP()) {
    const user_key = getUrlParam('user_key') || ''
    if(user_key) {
      addParamsToUrl(config, 'user_key', user_key)
    }
  }
  store.dispatch('COMMON_LOADING_SHOW')

  return config
}

function responseConfig(res) {
  const response = res
  if (response.config.params && response.config.params.specialJump) {
    return response
  }
  if (response.data.login == -1) { // 未登录
    console.log(response.config)
    window.location.href = '/user/login.html?redirect_url=' + encodeURIComponent(location.href)
    return
  }
  // 获取城市
  if (response.config.url.includes('main/ajaxcity.html')) {
    sensorsCustomize.$setCommonProps({
      custom_city_id: response.data.data.city_info.area_id,
      custom_city_name: response.data.data.city_info.area_name
    })
  }
  store.dispatch('COMMON_LOADING_HIDE')
  return response
}

function responseConfig_activity(res) {
  const response = res
  if (response.config.params && response.config.params.specialJump) {
    return response
  }
  // 登录状态失效
  if (response.data.result_code == 0) {
    if (response.data.error_code == 10001) {
      window.location.href = '/user/login.html?redirect_url=' + encodeURIComponent(location.href)
    }
  }
  if (response.data.login == -1) { // 未登录
    console.log(response.config)
    window.location.href = '/user/login.html?redirect_url=' + encodeURIComponent(location.href)
    return
  }
  store.dispatch('COMMON_LOADING_HIDE')
  return response
}

// 自定义请求头信息的 axios实例配置 拦截器信息
customizeInstance.interceptors.request.use((config) => {
  return requestConfig(config)
}, function(error) {
  return Promise.reject(error)
})
// 配置相应拦截器
customizeInstance.interceptors.response.use((response) => { // 配置请求回来的信息
  return responseConfig_activity(response)
}, function(error) {
  return Promise.reject(error)
})

// 配置发送请求的信息
instance.interceptors.request.use((config) => {
  return requestConfig(config)
}, function(error) {
  return Promise.reject(error)
})
// 配置相应拦截器
instance.interceptors.response.use((response) => { // 配置请求回来的信息
  return responseConfig(response)
}, function(error) {
  return Promise.reject(error)
})
instance.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

export { customizeInstance }

Vue.prototype.$http = instance
export default instance
