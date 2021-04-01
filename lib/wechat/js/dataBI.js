;(function(root, factory) {
  if (typeof exports === 'object') {
    module.exports = factory()
  } else if (typeof define === 'function' && define.amd) {
    define(factory)
  } else {
    root.DataBI = factory()
  }
})(this, function() {
  var fn_page_id = [
    { 'url': '/vue/content/index.html', 'fcChnId': 'DKP0' },
    { 'url': '/vue/doctor/detail.html', 'fcChnId': 'DD00' },
    { 'url': '/vue/ask/index.html', 'fcChnId': 'WD0' },
    { 'url': '/vue/fastguahao/index.html', 'fcChnId': 'GHMY1' },
    { 'url': '/vue/unit/deplist.html', 'fcChnId': 'LM0' },
    { 'url': '/vue/healthtab/index.html', 'fcChnId': 'DSH0' },
    { 'url': '/vue/main/index.html', 'fcChnId': 'G0' },
    { 'url': '/vue/search/complex.html', 'fcChnId': 'Se00' },
    { 'url': '/vue/search/ill.html', 'fcChnId': 'Se04' },
    { 'url': '/vue/search/units.html', 'fcChnId': 'Se01' },
    { 'url': '/vue/search/doctor.html', 'fcChnId': 'Se03' },
    { 'url': '/vue/search/dep.html', 'fcChnId': 'Se02' },
    { 'url': '/vue/search/mall.html', 'fcChnId': 'Se05' },
    { 'url': '/vue/search/comment.html', 'fcChnId': 'Se06' },
    { 'url': '/vue/search/article.html', 'fcChnId': 'Se07' },
    { 'url': '/vue/unit/index.html', 'fcChnId': 'GH0' },
    { 'url': '/vue/unit/dep.html', 'fcChnId': 'H00.001' },
    { 'url': '/vue/unit/moredep.html', 'fcChnId': 'H00' },
    { 'url': '/vue/unit/depindex.html', 'fcChnId': 'B00' },
    { 'url': '/vue/doctor/index.html', 'fcChnId': 'D00' },
    { 'url': '/vue/unit/search.html', 'fcChnId': 'HSE0' },
    { 'url': '/order/confirm.html', 'fcChnId': 'YY00' },
    { 'url': '/account/index.html', 'fcChnId': 'G4' },
    { 'url': '/vue/network/index.html', 'fcChnId': 'WSH0' }
  ]

  var biFlag = true
  var listViewBoxView = ''
  var user_id = readCookie('user_id') || ''
  var device_id = readCookie('client_id') || ''
  var current_url = readCookie('curpageurl') || ''
  var frompageid = readCookie('frompageid') || ''
  var from_url = readCookie('from_url') || document.referrer
  var city_id = readCookie('city_id') || ''

  var isAnd = navigator.userAgent.includes('cid=20')
  var isIos = navigator.userAgent.includes('cid=24')
  var iscid = isAnd ? '20' : (isIos ? '24' : '')
	var CHANNEL_ID = iscid || (getUrlParam('cid') || readCookie('channel_id') || (isSureWeiXin() ? '23' :'16'))
  var clickpageid = ''

  // localStorage缓存上报失败数据
  var BIArray = [],zcBIArray = []//暂存
  BIArray = JSON.parse(window.localStorage.getItem('BIArray'))
  zcBIArray = JSON.parse(window.localStorage.getItem('BIArray'))
  if(BIArray){//如果存在，打开页面先上报
    var logcollect_domain
    if(CHANNEL_ID == 20 || CHANNEL_ID == 24){
      logcollect_domain = '//logcollect.91160.com/'
    }else {
      logcollect_domain = readCookie('logcollect_domain') || '//logcollect.91160.com/'
    }
    var url = (logcollect_domain + 'v2/biz/web/') || '//logcollect.91160.com/v2/biz/web/'
    againPushBIViewLog(url, JSON.stringify(BIArray))
  }


  $(document.body).on('click', '[data-event-BI]', function() { console.log('BI-----------')
    device_id = readCookie('client_id') || ''
    user_id = readCookie('user_id') || ''
    device_id = readCookie('client_id') || ''
    frompageid = readCookie('frompageid') || ''
    current_url = readCookie('curpageurl') || ''
    from_url = readCookie('from_url') || document.referrer
    city_id = readCookie('city_id') || ''
    CHANNEL_ID = iscid || (getUrlParam('cid') || readCookie('channel_id') || (isSureWeiXin() ? '23' :'16'))

    var bhv_type = $(this).attr('data-event-id') == 'search_view' ? 'search_click':'click'
    var eventBIVariables = $(this).attr('data-BI-params') && JSON.parse($(this).attr('data-BI-params')) || {}
    eventBIVariables.channel_id = CHANNEL_ID
    eventBIVariables.bhv_type = bhv_type
    eventBIVariables.item_type = 302
    fn_page_id.forEach((item,i) => {
      if(item.url == location.pathname) {
        clickpageid = item.fcChnId
      }
      if (item.fcChnId == 'DD00') {
        eventBIVariables.item_type = 302
      }
    })

    try {
      eventBIVariables =
        typeof eventBIVariables == 'string'
          ? JSON.parse(eventBIVariables)
          : eventBIVariables
      } catch (err) {}
    var isAdv = $(this).attr('isAdv') || 0
    var gofunction = $(this).attr('gofunction') || false
    var current_url = $(this).attr('data-url') || $(this).attr('href')
    var data_stat_info = $(this).attr('datastatinfo') || '' // 搜素页面才有这个标志
    sendBIClick({
      bhv_type: bhv_type,
      eventBIVariables: eventBIVariables,
      isAdv: isAdv,
      gofunction: gofunction,
      current_url: current_url,
      data_stat_info: data_stat_info
    })

  })
  var biFlag = true

  function sendBIClick(params){
    var logcollect_domain
    if(CHANNEL_ID == 20 || CHANNEL_ID == 24){
      logcollect_domain = '//logcollect.91160.com/'
    }else {
      logcollect_domain = readCookie('logcollect_domain') || '//logcollect.91160.com/'
    }
    var url = (logcollect_domain + 'v2/biz/web/') || '//logcollect.91160.com/v2/biz/web/'
    var eventBIVariables = params.eventBIVariables
    setCookie('frompageid',eventBIVariables.curpageid || '',0.2)
    var bhv_type = params.bhv_type

    var isAdv = params.isAdv
    var gofunction = params.gofunction
    var current_url = params.current_url
    var data_stat_info = params.data_stat_info
    var search_type = eventBIVariables.search_type
    var searchcontent = eventBIVariables.content
    var env = {}
    if(data_stat_info){
      env.search_type = search_type
      env.datastatinfo = data_stat_info
    }
    var BIparams = {
      curpageid: eventBIVariables.curpageid,
      item_type: eventBIVariables.item_type,
      bhv_type: bhv_type,
      channel_id: CHANNEL_ID,
      current_url: current_url,
      frompageid: readCookie('frompageid') || '',
      from_url: window.location.href,
      device_id: device_id,
      user_id: user_id,
      channel_id: CHANNEL_ID,
      bhv_time: parseInt(new Date().getTime()),
      city_id: city_id,
      item_id: eventBIVariables.item_id,
      trace_id: eventBIVariables.trace_id,
      bhv_pos: eventBIVariables.bhv_pos || 0
    }
    if(data_stat_info){
      BIparams.env = env
      BIparams.content = searchcontent
    }
    pushBILog(bhv_type, url, JSON.stringify(BIparams), isAdv, gofunction, current_url, data_stat_info)
  }
  function pushBILog(bhv_type, url, params, isAdv, gofunction, current_url, data_stat_info) {//BI上报
    if (biFlag) {
      biFlag = false
      if (data_stat_info) { //搜索
        if(isAdv == 0){
          // sendBeacon 方式，不需要等待后端返回，防止外链时上报数据丢失的问题
          // if (navigator.sendBeacon) {
          //   let result = navigator.sendBeacon(url, params)
          //   // result 为 true 代表已经加入网络队列，除非用户断网或网速极差，否则该上报数据不会丢失
          //   // console.log('sendBeacon:', true)
          //   if (result) {
          //     if(!gofunction){
          //       window.location.href = current_url
          //     }
          //     biFlag = true
          //   }
          // } else {
            $.ajax({
              url: url,
              data: params,
              contentType: "application/json;charset=utf-8",//这个参数也是header参数
              dataType: 'JSON',
              type: 'post',
              complete:function(XMLHttpRequest, textStatus){
                if(textStatus == 'error'){
                  BIArray.push(JSON.parse(params))
                  var newBIArray = BIArray.slice(-50)//取最新50条
                  window.localStorage.setItem('BIArray',JSON.stringify(newBIArray))
                }
              },
              success: function(res) {
                if(!gofunction){
                  window.location.href = current_url
                }
                biFlag = true
              },
              error:function() {
                biFlag = true
              }
            })
          // }
        } else {
          biFlag = true
          window.location.href = current_url
        }
      } else {
        // if (navigator.sendBeacon) {
        //   let result = navigator.sendBeacon(url, params)
        //   // result 为 true 代表已经加入网络队列，除非用户断网或网速极差，否则该上报数据不会丢失
        //   console.log('sendBeacon:', true)
        //   if (result) {
        //     biFlag = true
        //   }
        // } else {
          $.ajax({
            url: url,
            data: params,
            contentType: "application/json;charset=utf-8",//这个参数也是header参数
            dataType: 'JSON',
            type: 'post',
            complete:function(XMLHttpRequest, textStatus){
              if(textStatus == 'error'){
                BIArray.push(JSON.parse(params))
                var newBIArray = BIArray.slice(-50)//取最新50条
                window.localStorage.setItem('BIArray',JSON.stringify(newBIArray))
              }
            },
            success: function(res) {
              biFlag = true
              if(isAdv == 1){
                window.location.href = current_url
              }
            }
          })
        // }
      }

    }
  }

  function scrollViewCollect() {
    $(window).on('scroll', initBICollect)
  }
  function isVisible(dom) {
    //滚动条高度+视窗高度 = 可见区域底部高度
    var visibleBottom = window.scrollY + document.documentElement.clientHeight
    //可见区域顶部高度
    var visibleTop = window.scrollY
    var centerY = $(dom).offset().top + $(dom).height() / 2
    // console.log(visibleBottom,visibleTop,centerY,$(dom).offset().top)
    if ((centerY > visibleTop && centerY < visibleBottom) || $(dom).offset().top == 0) {
      return true
    }
    return false
  }
  function initBICollect() {
    listViewBoxView = $('[data-event-BI-view]') // 浏览上报
    if(listViewBoxView){
      listViewBoxView.each(function(i) {
        if (isVisible(this)) {
          if (!$(this).hasClass('view-bi-visiable')) {
            $(this).addClass('view-bi-visiable')
            var eventBIVariables = JSON.parse(
              $(this).attr('data-BI-params') || '{}'
            )
            var dataEventId = $(this).attr('data-event-id') || ''
            var data_stat_info = $(this).attr('datastatinfo') || '' // 搜素页面才有这个标志
            sendEventBIView({
              bhv_type: dataEventId == 'search_view' ? 'search_expose' :'expose',
              dataEventId:dataEventId,
              eventBIVariables: eventBIVariables,
              data_stat_info: data_stat_info
            })
          }
        } else {
          $(this).removeClass('view-bi-visiable')
        }
      })
    }
  }
  $(function() {
    setTimeout(function() {
      scrollViewCollect()
      initBICollect()
    }, 3000)
  })

  function sendEventBIView(params) {
    var bhv_type = params.bhv_type
    var eventBIVariables = params.eventBIVariables
    var logcollect_domain
    if(CHANNEL_ID == 20 || CHANNEL_ID == 24){
      logcollect_domain = '//logcollect.91160.com/'
    }else {
      logcollect_domain = readCookie('logcollect_domain') || '//logcollect.91160.com/'
    }
    var url = (logcollect_domain + 'v2/biz/web/') || '//logcollect.91160.com/v2/biz/web/'

    var logpageid = ''
    eventBIVariables.item_type = 302
    fn_page_id.forEach((item,i) => {
      if(item.url == location.pathname) {
        logpageid = item.fcChnId
      }
      if (item.fcChnId.startsWith("DD00")) {
        eventBIVariables.item_type = 302
      }
    })
    var device_id = readCookie('client_id') || ''
    var data_stat_info = params.data_stat_info
    var searchcontent = eventBIVariables.content

    var newparams = {
      item_type: eventBIVariables.item_type,
      bhv_type: bhv_type,
      channel_id: CHANNEL_ID,
      curpageid: eventBIVariables.curpageid || logpageid,
      frompageid: eventBIVariables.curpageid || logpageid,
      current_url: current_url,
      from_url: from_url,
      device_id: device_id,
      user_id: user_id,
      bhv_time: parseInt(new Date().getTime()),
      city_id: city_id,
      item_id: eventBIVariables.item_id,
      bhv_pos: eventBIVariables.bhv_pos || 0
    }
    if(data_stat_info){
      newparams.content = searchcontent || ''
    }
    if(params.dataEventId == 'feed_click'){
      newparams.trace_id = eventBIVariables.trace_id
    }
    if(eventBIVariables.isAdv != 1){
      pushBIViewLog(url, JSON.stringify(newparams))
    }
  }

  function againPushBIViewLog(url, params) {//页面浏览重报机制
    $.ajax({
      url: url,
      data: params,
      contentType: "application/json;charset=utf-8",//这个参数也是header参数
      dataType: 'JSON',
      type: 'post',
      complete:function(XMLHttpRequest, textStatus){
        // console.log(textStatus)
        if(textStatus == 'error'){
          var newzcBI = zcBIArray.concat(JSON.parse(params))
          BIArray = newzcBI.slice(-50)//取最新50条
          window.localStorage.setItem('BIArray',JSON.stringify(BIArray))
        }
      },
      success: function(res) {
        if(res.code == 0){
          localStorage.removeItem('BIArray')
        }
      }
    })
  }
  function pushBIViewLog(url, params) {//页面浏览上报
    BIArray = JSON.parse(window.localStorage.getItem('BIArray')) || []
    $.ajax({
      url: url,
      data: params,
      contentType: "application/json;charset=utf-8",//这个参数也是header参数
      dataType: 'JSON',
      type: 'post',
      complete:function(XMLHttpRequest, textStatus){
        if(textStatus == 'error'){
          BIArray.push(JSON.parse(params))
          var newBIArray = BIArray.slice(-50)//取最新50条
          window.localStorage.setItem('BIArray',JSON.stringify(newBIArray))
        }
      },
      success: function(res) {
      }
    })
  }

  function ajaxSendEventBIView(params) {
    var bhv_type = 'view'
    var logcollect_domain
    if(CHANNEL_ID == 20 || CHANNEL_ID == 24){
      logcollect_domain = '//logcollect.91160.com/'
    }else {
      logcollect_domain = readCookie('logcollect_domain') || '//logcollect.91160.com/'
    }
    var url = (logcollect_domain + 'v2/biz/web/') || '//logcollect.91160.com/v2/biz/web/'

    var device_id = readCookie('client_id') || ''

    var newparams = {
      item_type: 0,
      bhv_type: bhv_type,
      channel_id: CHANNEL_ID,
      curpageid: params.curpageid,
      frompageid: '',
      current_url: params.current_url,
      from_url: '',
      device_id: device_id,
      user_id: params.user_id,
      bhv_time: parseInt(new Date().getTime()),
      city_id: city_id,
      psnum1: params.activityid
    }
    ajaxPushBIViewLog(url, JSON.stringify(newparams))
  }

  function ajaxPushBIViewLog(url, params) {//页面浏览上报-vue调接口返回后触发
    $.ajax({
      url: url,
      data: params,
      contentType: "application/json;charset=utf-8",//这个参数也是header参数
      dataType: 'JSON',
      type: 'post',
      complete:function(XMLHttpRequest, textStatus){
        if(textStatus == 'error'){
        }
      },
      success: function(res) {
      }
    })
  }



  function getUrlParam(pname) {
    var params = location.search.substr(1); // 获取参数 平且去掉？
    var ArrParam = params.split('&');
    //多个参数参数的情况
    for (var i = 0; i < ArrParam.length; i++) {
        if (ArrParam[i].split('=')[0] == pname) {
            return ArrParam[i].split('=')[1];
        }
    }
  }
    //判断是否是微信浏览器的函数
  function isWeiXin(){
    //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
      var ua = window.navigator.userAgent.toLowerCase();
      //通过正则表达式匹配ua中是否含有MicroMessenger字符串
      if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
    }else{
        return false;
      }
  }
  function isSureWeiXin(){
    //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
      var ua = window.navigator.userAgent.toLowerCase();
      //通过正则表达式匹配ua中是否含有MicroMessenger字符串
      if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
    }else{
        return false;
      }
  }
  function setCookie(name, value, days){
    var ndays = days || 0.2
    var exp = new Date()
    exp.setTime(exp.getTime() + ndays * 24 * 60 * 60 * 1000)
    var secure = document.location.protocol == 'https:' ? ';secure=true' : ''
    document.cookie = name + '_v2=' + Base64.encode(value) + ';expires=' + exp.toGMTString() + secure + ';path=/;domain=.91160.com'
  }
  function readCookie(name) {
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
  return {
    BiListView:function(){//搜索浏览上报，vue betterscroll专用
      initBICollect()
    },
    ajaxSendEventBIView:function(curpageid,current_url,activityid,user_id){
      const params = {curpageid,current_url,activityid,user_id}
      ajaxSendEventBIView(params)
    }
  }
})
