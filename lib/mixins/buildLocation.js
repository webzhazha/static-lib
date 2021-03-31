export default {
  methods: {
    jumpRouterUrl(url) {
      document.location.href = url
    },
    goLogin(params = {}) {
      let paramsToStr = ''
      if (Object.keys(params).length) {
        sensorsCustomize.$setCommonProps({
          cur_function_id: params.from_function_id
        })
        for (const key in params) {
          paramsToStr += `&${key}=${params[key]}`
        }
      }
      console.log(paramsToStr)
      location.href = '/user/login.html?redirect_url=' + encodeURIComponent(location.href) + paramsToStr
    },
    // 跳转的APP下载链接
    goDownloadApp() {
      const time = new Date()
      setTimeout(() => {
        const timeout = new Date()
        if (timeout - time < 5000) {
          window.location.href = 'http://wap.91160.com/index.php?c=scan&a=index&code=dPhS3aD5q4R0%2BFLdoPmrhMG1v.hgq2fGRCOS7wVwqXCgYLhdNDaUnQ%3D%3D'
        } else {
          window.close()
        }
      }, 1000)
      if (/android|Android/i.test(navigator.userAgent)) {
        // 安卓暴露的接口
        window.location.href = 'jiuyi160://www.91160.com'
      } else {
        // IOS的暴露接口
        window.location.href = 'jiuyi160://www.91160.com'
      }
    }
  }
}
