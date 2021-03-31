/*
 * @Description:
 * @Version:
 * @Author: helloSun
 * @Date: 2020-05-20 15:40:39
 * @LastEditors: Do not edit
 * @LastEditTime: 2021-03-29 16:59:18
 */
import { channelMixin, shareFunc, seoContent } from '@/components/mixin'
import { getSafeCid, commonIsApp } from '@/utils/util'
import { doTaskComplete, getPointEarn } from '@/services/modules/userPoint'
import { shareForCoins, getExValue } from '@/services/modules/topList'

export default {
  data() {
    return {
      exValue: ''
    }
  },
  mixins: [
    channelMixin,
    shareFunc,
    seoContent
  ],
  computed: {
    ...mapGetters(['userInfo_copy'])
  },
  mounted() {
    // this.setunshare()
    // app分享加积分调用,链接上必须带任务id
    if (this.$route && this.$route.query && this.$route.query.task_id && commonIsApp()) {
      if (!window.getSharePoint) {
        window.getSharePoint = this._doTaskComplete
      }
    }
  },
  methods: {
    pageShow(e) {
      if (e.persisted || (window.performance &&
        window.performance.navigation.type == 2)) {
        console.log('enter pageShow and reload...')
        location.reload()
      }
    },
    watchPageShow() {
      if (this.$route.query.task_id && this.$route.query.business_mark && !!window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
        console.log('enter pageShow...')
        window.addEventListener('pageshow', this.pageShow, false)
      }
    },
    cancelWatchPage() {
      window.removeEventListener('pageshow', this.pageShow)
    },
    buildCommonShare(options) {
      const cid = getSafeCid()
      let appVersion = ''
      if (window.mJavaScriptObject) {
        appVersion = mJavaScriptObject.funGetVersion()
        options.link = `${options.link}&ny_from=app${cid}v${appVersion}`
        console.log(options.link)
      }
      const seoOptions = {
        keywords: options.title,
        description: options.desc
      }
      this.setSeoContent(seoOptions)
      try {
        Object.assign(this.shareOptions, options)
        if (this.isWeixin) {
          this.wxShare()
        } else {
          this.getAppShareToken()
        }
      } catch (err) {
        console.log(err)
      }
    },
    addShareMark(link) {
      if (!link.includes('fromshare')) {
        if (link.includes('?')) {
          link += '&fromshare=1'
        } else {
          link += '?fromshare=1'
        }
      }
      return link
    },
    setunshare() {
      var setunshare = this.$route.meta.unshare || '0'
      var unshare = this.$route.query.unshare || '0'

      if ((typeof mJavaScriptObject) === 'object' && (this.cid == 20 || this.cid == 24)) {
        /* app中右上角分享按钮处理
            默认都展示右上角分享按钮
            如果地址栏上面有unshare 并且等于1，则不出现右上角分享按钮
          */
        // console.log('unshare:88888888', unshare, 'setunshare:', setunshare)
        if (unshare == 1 || setunshare == 1) {
          mJavaScriptObject.funShowShareButton('0')
        } else {
          mJavaScriptObject.funShowShareButton('1')
        }
      }
    },
    showCountdowner() {
      // 配置了浏览时长
      if (this.$route.query.time_limit && parseInt(this.$route.query.task_status || 0) === 0) {
        this.$countDown.show({ second: parseInt(this.$route.query.time_limit), complete: this.timeIsUp, amount: parseInt(this.$route.query.amount) })
      }
    },
    // 倒计时结束
    timeIsUp() {
      console.log(1)
      this.$countDown.hide()
      this._doTaskComplete()
    },
    // 完成任务后加积分
    doPointTaskComplete(params) {
      doTaskComplete(params).then(res => {
        if (res.result_code === 1) {
          this._getPointEarn(this.$route.query.action)
          console.log(location.href)
          const url = location.href.replace(/action_view/, '')
          history.replaceState(null, '', url)
          console.log(url)
          console.log(location.href)
        }
      })
    },
    _doTaskComplete() {
      const taskId = this.$route.query.task_id ? parseInt(this.$route.query.task_id) : 0
      const businessMark = this.$route.query.business_mark || 'content_leaderboard'
      const action = this.$route.query.action || 'action_share'
      let objectId = this.$route.query.object_id ? parseInt(this.$route.query.object_id) : 0

      if (location.href.toLocaleLowerCase().includes('toplist/detail.html') && objectId == 0) {
        objectId = parseInt(this.$route.query.leader_id)
      }

      const shareUrl = location.href
      const userId = this.userInfo_copy && this.userInfo_copy.user_id ? parseInt(this.userInfo_copy.user_id) : 0
      this.doPointTaskComplete({
        business_mark: businessMark,
        task_id: taskId,
        action: action,
        object_id: objectId,
        share_url: shareUrl,
        user_id: userId
      })
    },
    // 获取任务类型
    // 0其他，1浏览，2分享，3留言，4拉新，5消费，6赠送，7点赞，8点评
    // action 4:浏览 5：分享
    getTaskType() {
      return this.$route.query.action
    },
    isShareAction() {
      return this.$route.query.action === 'action_share'
    },
    isBrowseAction() {
      return this.$route.query.action === 'action_view'
    },
    isZanAction() {
      return this.$route.query.action === 'action_like'
    },
    isCommentAction() {
      return this.$route.query.action === 'action_add'
    },
    // 获取用户完成任务后获取到的积分数
    _getPointEarn(action) {
      const st = setTimeout(() => {
        getPointEarn({
          user_id: (this.userInfo_copy && this.userInfo_copy.user_id) || '',
          business_mark: this.$route.query.business_mark || '', // 0其他，1浏览，2分享，3留言，4拉新，5消费，6赠送，7点赞，8点评
          object_id: this.$route.query.object_id || 0,
          task_id: this.$route.query.task_id ? parseInt(this.$route.query.task_id) : 0,
          action: action || 'action_add'
        }).then(res => {
          if (res.result_code === 1) {
            const earnAmount = res.data.amount
            if (earnAmount > 0) {
              // this.showPointTip = true
              this.$pointTip.show({ num: earnAmount })
            }
          }
        })
        clearTimeout(st)
      }, 500)
    },

    /** ******************************************/
    // 分享成功后调用获取积分接口
    // deprecated
    shareForUserPoint(business_id) {
      shareForCoins({
        user_key: (this.userInfo_copy && this.userInfo_copy.user_key) || '',
        user_id: (this.userInfo_copy && this.userInfo_copy.user_id && parseInt(this.userInfo_copy.user_id)) || '',
        task_id: this.$route.query.task_id ? parseInt(this.$route.query.task_id) : 0,
        share_link: location.href,
        business_id: business_id || 0,
        ex: this.exValue
      }).then(res => {

      }).catch(err => {
        console.log(err)
      })
    },
    _getExValue() {
      getExValue().then(res => {
        if (res.result_code === 1) {
          this.exValue = res.data.ex || ''
        }
      })
    }
    /** ******************************************/
  }
}
