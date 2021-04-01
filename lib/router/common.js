// common
const City = () => import(/* webpackChunkName: common */ '@/components/common/City.vue')
const ErrorPage = () => import(/* webpackChunkName: common */ '@/components/common/404.vue')
const SearchDisease = () => import(/* webpackChunkName: common */ '@/components/common/searchDisease.vue')
const healthyCardHeal = () => import(/* webpackChunkName: common */ '@/components/common/healthyCardHeal')
const qiyuMiddle = () => import(/* webpackChunkName: common */ '@/components/common/qiyuMiddle.vue')

export default [
  // 选择城市
  { path: 'city/index.html', component: City },
  { path: 'searchDisease.html', component: SearchDisease },
  { path: 'healthyCardHeal.html', component: healthyCardHeal },
  { path: 'qiyuMiddle.html', name: 'qiYuMiddle', component: qiyuMiddle },
  { path: '*', component: ErrorPage, name: '404' }
]
