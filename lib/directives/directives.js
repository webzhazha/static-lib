import { getSafeCid } from '@/utils/util'
import { STATICDOMAIN } from '@/config/GlobalSetting'

// 全部指令,组件内部使用v-title,data-title="XXX"使用
export const title = (el, binding) => {
  if (el.dataset.title) {
    document.title = el.dataset.title
    // if ((typeof mJavaScriptObject) === 'object' && mJavaScriptObject.hasOwnProperty('funSetWebViewTitle')) {
    //   mJavaScriptObject.funSetWebViewTitle(el.dataset.title)
    // }
    // if ((typeof NyStoreManager) === 'object' && NyStoreManager.hasOwnProperty('funSetWebViewTitle')) {
    //   NyStoreManager.funSetWebViewTitle(el.dataset.title)
    // }
  }
}
// 全部指令,组件内部使用v-title,data-title="XXX"使用
export const fullheight = (el, binding) => {
  document.body.style = 'height:100%'
}
// 全部指令,组件内部使用v-title,data-title="XXX"使用
export const fullWidth = (el, binding) => {
  document.body.style = 'width:100%;overflow-x:hidden;'
}
// input,textarea点击获得焦点
export const inputfocus = (el) => {
  el.onclick = function() {
    el.focus()
  }
}
// 全部指令-医生医院拉app原生，组件内部使用v-pullapp,data-params={}使用,pulltype:doctor拉医生，unit拉医院,type:2咨询
export const pullapp = (el) => {
  var cid = getSafeCid()
  el.onclick = function() {
    var params = JSON.parse(el.dataset.params)
    var urltype = ''
    // 0:无分院 1:有分院(非定制化主页) 2:定制化医院主页
    var jump_type = params.jump_type || 0
    // 定制化主页地址
    var jump_url = params.jump_url || ''
    if ((typeof mJavaScriptObject) === 'object' && (cid == 20 || cid == 24)) {
      if (params.app_native_tpl) {
        if (mJavaScriptObject.callbackNative(params.app_native_tpl)) {
          return false
        }
      }
      return true
    }
    console.log(params)
    if (params.pulltype == 'doctor') {
      urltype = (params.type == 2) ? 'askdoc' : 'guahao'
      window.location.href = '/vue/doctor/detail.html?unit_id=' + params.unit_id + '&dep_id=' + params.dep_id + '&doc_id=' + params.doctor_id + '&type=' + urltype
    } else if (params.pulltype == 'unit') {
      if (jump_type != 2) {
        window.location.href = '/unit/dep.html?unit_id=' + params.unit_id
      } else {
        window.location.href = jump_url
      }
    } else if (params.pulltype == 'dep') {
      window.location.href = '/doctor/index.html?unit_id=' + params.unit_id + '&dep_id=' + params.dep_id
      // 拉名医页面
    } else if (params.pulltype == 'famousdoctor') {
      window.location.href = '/ask/index.html'
      // 拉健康课
    } else if (params.pulltype == 'music') {
      window.location.href = '/vue/doctorlesson/detail.html?classId=' + params.class_id + '&fileId=' + params.file_id
      // 拉健康课介绍页
    } else if (params.pulltype == 'musicintro') {
      window.location.href = '/vue/doctorlesson/intro.html?classId=' + params.class_id
    } else if (params.pulltype == 'video') {
      window.location.href = '/video/detail.html?file_id=' + params.file_id
    }
  }
  return true
}

// 拖拽
export const drag = (el, binding) => {
  const elWidth = Number(el.dataset.width) || 66
  const elHeight = Number(el.dataset.height) || 100
  let l = ''
  const oDiv = el // 当前元素
  const windowWidth = document.body.clientWidth || document.documentElement.clientWidth
  const windowHeight = document.body.clientHeight || document.documentElement.clientHeight
  const ratio = windowWidth / 375
  const rightDis = windowWidth - (0 + elWidth) * ratio
  oDiv.addEventListener('touchstart', function(e) {
    const f = e.touches[0]
    // 鼠标按下，计算当前元素距离可视区的距离
    const disX = f.clientX - oDiv.offsetLeft
    const disY = f.clientY - oDiv.offsetTop

    function move(e) {
      e.preventDefault()
      const f = e.touches[0]
      // 通过事件委托，计算移动的距离
      l = f.clientX - disX
      let t = f.clientY - disY
      if (l <= 0 * ratio) { // 左边界
        l = 0 * ratio
      } else if (l >= rightDis) { // 右边界
        l = rightDis
      }
      if (t <= 0) { // 上边界
        t = 0
      } else if (t >= windowHeight - elHeight * ratio) { // 下边界
        t = windowHeight - elHeight * ratio
      }
      // 移动当前元素
      oDiv.style.left = l + 'px'
      oDiv.style.top = t + 'px'
      // 将此时的位置传出去
      binding.value({
        x: f.pageX,
        y: f.pageY
      })
    }
    document.addEventListener('touchmove', move)
    document.addEventListener('touchend', function(e) {
      binding.value('end')
      if (l && l <= (windowWidth / 2 - (0 + elWidth / 2) * ratio)) { // 如果没有移动,l为''
        oDiv.style.left = 15 * ratio + 'px'
      } else {
        oDiv.style.left = (windowWidth - (0 + elWidth) * ratio) + 'px'
      }
      document.removeEventListener('touchmove', move) // 解绑事件,防止页面滚动的时候广告一起滚
      document.ontouchend = null
    })
  })
  oDiv.addEventListener('touchstart', function(e) {
    e.preventDefault()
  })
}

// 拖拽
export const mydrag = (el, binding) => {
  const elWidth = Number(el.dataset.width) || 66
  const elHeight = Number(el.dataset.height) || 100
  let l = ''
  const oDiv = el // 当前元素
  const windowWidth = document.body.clientWidth || document.documentElement.clientWidth
  const windowHeight = document.body.clientHeight || document.documentElement.clientHeight
  const ratio = windowWidth / 375
  const rightDis = windowWidth - (0 + elWidth) * ratio
  oDiv.addEventListener('touchstart', function(e) {
    const f = e.touches[0]
    // 鼠标按下，计算当前元素距离可视区的距离
    const disX = f.clientX - oDiv.offsetLeft
    const disY = f.clientY - oDiv.offsetTop

    function move(e) {
      e.preventDefault()
      const f = e.touches[0]
      // 通过事件委托，计算移动的距离
      l = f.clientX - disX
      let t = f.clientY - disY
      if (l <= 0 * ratio) { // 左边界
        l = 0 * ratio
      } else if (l >= rightDis) { // 右边界
        l = rightDis
      }
      if (t <= 0) { // 上边界
        t = 0
      } else if (t >= windowHeight - elHeight * ratio) { // 下边界
        t = windowHeight - elHeight * ratio
      }
      // 移动当前元素
      oDiv.style.left = l + 'px'
      oDiv.style.top = t + 'px'
      // 将此时的位置传出去
      binding.value({
        x: f.pageX,
        y: f.pageY
      })
    }
    oDiv.addEventListener('touchmove', move)
    oDiv.addEventListener('touchend', function(e) {
      binding.value('end')
      if (l && l <= (windowWidth / 2 - (0 + elWidth / 2) * ratio)) { // 如果没有移动,l为''
        oDiv.style.left = 15 * ratio + 'px'
      } else {
        oDiv.style.left = (windowWidth - (0 + elWidth) * ratio) + 'px'
      }
      oDiv.removeEventListener('touchmove', move) // 解绑事件,防止页面滚动的时候广告一起滚
      document.ontouchend = null
      oDiv.ontouchend = null
    })
  })
  oDiv.addEventListener('touchstart', function(e) {
    e.preventDefault()
  })
}

// 自定义指令处理头像问题
export const avatar = (el) => {
  const imageMap = {
    doctor: '/wechat/img/common/default_doc.png',
    microclass: '/wechat/img/common/logo.jpg',
    logo: '/wechat/img/common/logo.jpg',
    unit: '/wechat/img/common/unit_default.png',
    hospital: '/wechat/img/common/default_hospital.gif',
    product: '/wechat/img/common/default_hos_image.png',
    card: '/wechat/img/common/default_hos_image.png',
    avatar: '/wechat/img/common/logo.png',
    user: ['/wechat/img/common/avatar_user_.jpg', '/wechat/img/common/avatar_user_1.jpg']
  }
  const { type, sex } = el.dataset
  const { src } = el
  if (!src && type != 'user') {
    el.src = STATICDOMAIN + imageMap[type]
  } else if (!src && type == 'user') {
    el.src = STATICDOMAIN + imageMap[type][sex]
  }
  el.addEventListener('error', function() {
    if (type != 'user') {
      el.src = STATICDOMAIN + imageMap[type]
    } else {
      el.src = STATICDOMAIN + imageMap[type][sex]
    }
  })
}
