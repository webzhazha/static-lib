import GlobalSetting from '@/config/GlobalSetting.js'
import { IMAGESDOMAIN } from '@/config/GlobalSetting.js'
import { routerMode } from '@/config/env.js'
import axios from 'axios'
const Base64 = require('js-base64').Base64

export const simpleObjectEqual = (obj1, obj2) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}

export const replaceWrap = str => {
  if (!str) return
  return str.replace(/\n/g, '<br>')
}

// 通过完善的逻辑安全的获取真实 cid。%E5%8F%AF%E7%9C%8B%E5%87%BA%20cid%20%E8%BF%99%E4%B8%AA%E5%9D%91%E6%9C%89%E5%A4%9A%E6%B7%B1%E3%80%82
export const getSafeCid = () => {
  const isAnd = navigator.userAgent.includes('cid=20')
  const isIos = navigator.userAgent.includes('cid=24')
  const iscid = isAnd ? '20' : (isIos ? '24' : '')
  const cid = iscid || (getUrlParam('cid') || readCookie('channel_id') || (isSureWeiXin() ? '23' : '16'))
  return cid
}

// 判断是否是小程序
export const isInWechatMP = () => {
  var ua = window.navigator.userAgent.toLowerCase()
  return (ua.match(/micromessenger/i) && ua.match(/miniprogram/i)) || window.__wxjs_environment === 'miniprogram'
}

// 判断是否微信
export const isSureWeiXin = () => {
  // window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
  var ua = window.navigator.userAgent.toLowerCase()
  // 通过正则表达式匹配ua中是否含有MicroMessenger字符串
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true
  } else {
    return false
  }
}

export const checkWeixin = () => {
  // navigator.userAgent 属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息
  var ua = navigator.userAgent.toLowerCase()
  // 通过正则表达式匹配ua中是否含有MicroMessenger字符串
  if (ua.match(/MicroMessenger/gi)) {
    const [isWeixin, version] = /MicroMessenger\/([0-9]+\.[0-9]+)/gim.exec(ua)
    return {
      isWeixin: !!isWeixin,
      version: parseInt(version, 10)
    }
  } else {
    return {
      isWeixin: false
    }
  }
}

export const wxRefresh = () => {
  const replaceQueryParam = (param, newVal, search) => {
    var regex = new RegExp('([?;&])' + param + '[^&;]*[;&]?')
    var query = search.replace(regex, '$1').replace(/&$/, '')
    return (query.length > 2 ? query + '&' : '?') + (newVal ? param + '=' + newVal : '')
  }
  let replaceString = ''
  const { protocol, host, pathname, hash, search } = location
  if (routerMode == 'hash') {
    replaceString = protocol + '//' + host + pathname + hash + replaceQueryParam('_r', new Date().getTime(), search)
  } else {
    protocol + '//' + host + pathname + replaceQueryParam('_r', new Date().getTime(), search) + hash
  }
  window.location.replace(replaceString)
}

// 简单的节流实现
export const throttle = (func, wait, mustRun) => {
  let timeout
  let startTime = new Date()
  return () => {
    const context = this
    const args = arguments
    const curTime = new Date()
    clearTimeout(timeout)
    // 如果达到了规定的触发时间间隔，触发 handler
    if (curTime - startTime >= mustRun) {
      func.apply(context, args)
      startTime = curTime
      // 没达到触发间隔，重新设定定时器
    } else {
      timeout = setTimeout(func, wait)
    }
  }
}

export const checkElementIntoView = (dom, offset = 0) => {
  const { top, y } = dom.getBoundingClientRect()
  const distance = top || y || 0
  return distance > 0 && distance <= window.innerHeight - offset
}

// 写cookies
export const setCookie = (name, value, days) => {
  var ndays = days || 0.2
  var exp = new Date()
  exp.setTime(exp.getTime() + ndays * 24 * 60 * 60 * 1000)
  var secure = document.location.protocol == 'https:' ? ';secure=true' : ''
  document.cookie = name + '_v2=' + Base64.encode(value) + ';expires=' + exp.toGMTString() + secure + ';path=/;domain=.91160.com'
}

export const getUrlParam = pname => {
  var index = location.href.indexOf('?')
  var params = location.href.substr(index + 1) // 获取参数 平且去掉？
  var ArrParam = params.split('&')
  // 多个参数参数的情况
  for (var i = 0; i < ArrParam.length; i++) {
    if (ArrParam[i].split('=')[0] == pname) {
      return ArrParam[i].substr(ArrParam[i].indexOf('=') + 1)
    }
  }
}

export const getVueReferrer = from => {
  let referrer = ''
  if (from.fullPath == '/' && document.referrer == '') {
    // 直接 url 进入页面，记录 referrer 为 ''
    referrer = ''
  }
  if (from.fullPath == '/' && document.referrer != '') {
    // 从某个页面进入，刷新当前 vue 页面，记录 referrer 为 document.referrer
    referrer = document.referrer
  }
  if (from.fullPath != '/' && document.referrer != '') {
    // 上一个页面是 vue 页面，记录 referrer 为上一个 vue 页面的路径
    if (process.env.NODE_ENV == 'production') {
      referrer = document.location.origin + '/vue' + from.fullPath
    } else {
      referrer = document.location.origin + '/#' + from.fullPath
    }
  }
  return referrer
}
// 修改url中某个指定的参数的值
export const replaceParamVal = (oldUrl, replaceWith) => {
  let nUrl = ''
  if (oldUrl.indexOf('city_id') >= 0 || oldUrl.indexOf('cityid') >= 0) {
    var re = /(city_?id=)([^&]*)/gi
    nUrl = oldUrl.replace(re, 'city_id=' + replaceWith)
  } else {
    nUrl = oldUrl + '?city_id=' + replaceWith
  }
  return nUrl
}

export const addParamsToUrl = (config, name, value) => {
  if (config.url.indexOf('?') > -1) {
    config.url += '&' + name + '=' + value
  } else {
    config.url += '?' + name + '=' + value
  }
  return config
}

export const getAppToken = cid => {
  var app_login_token
  if (typeof mJavaScriptObject == 'object') {
    app_login_token = mJavaScriptObject.getCacheAccessToken()
    // ios 老版本 mJavaScriptObject.getCacheAccessToken() 无法获取到 token，用老的方法重新获取一次
    if (cid == '24' && !app_login_token) {
      mJavaScriptObject.getCacheAccessToken(function(data) {
        app_login_token = data
      })
    }
  }
  return typeof app_login_token == 'string' && app_login_token.length > 32 ? app_login_token : ''
}

export const getDomain = () => {
  var protocol = window.location.protocol
  var hostName = window.location.hostname
  var domain = protocol + '//' + hostName
  return domain
}

export const htmlspecialchars_decode = str => {
  str = str.replace(/&amp;/g, '&')
  str = str.replace(/&nbsp;/g, '')
  str = str.replace(/&lt;/g, '<')
  str = str.replace(/&gt;/g, '>')
  str = str.replace(/&quot;/g, '\'\'')
  str = str.replace(/&#039;/g, '\'')
  str = str.replace(/&#34;/g, '"')
  return str
}

export const WxOath = appId => {
  if (!getUrlParam('code')) {
    window.location.href =
      'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
      appId +
      '&redirect_uri=' +
      encodeURIComponent(window.location.href) +
      '&response_type=code&scope=snsapi_base&state=91160#wechat_redirect'
  }
}

// 读取cookies
export const readCookie = name => {
  var arr = []
  var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  var reg_v2 = new RegExp('(^| )' + name + '_v2=([^;]*)(;|$)')
  if (
    document.cookie.indexOf(name + '_v2') != -1 &&
    (arr = document.cookie.match(reg_v2))
  ) {
    return Base64.decode(arr[2])
  } else if (
    document.cookie.indexOf(name) != -1 &&
    (arr = document.cookie.match(reg))
  ) {
    if (arr[2].indexOf('%u') != -1) {
      return unescape(arr[2])
    } else {
      return decodeURIComponent(arr[2])
    }
  } else {
    return null
  }
}

// 删除cookies
export const delCookie = name => {
  var cval = readCookie(name)
  var exp = new Date()
  exp.setTime(exp.getTime() - 1)
  var secure = document.location.protocol == 'https:' ? ';secure=true' : ''
  if (cval != null) {
    document.cookie =
      name + '=' + cval + ';expires=' + exp.toGMTString() + secure + ';path=/'
  }
}
export const getStyle = (element, attr, NumberMode = 'int') => {
  let target
  // scrollTop 获取方式不同，没有它不属于style，而且只有document.body才能用
  if (attr === 'scrollTop') {
    target = element.scrollTop
  } else if (element.currentStyle) {
    target = element.currentStyle[attr]
  } else {
    target = document.defaultView.getComputedStyle(element, null)[attr]
  }
  // 在获取 opactiy 时需要获取小数 parseFloat
  return NumberMode == 'float' ? parseFloat(target) : parseInt(target)
}

var scrollHandler = null

export const loadmore = callback => {
  scrollHandler && (window.removeEventListener('scroll', scrollHandler))
  scrollHandler = function() {
    // 允许20的误差
    if (getScrollTop() + getClientHeight() + 20 >= getScrollHeight()) {
      callback && callback()
    }
  }

  function getScrollTop() {
    var scrollTop = 0
    if (document.documentElement && document.documentElement.scrollTop) {
      scrollTop = document.documentElement.scrollTop
    } else if (document.body) {
      scrollTop = document.body.scrollTop
    }
    return scrollTop
  }

  // 获取当前可视范围的高度
  function getClientHeight() {
    var clientHeight = 0
    if (document.body.clientHeight && document.documentElement.clientHeight) {
      clientHeight = Math.min(
        document.body.clientHeight,
        document.documentElement.clientHeight
      )
    } else {
      clientHeight = Math.max(
        document.body.clientHeight,
        document.documentElement.clientHeight
      )
    }
    return clientHeight
  }

  // 获取文档完整的高度
  function getScrollHeight() {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    )
  }

  window.addEventListener('scroll', scrollHandler)
}

export const formateParams = data => {
  var value = []
  for (var key in data) {
    value.push(key + '=' + data[key])
  }
  return value.join('&')
}

export const getwxLocation = (options, vueInstance) => {
  var callback = options.callback || function() {
  }
  var cancelCallback = options.cancelCallback || function() {
  }
  vueInstance.$http.get('/sys/getjsconfig.html').then(res => {
    var data = res.data
    if (data.status !== 0) {
      return
    }
    wx.config({
      appId: data.appId, // 必填，公众号的唯一标识
      timestamp: data.timestamp, // 必填，生成签名的时间戳
      nonceStr: data.nonceStr, // 必填，生成签名的随机串
      signature: data.signature, // 必填，签名，见附录1
      jsApiList: ['getLocation'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    })
    wx.ready(function() {
      wx.getLocation({
        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function(res) {
          var lat = res.latitude // 纬度，浮点数，范围为90 ~ -90
          var lng = res.longitude // 经度，浮点数，范围为180 ~ -180。
          // var speed = res.speed // 速度，以米/每秒计
          // var accuracy = res.accuracy // 位置精度
          callback(lat, lng)
        },
        cancel: function(res) {
          cancelCallback()
        }
      })
    })
  })
}
export const wxShare = (options, vueInstance) => {
  var callback = options.callback || function() {}
  var cancelCallback = options.cancelCallback || function() {}
  vueInstance.$http.get('/sys/getjsconfig.html').then(res => {
    var data = res.data
    var wxshareLink = options.timeLine.link + (options.timeLine.link.indexOf('?') > '-1' ? '&' : '?') + 'fromshare=1'
    var appshareLink = options.appMessage.link + (options.appMessage.link.indexOf('?') > '-1' ? '&' : '?') + 'fromshare=1'
    if (data.status !== 0) return
    wx.config({
      appId: data.appId, // 必填，公众号的唯一标识
      timestamp: data.timestamp, // 必填，生成签名的时间戳
      nonceStr: data.nonceStr, // 必填，生成签名的随机串
      signature: data.signature, // 必填，签名，见附录1
      jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    })
    wx.ready(function() {
      wx.onMenuShareTimeline({
        title: options.timeLine.title,
        link: wxshareLink,
        imgUrl: options.timeLine.imgUrl,
        success: function() {
          // 用户确认分享后执行的回调函数
          callback()
        },
        cancel: function() {
          // 用户取消分享后执行的回调函数
          cancelCallback()
        }
      })
      wx.onMenuShareAppMessage({
        title: options.appMessage.title,
        desc: options.appMessage.desc, // 分享描述
        link: appshareLink,
        imgUrl: options.appMessage.imgUrl,
        success: function() {
          // 用户确认分享后执行的回调函数
          callback()
        },
        cancel: function() {
          // 用户取消分享后执行的回调函数
          cancelCallback()
        }
      })
    })
  })
}

export const isAppOrWeixin = vueInstance => {
  // app分享获取参数
  var ua = navigator.userAgent.toLowerCase()
  var cid = getSafeCid()
  var nykj_cid = vueInstance.$route.query.nykj_cid
  if (
    ua.match(/MicroMessenger/i) == 'micromessenger' ||
    typeof mJavaScriptObject == 'object' ||
    cid == GlobalSetting.patientAppCid.android ||
    cid == GlobalSetting.patientAppCid.ios ||
    cid == GlobalSetting.docAppCid.android ||
    cid == GlobalSetting.docAppCid.ios ||
    nykj_cid == GlobalSetting.nykj_cid.ios ||
    nykj_cid == GlobalSetting.nykj_cid.android
  ) {
    return true
  } else {
    return false
  }
}

// 在 APP 里会自动加上 cid，通过获取 cid 判断是否是 app 环境
export const commonIsApp = () => {
  // app分享获取参数
  const cid = getSafeCid()
  if (typeof mJavaScriptObject == 'object' && (cid == '20' || cid == '24')) {
    return true
  } else {
    return false
  }
}
// 在 APP 里会自动加上 cid，通过获取 cid 判断是否是 ios app 环境
export const commonIsNoIosApp = () => {
  const cid = getSafeCid()
  if (typeof mJavaScriptObject == 'object' && cid == '24') {
    return true
  } else {
    return false
  }
}

export const CoolWPDistance = (lat1, lng1, lng2, lat2) => {
  function getRad(d) {
    var PI = Math.PI
    return (d * PI) / 180.0
  }

  var nlat1 = Number(lat1)
  var nlng1 = Number(lng1)
  var nlat2 = Number(lat2)
  var nlng2 = Number(lng2)
  var f = getRad((nlat1 + nlat2) / 2)
  var g = getRad((nlat1 - nlat2) / 2)
  var l = getRad((nlng1 - nlng2) / 2)
  var sg = Math.sin(g)
  var sl = Math.sin(l)
  var sf = Math.sin(f)
  var s, c, w, r, d, h1, h2
  var a = 6378137.0 // The Radius of eath in meter.
  var fl = 1 / 298.257
  sg = sg * sg
  sl = sl * sl
  sf = sf * sf
  s = sg * (1 - sl) + (1 - sf) * sl
  c = (1 - sg) * (1 - sl) + sf * sl
  w = Math.atan(Math.sqrt(s / c))
  r = Math.sqrt(s * c) / w
  d = 2 * w * a
  h1 = (3 * r - 1) / 2 / c
  h2 = (3 * r + 1) / 2 / s
  s = d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg))
  if (lng2 == 0 || lat2 == 0) {
    s = ''
  } else {
    if (s >= 1000 && s <= 99000) {
      var kilometer = s / 1000
      s = kilometer.toFixed(1) + 'km'
    } else if (s > 99000) {
      s = '>99km'
    } else {
      s = Math.round(s) + 'm'
    }
  }
  return s
}

export const isNotEmptyObject = o => {
  if (typeof o !== 'object') return
  const type = Object.prototype.toString.call(o)
  let result = false
  if (type === '[object Object]') {
    // 对象
    for (var k in o) {
      return (result = true)
    }
  } else if (type === '[object Array]') {
    // 数组
    if (o.length > 0) {
      result = true
    }
  }
  return result
}

export const LazyLoad = defaultImgUrl => {
  window.onscroll = null
  const img = document.getElementsByClassName('lazyload')
  const num = img.length
  let n = 0 // 存储图片加载到的位置，避免每次都从第一张图片开始遍历
  lazyload() // 页面载入完毕加载可是区域内的图片
  function lazyload() {
    // 监听页面滚动事件
    const seeHeight = document.documentElement.clientHeight // 可见区域高度
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop

    // 滚动条距离顶部高度
    for (let i = n; i < num; i++) {
      // 图片未出现时距离顶部的距离大于滚动条距顶部的距离+可视区的高度
      if (img[i].offsetTop < seeHeight + scrollTop) {
        if (img[i].getAttribute('src') == defaultImgUrl) {
          img[i].src = img[i].getAttribute('data-src')
        }
        n = i + 1
      }
    }
  }

  // 采用了节流函数
  function throttle(fun, delay, time) {
    let timeout
    let startTime = new Date()
    return function() {
      const context = this
      const args = arguments
      const curTime = new Date()
      clearTimeout(timeout)
      // 如果达到了规定的触发时间间隔，触发 handler
      if (curTime - startTime >= time) {
        fun.apply(context, args)
        startTime = curTime
        // 没达到触发间隔，重新设定定时器
      } else {
        timeout = setTimeout(fun, delay)
      }
    }
  }

  window.addEventListener('scroll', throttle(lazyload, 500, 1000))
}

export const getUuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0
    var v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const autoPullApp = app_native_tpl => {
  if (typeof mJavaScriptObject == 'object') {
    if (app_native_tpl) {
      if (mJavaScriptObject.callbackNative(app_native_tpl)) {
        return false
      }
    }
    return true
  } else {
    return true
  }
}

export const getScrollHeight = (except = 0) => {
  const clientWidth =
    document.body.clientWidth || document.documentElement.clientWidth
  const clientHeight =
    document.body.clientHeight || document.documentElement.clientHeight
  const ratio = clientWidth / 375
  return clientHeight - except * ratio + 'px'
}

export const getClientInfo = () => {
  var clientHeight =
    document.body.clientHeight || document.documentElement.clientHeight
  var clientWidth =
    document.body.clientWidth || document.documentElement.clientWidth
  return {
    clientHeight,
    clientWidth
  }
}

export const getRatio = except => {
  const clientWidth =
    document.body.clientWidth || document.documentElement.clientWidth
  return clientWidth / 375
}

export const getWeixinShareUrl = (vueInstance, query) => {
  var url = GlobalSetting.WEIXIN + vueInstance.$route.path
  if (query) {
    return url + '?' + query
  }
  return url
}

export const pullUpNativeHos = (unit_id, class_id = 0) => {
  // 拉取原生医院主页
  if (typeof mJavaScriptObject == 'object') {
    mJavaScriptObject.funGotoHospitalHomePage(unit_id, class_id, '')
  } else {
    window.location.href = '/unit/dep.html?unit_id=' + unit_id + '&class_id=' + class_id
  }
}

export const pullUpNativeDoc = (unit_id, dep_id, doctor_id, type = 0) => {
  // 拉取原生医生主页
  // var map = { 'full': 0, 'order': 0, 'add': 1, 'askdoc': 2, 'private': 3 };
  var arr = ['full', 'order', 'add', 'askdoc', 'private']
  if (typeof mJavaScriptObject == 'object') {
    const app_version = mJavaScriptObject.funGetVersion()
    if (navigator.userAgent.includes('cid=20') && app_version < '6.6.4') {
      mJavaScriptObject.funGotoDocHomepageActivity(unit_id, dep_id, doctor_id, 0)
    } else {
      // 获取来源标示
      let ex = ''
      let cf = ''
      axios.get('/stat/getmark.html').then((res) => {
        if (res.data && res.data.ex) {
          ex = res.data.data.ex
        }
        if (res.data && res.data.cf) {
          cf = res.data.data.cf
        }
        mJavaScriptObject.funGotoDocHomepageActivity(unit_id, dep_id, doctor_id, 0, ex, cf)
      }).catch(err => {
        console.log(err)
      })
    }
  } else {
    window.location.href = '/doctor/detail.html?unit_id=' + unit_id + '&dep_id=' + dep_id + '&doc_id=' + doctor_id + '&type=' + arr[type]
  }
}

// 格式化时间
export const formDate = oldDate => {
  const date = oldDate.split(' ')[0].split('-')
  const time = oldDate.split(' ')[1].split(':')
  const month = date[1] > 1 ? date[1] - 1 : date[1]
  const newDate = new Date(
    date[0],
    month,
    date[2],
    time[0],
    time[1],
    time[2]
  ).getTime()
  return newDate
}

// 高德坐标转百度（传入经度、纬度）
export const bd_encrypt = (gg_lng, gg_lat) => {
  var X_PI = (Math.PI * 3000.0) / 180.0
  var x = gg_lng
  var y = gg_lat
  var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * X_PI)
  var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * X_PI)
  var bd_lng = z * Math.cos(theta) + 0.0065
  var bd_lat = z * Math.sin(theta) + 0.006
  return {
    bd_lat: bd_lat.toFixed(8),
    bd_lng: bd_lng.toFixed(8)
  }
}

// 获取城市id

export const getCityId = () => {
  let cityId = getUrlParam('city_id') || readCookie('location_city_id')
  cityId = transCityId(cityId)
  return cityId
}

/**
 * 微信城市服务 ， 城市编码对应
    440300: 5,    //深圳
    441900: 2920, //东莞
    451200: 3221, //河池
    430700: 3263, //常德
    500000: 3316, //重庆
    320100: 3073, //南京
 */

export const transCityId = (city_id) => {
  let cityId = city_id + ''
  const out_cityids = ['440300', '441900', '451200', '430700', '500000', '320100']
  const us_cityids = [5, 2920, 3221, 3263, 3316, 3073]
  const city_index = out_cityids.indexOf(cityId)
  if (city_index > -1) {
    cityId = us_cityids[city_index]
  }
  return cityId
}

// 比较日期是否三天内
export const compareDate = (dateStr) => {
  let curTime = new Date().getTime()
  let time = new Date(dateStr).getTime()
  if (`${curTime}`.length > 10) { // 秒
    curTime = curTime / 1000
  }
  if (`${time}`.length > 10) {
    time = time / 1000
  }
  const diff = curTime - time
  const threeDay = 24 * 60 * 60 * 3
  if (diff > 0) {
    if (diff < threeDay) {
      return true
    }
  }
  return false
}

// 比较两个日期A是否大于B
export const compareDateAB = (dateA, dateB) => {
  const a = new Date(dateA).getTime()
  const b = new Date(dateB).getTime()
  const diff = a - b
  if (diff > 0) {
    return true
  }
  return false
}

// 检测当前设备是否有刘海屏
export const hasNotch = () => {
  let proceed = false
  const div = document.createElement('div')
  if (CSS.supports('padding-bottom: env(safe-area-inset-bottom)')) {
    div.style.paddingBottom = 'env(safe-area-inset-bottom)'
    proceed = true
  } else if (CSS.supports('padding-bottom: constant(safe-area-inset-bottom)')) {
    div.style.paddingBottom = 'constant(safe-area-inset-bottom)'
    proceed = true
  }
  if (proceed) {
    document.body.appendChild(div)
    const calculatedPadding = parseInt(window.getComputedStyle(div).paddingBottom)
    document.body.removeChild(div)
    if (calculatedPadding > 0) {
      return true
    }
  }
  return false
}

// 判断地址栏url后面的参数url是否合法
export const checkUrl = (url) => {
  const newurl = decodeURIComponent(url)
  if ((newurl.indexOf('http') > -1 && newurl.indexOf('91160') > -1) || newurl.indexOf('http') == -1) {
    return true
  } else {
    return false
  }
}
// 补充 url 前缀
export const fixImageUrl = (url) => {
  if (!url || typeof url != 'string') return ''
  const RegExps = {
    // 判断是否为线上图片正则
    // https://regexper.com/?#%2F%28%28http%7Chttps%29%3A%29%3F%5C%2F%5C%2F%28%5B%5Cw.%5D%2B%5C%2F%3F%29%5CS*%2Fg
    online: /((http|https):)?\/\/([\w.]+\/?)\S*/g,
    // 静态站图片
    static: /\/\/static./g,
    // 本地图片带有版本号，带有 img 路径
    // https://regexper.com/?#%2F%5C%2Fsrc%5C%2Fimg%5C%2F%28.*%29%2B%5C.%28.*%29%2B%5C.%28jpe%3Fg%7Cpng%7Cgif%29%2Fgim
    local: /\/src\/img\/(.*)+\.(.*)+\.(jpe?g|png|gif)/gim,
    // data-uri 图片
    base64: /data:image\/.*;base64,/g
  }
  if (Object.keys(RegExps).some(item => RegExps[item].test(url))) return url
  // 如果第一个是 ‘/’ 则不需要加上 /
  if (url.charAt(0) == '/') return IMAGESDOMAIN + url
  return IMAGESDOMAIN + '/' + url
}

// 存储,可设置过期时间
export const setLocalStorage = (key, value, expires) => {
  const params = { key, value, expires }
  if (expires) {
    // 记录何时将值存入缓存，毫秒级
    var data = Object.assign(params, { startTime: new Date().getTime() })
    localStorage.setItem(key, JSON.stringify(data))
  } else {
    if (Object.prototype.toString.call(value) == '[object Object]') {
      value = JSON.stringify(value)
    }
    if (Object.prototype.toString.call(value) == '[object Array]') {
      value = JSON.stringify(value)
    }
    localStorage.setItem(key, value)
  }
}
// 取出
export const getLocalStorage = (key) => {
  let item = localStorage.getItem(key)
  // 先将拿到的试着进行json转为对象的形式
  try {
    item = JSON.parse(item)
  } catch (error) {
    // eslint-disable-next-line no-self-assign
    item = item
  }
  // 如果有startTime的值，说明设置了失效时间
  if (item && item.startTime) {
    const date = new Date().getTime()
    // 如果大于就是过期了，如果小于或等于就还没过期
    if (date - item.startTime > (item.expires * 3600000)) {
      localStorage.removeItem(name)
      return false
    } else {
      return item.value
    }
  } else {
    return item
  }
}

export const queryToUrl = (query) => {
  const keys = Object.keys(query)
  let resultStr = ''
  for (let i = 0; i < keys.length; i++) {
    const name = keys[i]
    if (i == keys.length - 1) {
      resultStr += `${name}=${query[name]}`
    } else {
      resultStr += `${name}=${query[name]}&`
    }
  }
  return resultStr
}

export const getQueryString = (name) => {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  const afterParams = location.href.split('?')[1]
  if (afterParams) {
    var r = afterParams.match(reg)
    if (r != null) return unescape(r[2])
  }
  return null
}

// 将数组转化成 二位数组
export const twoArray = (arr, count) => {
  const resultArr = []
  const arrCount = Math.ceil(arr.length / count)
  if (arr.length <= count) {
    resultArr.push(arr)
    return resultArr
  }
  for (let i = 0; i < arrCount; i++) {
    const start = 0 + i * count
    const end = count * (i + 1)
    const item = arr.slice(start, end)
    resultArr.push(item)
  }
  console.log(resultArr)
  return resultArr
}

export const isIphonex = () => {
  // X XS, XS Max, XR
  const xSeriesConfig = [
    {
      devicePixelRatio: 3,
      width: 375,
      height: 812
    },
    {
      devicePixelRatio: 3,
      width: 414,
      height: 896
    },
    {
      devicePixelRatio: 2,
      width: 414,
      height: 896
    }
  ]
  // h5
  if (typeof window !== 'undefined' && window) {
    const isIOS = /iphone/gi.test(window.navigator.userAgent)
    if (!isIOS) return false
    const { devicePixelRatio, screen } = window
    const { width, height } = screen
    return xSeriesConfig.some(item => item.devicePixelRatio === devicePixelRatio && item.width === width && item.height === height)
  }
  return false
}
// 时间格式化
export const dateFormat = (fmt, dateEnter) => {
  let ret = null
  const date = typeof dateEnter == 'object' ? dateEnter : new Date(dateEnter.replace(/[-]/g, '/'))
  const opt = {
    'Y+': date.getFullYear() + '', // 年
    'm+': (date.getMonth() + 1) + '', // 月
    'd+': date.getDate() + '', // 日
    'H+': date.getHours() + '', // 时
    'M+': date.getMinutes() + '', // 分
    'S+': date.getSeconds() + '' // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  }
  for (const k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt)
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
    }
  }
  return fmt
}

export const caculateDate = (dateEnter) => {
  let secondNum = 0
  const secondDay = 24 * 3600
  let hourNum = 0
  let miniteNum = 0
  if (Number.isNaN(Number(dateEnter))) {
    secondNum = Math.floor((Date.now() - new Date(dateEnter).getTime()) / 1000)
  } else {
    secondNum = Number(dateEnter)
  }

  if (secondNum < secondDay) {
    hourNum = Math.floor(secondNum / 3600)
    miniteNum = Math.floor((secondNum - 3600 * hourNum) / 60)

    if (hourNum == 0 && miniteNum == 0) {
      return '刚刚'
    } else {
      if (hourNum == 0) {
        return miniteNum + '分钟前'
      } else {
        return hourNum + '小时前'
      }
    }
  } else {
    return Math.floor(secondNum / secondDay) + '天前'
  }
}

export const secondToDate = (seconds) => {
  const day_seconds = 24 * 3600
  const hour_seconds = 3600
  const minite_seconds = 60
  const result = []

  const day = Math.floor(seconds / day_seconds)
  day < 10 ? result.push('0' + day) : result.push(day)

  const hour = Math.floor((seconds - day * day_seconds) / hour_seconds)
  hour < 10 ? result.push('0' + hour) : result.push(hour)

  const minite = Math.floor((seconds - day * day_seconds - hour * hour_seconds) / minite_seconds)
  minite < 10 ? result.push('0' + minite) : result.push(minite)

  const res_second = seconds - day * day_seconds - hour * hour_seconds - minite * minite_seconds
  res_second < 10 ? result.push('0' + res_second) : result.push(res_second)

  return result
}

// 修改url中某个参数的值

export const replaceUrlParamVal = (url, name, value) => {
  const re = new RegExp(name + '=[^&]*', 'gi')
  return url.replace(re, name + '=' + value)
}

export const isIOS = () => {
  const u = navigator.userAgent
  const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
  return isiOS
}

export const isInWechat = () => {
  var ua = navigator.userAgent.toLowerCase()
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true
  } else {
    return false
  }
}

// 解决乘法精度问题
export const accMul = (arg1, arg2) => {
  var m = 0; var s1 = arg1.toString(); var s2 = arg2.toString()
  try { m += s1.split('.')[1].length } catch (e) {}
  try { m += s2.split('.')[1].length } catch (e) {}
  return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
}

// 获取 准确的clientId
export const getExactDeviceId = () => {
  // 通过安卓APP获取device_id
  let device_id = ''
  const str = navigator.userAgent
  if (commonIsApp()) {
    const str_arr = str.split('device_id')
    if (str_arr[1]) {
      device_id = str_arr[1].substring(1)
    }
    console.log(device_id)
  }
  return device_id
}

/**
 * 添加日历提醒
 * @param {string} title string 事件标题
 * @param {string} subTitle string 事件副标题
 * @param {string} startDate string 开始时间 yy-mm-dd HH:mm:ss
 * @param {string} endDate string 结束时间 yy-mm-dd HH:mm:ss
 * @param {number} alarmOffset number 闹钟偏移时间，秒（闹钟时间减去开始时间）
 */
export const addCalenderRemindEvent = (title, subTitle, startDate, endDate, alarmOffset) => {
  console.log('进来了噢')
  if (commonIsApp() && mJavaScriptObject.funGetVersion() >= '6.6.5') {
    console.log('进来调用了噢')
    mJavaScriptObject.funAddCalenderRemindEvent(title, subTitle, startDate, endDate, alarmOffset)
  }
}
// 增加 options判断 leading(第一次) trailing（最后一次）  true执行 false不执行
export const new_throttle = (func, wait, options) => {
  let context
  let args
  let timer
  let old = 0
  const later = function() {
    old = new Date().valueOf()
    timer = null
    func.apply(context, args)
  }
  return function() {
    context = this
    args = [...arguments]
    const now = new Date().valueOf()
    if (options.leading === false && !old) {
      old = now
    }
    if (now - old > wait) {
      old = now
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      func.apply(context, args)
    } else if (!timer && options.trailing !== false) {
      timer = setTimeout(later, wait)
    }
  }
}

