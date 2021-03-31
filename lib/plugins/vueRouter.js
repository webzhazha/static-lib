import Vue from 'vue'
import VueRouter from 'vue-router'
// http 实例
import axios from './axios'
import store from '@/store/store'
import routes from '@/router/router'
// 加载工具函数
import { loadingQiYu } from '@/utils/importQiYu'
import { getSafeCid, getUrlParam, getVueReferrer, getAppToken, readCookie, setCookie, commonIsApp, isSureWeiXin, isIOS } from '@/utils/util'
// 加载环境配置
import { routerMode, appId } from '@/config/env'
import GlobalSetting from '@/config/GlobalSetting.js'
import { getLatAndLng } from '@/config/getLatLng.js'
import { callAppConfig } from '@/config/callAppConfig.js'
// 加载通用路由
import common from '../router/modules/common.js'

Vue.use(VueRouter)

// 保证404路由在最底部
routes[0].children = routes[0].children.concat(common)

const router = new VueRouter({
  routes,
  mode: routerMode,
  scrollBehavior(to, from, savedPosition) {
    // 因为本地是 hash 模式，线上是 history 模式，hash 模式无法使用 savedPosition，使用全局设置来处理
    // 相同的页面并且在全局设置里定义的页面不跳回顶部
    if (to.path == from.path && GlobalSetting.keepPositionPaths.includes(to.path.toLowerCase())) {
      console.log('scrollBehavior', true)
      return
    }
    if (savedPosition) {
      // console.log('scrollBehavior', savedPosition)
      // return savedPosition
      return new Promise((resolve, reject) => {
        const st = setTimeout(() => {
          console.log('savedPosition', savedPosition)
          resolve(savedPosition)
          clearTimeout(st)
        }, 500)
      })
    } else if (to.query.toTop && to.query.toTop === 'true') { // 如果路径带有此参数，我们不做任何滚动，参考/gjyl/goodsList/servePageScroll.html?toTop=true页面
      return
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  },
  strict: process.env.NODE_ENV !== 'production'
})

function isLoginedFunc(to) {
  return new Promise((resolve, reject) => {
    var mtToken = getUrlParam('mtToken') || ''
    var wxCode = getUrlParam('code') || ''
    var user_key = getUrlParam('user_key') || ''
    axios.get('/user/islogined.html?code=' + wxCode + '&mtToken=' + mtToken + '&user_key=' + user_key).then(res => {
      console.log(res)
      if (res.status == 200) {
        sensorsCustomize.$setCommonProps({
          ip_city_id: res.data.city_id,
          ip_city_name: res.data.city_name
        })
        
        store.commit('THIRD_LOGIN_URL', res.data.loginUrl) // 淮南渠道登录接口会返回loginUrl，登录跳转到loginUrl
        store.commit('SETUSERINFO', { userInfo: res.data.user_info, is_has_open_id: res.data.is_has_open_id, client_id: res.data.client_id, city_id: res.data.city_id })
        if (res.data.oss_domain && res.data.oss_domain.nykjb2c_url) {
          store.commit('CHANGE_OSSTESTIMG', res.data.oss_domain.nykjb2c_url)
        }
        setCookie('client_id', res.data.client_id, 0.2)
        setCookie('location_city_id', res.data.city_id)
        var dev_token = getUrlParam('dev_token') || ''
        store.commit('DEV_TOKEN', dev_token)
        if (res.data.status == 1) {
          store.commit('IS_LOGIN', 1)
          setCookie('user_id', res.data.user_info.user_id, 0.2)
          localStorage.setItem('user_id', res.data.user_info.user_id)
        } else {
          store.commit('IS_LOGIN', 0)
          window.localStorage.removeItem('user_id')
          if (!getUrlParam('code') && res.data.jump_url) {
            window.location.href = res.data.jump_url
          }
        }
        resolve(res)
      }
    })
  })
}

function setStoreAppParams(next) {
  if (typeof NyStoreManager == 'object') {
    var access_token = NyStoreManager.getAccessToken()
    var fid = NyStoreManager.getFId()
    window.store_access_token = access_token
    window.store_fid = fid
    if (typeof NyStoreManager.getUnitUserId === 'function') {
      var unit_user_id = NyStoreManager.getUnitUserId()
      window.store_unit_user_id = unit_user_id || ''
    }
    next()
    return false
  }
}

async function buildArgs(args, to, name) {
  var obj = {}
  args.forEach(arg => {
    // e.g obj.goods_id = to.query.goods_id
    const key = arg.alias || arg.name
    obj[key] = to[arg.source][arg.name] || ''
  })
  // 如果是详情页, 当分享过来拼接参数 share_param: {share_id:1261,path_type:1}
  // 当没有path_type时, 为1
  if (name == 'healthProduct' && to.query.share_id) {
    const share_param = 'share_id:' + to.query.share_id + '|' + 'path_type:' + (to.query.path_type || 1)
    obj.share_param = encodeURIComponent(share_param)
  }
  // 如果是详情页要先获取ex cf参数
  if (name == 'healthProduct') {
    await axios.get('/stat/getmark.html').then((res) => {
      if (res.data && res.data.data.ex) {
        obj.ex = res.data.data.ex
      }
      if (res.data && res.data.data.cf) {
        obj.cf = res.data.data.cf
      }
    }).catch(err => {
      console.log(err)
    })
    // 增加神策埋点
    obj.from_function_id = getUrlParam('from_function_id') || ''
    obj.from_function_name = getUrlParam('from_function_name') || ''
  }
  return JSON.stringify(obj)
}

function noLogin(to, next) {
  if (to.meta.notJump) {
    // 自动登录但不强制登录
    return next()
  } else {
    // 自动登录强制登录
    window.sessionStorage.removeItem('isLogined')
    store.commit('IS_LOGIN', 0)
    var origin = location.origin
    var from_function_id = getUrlParam('from_function_id') || ''
    document.location.href = '/user/login.html?redirect_url=' + encodeURIComponent(origin + to.fullPath) + '&from_function_id=' + from_function_id
    return
  }
}
// 发送分析数据
// TODO extensional: { order_id: 123, type: "yuyue" }}"
function buildAnalysisData({
  user_id = '',
  client_id = '',
  referrer = '',
  channel_id = 16,
  city_id = 5,
  curpageid = '',
  frompageid = '',
  curpageurl
}) {
  const { href } = document.location
  // - 1 + 1 用于隐式类型转换
  const params = {
    device_id: client_id, // 用户设备号
    user_id: user_id, // 用户id
    current_url: curpageurl || href, // 用户请求的url
    curpageid, // 行为发生的前端页面ID
    channel_id: channel_id - 1 + 1,
    city_id: city_id - 1 + 1, // 用户城市id
    from_url: referrer, // 来源url
    frompageid,
    item_type: curpageid.startsWith('DD00.') ? 302 : 0, // 医生主页item_type=302
    bhv_time: parseInt(new Date().getTime()), // 行为发生的时间戳 毫秒
    bhv_type: 'view'
  }
  return params
}

// 发送日志收集数据
function sendAnalysis(params, logcollect_domain) {
  // localStorage缓存上报失败数据
  var BIArray = []
  BIArray = JSON.parse(window.localStorage.getItem('BIArray')) || []
  var url = logcollect_domain + 'v2/biz/web/'
  $.ajax({
    url,
    data: JSON.stringify(params),
    contentType: 'application/json;charset=utf-8', // 这个参数也是header参数
    dataType: 'json',
    type: 'post',
    complete: function(XMLHttpRequest, textStatus) {
      console.log(textStatus)
      if (textStatus == 'error') {
        BIArray.push(params)
        var newBIArray = BIArray.slice(-50) // 取最新50条
        window.localStorage.setItem('BIArray', JSON.stringify(newBIArray))
      }
    }
  })
}
// 页面分析数据上报
function processPageAnalysis(cid, from, data, curpageid, curpageurl, to) {
  const { client_id, user_info, city_id, logcollect_domain } = data.data
  const channel_id = cid
  const frompageid = readCookie('frompageid') || ''
  const referrer = getVueReferrer(from)
  let user_id = ''
  if (user_info) {
    user_id = user_info.user_id
  }
  const params = buildAnalysisData({ user_id, client_id, referrer, channel_id, city_id, curpageid, frompageid, curpageurl })
  setCookie('frompageid', curpageid || '', 0.2)
  // 频道页将item_type=801 item_id = 上报
  if (curpageid && curpageid.startsWith('B01')) {
    params.item_type = 801
    params.item_id = to.query.id
  }
  // 二级频道
  if (curpageid && curpageid.startsWith('B02') && to.query.first_id) {
    params.item_type = 801
    params.item_id = to.query.first_id
  }
  // 发送分析数据
  sendAnalysis(params, logcollect_domain)
}

// 处理 H5 拉起 APP 页面的逻辑
async function handlePullApp(to, next) {
  const name = to.name
  let args = '{}'
  // 加载拉起 appConfig 的配置
  const configIndex = callAppConfig.findIndex(config => config.name == name)
  if (configIndex < 0 || typeof (mJavaScriptObject) == 'undefined') {
    next()
    return
  }
  if (mJavaScriptObject.funGetVersion() < callAppConfig[configIndex].version) {
    next()
    return
  } else {
    args = await buildArgs(callAppConfig[configIndex].args, to, callAppConfig[configIndex].name)
  }
  store.dispatch('callNativeApp', {
    'template': to.meta.template,
    'args': args
  }).then(res => {
    // result 为 false 是拉起来 APP
    if (!res) {
      // 关闭 h5 webview
      // if(to.name == 'healthProduct'){
      //   console.log("healthProduct close native...")
      //   mJavaScriptObject && mJavaScriptObject.funCloseNativeWebView()
      // }else{
      //   console.log("healthProduct back...")
      //   window.history.back()
      // }
      console.log('healthProduct back...')
      window.history.back()
      return
      // mJavaScriptObject.funCloseNativeWebView()
    } else {
      next()
    }
  })
}
// 处理 BI 数据上报
function handleBIReport(cid, to, from, data) {
  /* 医生主页浏览上报*/
  if (to.name == 'doctorDetail_new') {
    const type = to.query.type
    switch (type) {
      case 'guahao':
        to.meta.fcChnId = 'DD00.GH'
        break
      case 'askdoc':
        to.meta.fcChnId = 'DD00.ZX'
        break
      case 'full':
        to.meta.fcChnId = 'DD00.GRZY'
        break
    }
  }
  /* 医生主页浏览上报*/
  var curpageid = to.meta.fcChnId
  var curpageurl = to.fullPath
  const referrer = getVueReferrer(from)
  // 同步 vuex
  store.commit('UPDATEDATABI', {
    curpageid: curpageid,
    curpageurl: curpageurl,
    frompageid: readCookie('frompageid') || '' || '',
    from_url: from.fullPath || referrer,
    bhv_time: parseInt(new Date().getTime())
  })
  // 同步 cookie
  setCookie('curpageid', curpageid, 0.2)
  setCookie('curpageurl', curpageurl, 0.2)
  setCookie('from_url', from.fullPath || referrer, 0.2)
  setCookie('city_id', readCookie('location_city_id') || 5, 0.2)
  setCookie('logcollect_domain', data.data.logcollect_domain, 0.2)
  if (to.name != 'patient_report') { // 患者报到特殊情况
    // 发送数据
    processPageAnalysis(cid, from, data, curpageid, curpageurl, to)
  }
}

// 使用临时 key 进行登录
function handleTemporaryKeyLogin(to, next) {
  const momentKey = to ? to.query.momentKey : getUrlParam('momentKey')
  axios.get('/user/loginByMomentKey.html?moment_key=' + momentKey).then(res => {
    if (res.data.status == 1) { // 登录成功
      window.sessionStorage.setItem('isLogined', '1')
      store.commit('IS_LOGIN', 1)
      store.commit('SETUSERINFO', {
        userInfo: res.data.user_info
      })
      next()
      return
    } else {
      next()
      return
    }
  })
}

// 隐藏 APP 的分享按钮
function handleHideAppShareButton(to) {
  var cid = getSafeCid()
  var setunshare = to.meta.unshare || '0'
  var unshare = getUrlParam('unshare') || '0'
  console.log('unshare:', unshare, 'setunshare:', setunshare)
  if ((typeof mJavaScriptObject) === 'object' && (cid == 20 || cid == 24)) {
    /* app中右上角分享按钮处理
    默认都展示右上角分享按钮
    如果地址栏上面有unshare 并且等于1，则不出现右上角分享按钮
    */
    var unshare = to.meta.unshare || '0'
    if (unshare == 1 || setunshare == 1) {
      mJavaScriptObject.funShowShareButton('0')
    } else {
      mJavaScriptObject.funShowShareButton('1')
    }
  }
}

// ios 微信分享 配置不成功
function IOSWechatShare(to) {
  if (isSureWeiXin() && isIOS()) {
    if (to.path !== location.pathname) {
      location.assign(to.fullPath)
    }
  }
}

router.beforeEach(async(to, from, next) => {
  Vue && Vue.prototype.$countDown && Vue.prototype.$countDown.hide()
  function appWebDidFinishLoad() {
    setStoreAppParams(next)
  }
  // 跳转到 404 页面，直接转发到 php 的 404 页面
  // if (to.name == '404') {
  //   document.location.href = '/main/error.html?from=vue'
  //   return false
  // }
  var cid = getSafeCid()
  if (to.name === 'gjylSearch' && from.name !== 'gjylProduct') {
    store.commit('gjyl/EMPTYGOODSLIST')
  }
  if (to.matched.some(record => record.meta.title)) {
    document.title = to.meta.title
  }
  if (to.name != 'qiYuMiddle') {
    setTimeout(() => {
      localStorage.setItem('qiYuMiddle', to.meta.qiyuTitle || document.title)
    }, 1000)
  }
  if (to.meta.loadingQiYu) {
    loadingQiYu()
  }
  // 判断是否有ex参数
  if (getUrlParam('ex')) {
    axios.get('/stat/addmark.html?ex=' + getUrlParam('ex')).then((data) => {
      console.log(data)
    }).catch(err => {
      console.log(err)
    })
  }
  if (to.meta.store) { // 商户APP里面不用调wap这边的登录
    var nykj_cid = getUrlParam('nykj_cid')
    if (nykj_cid == GlobalSetting.nykj_cid.ios) { // 商户App Ios渠道
      window.appWebDidFinishLoad = appWebDidFinishLoad
      setStoreAppParams(next)
    } else if (nykj_cid == GlobalSetting.nykj_cid.android) { // 商户App Android渠道
      setStoreAppParams(next)
    } else {
      next()
    }
  } else {
    const data = await isLoginedFunc(to)
    handleBIReport(cid, to, from, data)
    if (to.query.momentKey) {
      return handleTemporaryKeyLogin(to, next)
    } else if (to.meta.callNativeApp && (commonIsApp() || cid == '20' || cid == '24') && !to.fullPath.includes('from_artical') && !to.fullPath.includes('from_task')) { // 医生文章详情的入口进入不用拉起APP
      if (window.top == window.self) {
        return handlePullApp(to, next)
      } else {
        next()
      }
    } else if (to.meta.needLogin) {
      var origin = location.origin
      var isLogined = window.sessionStorage.getItem('isLogined')
      var isLoginOut = readCookie('is_logout')
      if (isLogined && isLoginOut != 1) {
        next()
        return
      } else {
        if (data.data.status === 0) { // 登录失效
          var ua = navigator.userAgent.toLowerCase()
          if (cid === '20' || cid === '24' || typeof mJavaScriptObject == 'object') { // 如果是在APP里面验证jstoken
            var jstoken = encodeURIComponent(getAppToken())
            if (jstoken) {
              axios.get('/user/loginByAppToken.html?jstoken=' + jstoken).then((data) => {
                if (data.data.status == 1) { // 已登录;
                  store.commit('SETUSERINFO', {
                    userInfo: data.data.user_info
                  })
                  var dev_token = getUrlParam('dev_token') || ''
                  store.commit('DEV_TOKEN', dev_token)
                  next()
                  return
                } else { // 未登录
                  noLogin(to, next)
                }
              }).catch(err => {
                console.log(err)
              })
            } else {
              noLogin(to, next)
            }
            return
          } else if (origin.indexOf('weixin') !== -1 && ua.match(/MicroMessenger/i) == 'micromessenger') { // 如果是微信域名,
            var code = getUrlParam('code') || 0
            if (!code) { // 判断url是否携带微信返回的code,如果没有,跳转微信官方链接获取
              window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appId + '&redirect_uri=' + encodeURIComponent(origin + to.fullPath) + '&response_type=code&scope=snsapi_base&state=91160#wechat_redirect'
              return
            }
            axios.get('/user/loginByCode.html?code=' + code).then((data) => {
              if (data.data.status == 1) { // 登录成功
                store.commit('SETUSERINFO', {
                  userInfo: data.data.user_info
                })
                var dev_token = getUrlParam('dev_token') || ''
                store.commit('DEV_TOKEN', dev_token)
                window.sessionStorage.setItem('isLogined', '1')
                store.commit('IS_LOGIN', 1)
                next()
                return
              } else {
                noLogin(to, next)
              }
            })
          } else { // 不是微信域名
            noLogin(to, next)
          }
        } else if (data.data.status === 1) { // 登录未失效
          next()
          window.sessionStorage.setItem('isLogined', '1')
          store.commit('IS_LOGIN', 1)
          return
        }
      }
    } else if (to.meta.needGetLatAndLng && !store.state.search.selectedAreaId) {
      var positions = await getLatAndLng()
      store.commit('search/UPDATEAREANAME', {
        id: positions.cityId,
        name: positions.currentCityName
      })
      store.commit('search/UPDATELATLNG', {
        lat: positions.currentLat,
        lng: positions.currentLng,
        selectedParentId: positions.currentProId,
        selectedAreaId: positions.cityId,
        selectedAreaName: positions.currentCityName
      })
      next()
    } else {
      next()
    }
  }
})

router.afterEach((to, from) => {
  handleHideAppShareButton(to)
  IOSWechatShare(to)
})

export default router
