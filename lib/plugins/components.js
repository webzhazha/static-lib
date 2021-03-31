import Vue from 'vue'
import Loading from '@/components/common/loading/index.js'
import navigateBar from '../components/common/navigatebar/index.js'

import { ToastPlugin, LoadingPlugin } from 'vux'

Vue.use(navigateBar).use(Loading).use(ToastPlugin).use(LoadingPlugin)
