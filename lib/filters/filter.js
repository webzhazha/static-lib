import dayjs from 'dayjs'
import { getSafeCid } from '@/utils/util'

const DAYSECOND = 24 * 60 * 60
const HOURSECOND = 60 * 60
const MINSECOND = 60

const DAYSEC = DAYSECOND * 1000
const HOURSEC = HOURSECOND * 1000
const MINSEC = MINSECOND * 1000

const cid = getSafeCid()

export const toFixed = (value, params) => { // 全部指令,组件内部使用v-title,data-title="XXX"使用
  if (value) {
    return Number(value).toFixed(params)
  }
  return value
}

export const timeFormat = (value) => { // 根据毫秒值计算时间
  var nValue = parseInt(value)
  function double(val) {
    return val >= 10 ? val : ('0' + val)
  }
  var d = new Date()
  var time = new Date(nValue)
  d.setHours(0)
  d.setMinutes(0)
  d.setSeconds(0)
  var start = d.setMilliseconds(0)
  var isToday = d.getDate() == time.getDate()
  if ((nValue - start) < 24 * 60 * 60 * 1000 && isToday) {
    return double(time.getHours()) + ':' + double(time.getMinutes())
  } else {
    var str = ''
    str += time.toLocaleDateString()
    str += ' '
    str += double(time.getHours()) + ':' + double(time.getMinutes())
    return str
  }
}

export const unescapeHtml = (html) => {
  return html
    .replace(html ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "\'")
}
export const secondFormat = (value) => {
  var hour = parseInt(value % DAYSECOND / HOURSECOND)
  var min = parseInt(value % HOURSECOND / MINSECOND)
  var sec = parseInt(value % MINSECOND)
  var min2 = min > 9 ? min : '0' + min
  var sec2 = sec > 9 ? sec : '0' + sec
  var str = ''
  if (hour > 0) {
    if (min > 0) {
      str = `${hour}:${min2}:00`
    } else {
      str = `${hour}:00:00`
    }
  } else if (min > 0) {
    if (sec > 0) {
      str = `${min2}:${sec2}`
    } else {
      str = `${min2}:00`
    }
  } else {
    str = `00:${sec2}`
  }
  return str
}
export const hourFormat = (value) => { // 根据毫秒值计算时间
  var day = parseInt(value / DAYSEC)
  var hour = parseInt(value % DAYSEC / HOURSEC)
  var min = parseInt(value % HOURSEC / MINSEC)
  var sec = parseInt(value % MINSEC / 1000)
  var str = ''
  if (day > 0) {
    if (hour > 0) {
      str = `${day}天${hour}小时`
    } else {
      str = `${day}天`
    }
  } else if (hour > 0) {
    if (min > 0) {
      str = `${hour}小时${min}分钟`
    } else {
      str = `${hour}小时`
    }
  } else if (min > 0) {
    if (sec > 0) {
      str = `${min}分钟${sec}秒`
    } else {
      str = `${min}分钟`
    }
  } else {
    str = `${sec}秒`
  }
  return str
}

export const urlFixed = (value) => { // 自动替换域名
  if (value) {
    var index = value.indexOf('91160.com')
    if (index > -1 && cid != 20 && cid != 24) { // 忽略app里面
      return value.substr(index + 9)
    } else {
      return value
    }
  }
}

export const timeFormate = (val) => {
  var date = new Date(val * 1000)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return `至${year}年${month}月${day}日`
}

export const UTCtimeFormate = (val) => {
  return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
}

export const timeFormatDot = (val) => {
  if (val) {
    var time = val.split(' ')[0]
    return time.replace(/-/g, '.')
  }
}

export const cubeTimeFormate = (val) => {
  var date = new Date(val * 1000)
  var year = date.getFullYear() || ''
  var month = (date.getMonth() + 1) || ''
  var day = date.getDate() || ''
  return `${year}年${month}月${day}日`
}

export const tranNumber = (num) => {
  var numStr = num.toString()
  if (numStr.length < 5) {
    return numStr
  } else if (numStr.length >= 5) {
    return (Math.round(parseInt(num) / 1000) / 10) + '万'
  }
}

export const tranWan = (num) => {
  var numStr = num.toString()
  if (numStr.length < 5) {
    return numStr
  } else if (numStr.length >= 5) {
    return (Math.round(parseInt(num) / 1000) / 10) + 'w'
  }
}
