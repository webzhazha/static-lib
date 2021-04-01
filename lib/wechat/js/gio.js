;(function(root, factory) {
  if (typeof exports === 'object') {
    module.exports = factory()
  } else if (typeof define === 'function' && define.amd) {
    define(factory)
  } else {
    root.GIO = factory()
  }
})(this, function() {

  var styleArr = []
  var adChannel_cstVar = window.location.host.split('.')[0] // 渠道  wap/weixin
  var viewBox = '',searchViewBox = '',feedViewBox = ''
  var user_id = window.localStorage.getItem('user_id') || ''

  var isAnd = navigator.userAgent.includes('cid=20')
  var isIos = navigator.userAgent.includes('cid=24')
  var iscid = isAnd ? '20' : (isIos ? '24' : '')
  var CHANNEL_ID = iscid || (getUrlParam('cid')  || (isSureWeiXin() ? '23' :'16'))

  $(document.body).on('click', '[data-event-id]', function() {
    var eventId = $(this).data('event-id')
    if (eventId == 'search_view') {
      return
    }
    var eventLevelVariables = $(this).data('event-params') || {}
    var adSpreadSort_cstVar = $(this).index() // 序号
    eventLevelVariables.adChannel_cstVar = adChannel_cstVar
    eventLevelVariables.adSpreadSort_cstVar = adSpreadSort_cstVar
    try {
      eventLevelVariables =
        typeof eventLevelVariables == 'string'
          ? JSON.parse(eventLevelVariables)
          : eventLevelVariables
    } catch (err) {
    }
    sendEventClick({
      eventId: eventId,
      eventLevelVariables: eventLevelVariables
    })
  })


  function scrollViewCollect() {
    $(window).on('scroll', initCollect)
    $(window).on('scroll', indexReportCollect)//首页浏览滚动上报
  }
  function isVisible(dom) {
    //滚动条高度+视窗高度 = 可见区域底部高度
    var visibleBottom = window.scrollY + document.documentElement.clientHeight
    //可见区域顶部高度
    var visibleTop = window.scrollY
    var centerY = $(dom).offset().top + $(dom).height() / 2
    if (centerY > visibleTop && centerY < visibleBottom) {
      return true
    }
    return false
  }
  function indexReportCollect(){//首页浏览上报
    //兼容vue那边的vux swiper
    viewBox = $('[data-gio-view]')
    if(viewBox){
      viewBox.each(function(i) {
        if (isVisible(this)) {
          if (!$(this).hasClass('view-visiable')) {
            $(this).addClass('view-visiable')
            var adSpreadSort_cstVar = $(this).index() // 序号
            var eventLevelVariables = JSON.parse(
              $(this).attr('data-event-params') || '{}'
            )
            eventLevelVariables.adChannel_cstVar = adChannel_cstVar
            eventLevelVariables.adSpreadSort_cstVar = adSpreadSort_cstVar
            sendEventClick({
              eventId: 'ad_view',
              eventLevelVariables: eventLevelVariables
            })
          }
        } else {
          $(this).removeClass('view-visiable')
        }
      })
    }
  }

  function homeAdModalReport() {
    var vb = document.querySelector('a.home-ad-modal')
    if (vb) {
      if (!vb.classList.contains('view-visiable')) {
        vb.classList.add('view-visiable')
        var eventLevelVariables = JSON.parse(
          vb.getAttribute('data-event-params') || '{}'
        )
        console.log('homeAdModalReport',eventLevelVariables)
        eventLevelVariables.adChannel_cstVar = adChannel_cstVar
        eventLevelVariables.adSpreadSort_cstVar = 0
        sendEventClick({
          eventId: 'ad_view',
          eventLevelVariables: eventLevelVariables
        })
      }else {
        vb.classList.remove('view-visiable')
      }
    }
  }
  function initCollect() {
    feedViewBox = $('[data-event-view]')
    if(feedViewBox){//搜索浏览只上报一次，
      feedViewBox.each(function(i) {
        if (isVisible(this)) {
          if (!$(this).hasClass('view-visiable')) {
            $(this).addClass('view-visiable')
            var eventLevelVariables = JSON.parse(
              $(this).attr('data-event-params') || '{}'
            )
            eventLevelVariables.adChannel_cstVar = adChannel_cstVar
            sendEventClick({
              eventId: 'feed_view',
              eventLevelVariables: eventLevelVariables
            })
          }
        }
      })
    }
  }
  $(function(params) {
    var timer = setInterval(function() {
      $('.swiper-wrapper').each(function(index) {
        if (
          styleArr[index] &&
          styleArr[index] != $(this).attr('style') &&
          isVisible(this)
        ) {
          var _this = $(this).find('.swiper-slide-active')
          var adSpreadSort_cstVar = _this.index() // 序号
          var eventLevelVariables = _this.attr('data-event-params')
          if (eventLevelVariables) {
            eventLevelVariables = JSON.parse(eventLevelVariables)
            eventLevelVariables.adChannel_cstVar = adChannel_cstVar
            eventLevelVariables.adSpreadSort_cstVar = adSpreadSort_cstVar
            sendEventClick({
              eventId: 'ad_view',
              eventLevelVariables: eventLevelVariables
            })
          }
        }
        styleArr[index] = $(this).attr('style')
      })
    }, 3000)
    setTimeout(function() {
      scrollViewCollect()
      initCollect()
    }, 3000)
  })
  function pushAdvertLog(eventId, url, params,jump_url) {//广告上报
    if (adFlag) {
      adFlag = false
      // sendBeacon 方式，不需要等待后端返回，防止外链时上报数据丢失的问题
      if (navigator.sendBeacon) {
        const tempUrl = url + '?cid=' + CHANNEL_ID + '&user_id=' + user_id
        let result = navigator.sendBeacon(tempUrl, params)
        // result 为 true 代表已经加入网络队列，除非用户断网或网速极差，否则该上报数据不会丢失
        // console.log('sendBeacon:', true)
        if (result) {
          adFlag = true
          if (eventId == 'ad_view') {
            viewAds = []
          }
        }
        if(jump_url && jump_url.length > 10){
          location.href = jump_url
        }
      } else {
        $.ajax({
          url: url + '?cid=' + CHANNEL_ID + '&user_id=' + user_id,
          data: params,
          contentType: "application/json;charset=utf-8",//这个参数也是header参数
          dataType: 'JSON',
          type: 'post',
          success: function(res) {
            adFlag = true
            if (eventId == 'ad_view') {
              viewAds = []
            }
            if(jump_url && jump_url.length > 10){
              location.href = jump_url
            }
          },
          error: function() {
            if (jump_url && jump_url.length > 10) {
              location.href = jump_url
            }
          }
        })
      }
    }
  }

  var viewAds = [],
    adFlag = true,searchFlag = true

  setInterval(function(params) {
    if (viewAds.length > 0) {
      pushAdvertLog('ad_view', '//wechatgate.91160.com/advert-stat/v1/advert/view', JSON.stringify(viewAds))
    }
  }, 2000)
  function sendEventClick(params) {
    var eventId = params.eventId
    var eventLevelVariables = params.eventLevelVariables
    var url = ''
    if (eventId == 'ad_view') {
      url = '//wechatgate.91160.com/advert-stat/v1/advert/view'
    } else if (eventId == 'ad_click') {
      url = '//wechatgate.91160.com/advert-stat/v1/advert/click'
    }
    if (eventId == 'ad_view' || eventId == 'ad_click') {
      // 自己平台的数据上报
      try {
        var adparams = {
          ad_id: eventLevelVariables.id || eventLevelVariables.ad_id,
          locate_id: eventLevelVariables.adLocationId_cstVar,
          jump_url: eventLevelVariables.jump_url
        }
        var adparamsArry = []
        adparamsArry.push(adparams)
        if (eventId == 'ad_click') {
          pushAdvertLog(eventId, url, JSON.stringify(adparamsArry),adparams.jump_url)
        } else {
          viewAds.push(adparams)
        }
      } catch (err) {}
    }
  }
  // function sendEventSearch(params) {
  //   var eventId = params.eventId
  //   var eventLevelVariables = params.eventLevelVariables
  //   var url = '/search/ajaxAddviewlog.html'
  //   // 自己平台的数据上报
  //   var params = {
  //     city_id: $(".chooseCity").find('i').attr('city_id') || 0,
  //     data_stat_info: eventLevelVariables.data_stat_info || '',
  //     search_result_no: eventLevelVariables.search_result_no || 0,
  //     search_string: $("#new_search").val() ? $("#new_search").val() : $("#new_search").attr('placeholder'),
  //     current_page_type: 3,
  //     current_url: eventLevelVariables.current_url,
  //     from_page_type: 2,
  //     from_url: window.location.href,
  //     search_type: eventLevelVariables.search_type,
  //     document_id: eventLevelVariables.document_id,
  //     tj_bize_type: eventLevelVariables.tj_bize_type,
  //     user_id:user_id
  //   }
  //   if(eventLevelVariables.isAdv != 1){
  //     pushSearchLog(eventId, url, params)
  //     searchviewAds.push(params)
  //   }
  // }
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
  return {
    sendClick: function(params) {
      sendEventClick(params)
    },
    searchView:function(){//搜索浏览上报，vue betterscroll专用
      initCollect()
    },
    adReportView:function(){//首页浏览上报
      indexReportCollect()
    },
    homeAdModalReportView() {
      homeAdModalReport()
    }
  }
})
