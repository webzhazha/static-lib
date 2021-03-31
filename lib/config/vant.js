/*
 * @Description:
 * @Version:
 * @Author: helloSun
 * @Date: 2020-05-20 15:40:39
 * @LastEditors: liuhaitao
 * @LastEditTime: 2021-03-31 18:27:02
 */
import Vue from 'vue'
import { Button } from 'vant'
import { Swipe, SwipeItem } from 'vant'
import { Form } from 'vant'
import { Field } from 'vant'
import { RadioGroup, Radio } from 'vant'
import { Checkbox, CheckboxGroup } from 'vant'
import { Toast } from 'vant'
import { Tab, Tabs } from 'vant'
import { Popup } from 'vant'
import { Picker } from 'vant'
import { Dialog } from 'vant'
import { Sticky } from 'vant'
import { Search } from 'vant'
import { List } from 'vant'
import { Cell, CellGroup } from 'vant'
import { ImagePreview } from 'vant'
import { DropdownMenu, DropdownItem } from 'vant'
import { TreeSelect } from 'vant'
import { Loading } from 'vant'
import { Uploader } from 'vant'
import { Icon } from 'vant'
import { Image as VanImage } from 'vant'
import { Lazyload } from 'vant'
import { Step, Steps } from 'vant'
import { Rate } from 'vant'
import { ActionSheet } from 'vant'

import { DatetimePicker } from 'vant'
import { Overlay } from 'vant'
import { Collapse, CollapseItem } from 'vant'
import { CountDown } from 'vant'
import { Divider } from 'vant'
import { NoticeBar } from 'vant'
import { PullRefresh  } from 'vant';
// 按需引入
Vue.use(Cell)
Vue.use(CellGroup)

Vue.use(Popup)
Vue.use(Toast)
Vue.use(Picker)
Vue.use(Dialog)

Vue.use(Checkbox)
Vue.use(CheckboxGroup)

Vue.use(Radio)
Vue.use(RadioGroup)

Vue.use(Swipe).use(SwipeItem).use(Button).use(Form).use(Field)

Vue.use(Swipe).use(SwipeItem).use(Tab).use(Tabs).use(Sticky)

Vue.use(Search)

Vue.use(List)

Vue.use(ImagePreview)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(TreeSelect)
Vue.use(Loading)
Vue.use(Uploader)
Vue.use(Icon)
Vue.use(VanImage)
Vue.use(Lazyload)
Vue.use(Step)
Vue.use(Steps)
Vue.use(Rate)
Vue.use(DatetimePicker)
Vue.use(Overlay)
Vue.use(ActionSheet)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(CountDown)
Vue.use(Divider)
Vue.use(NoticeBar)
Vue.use(PullRefresh)
