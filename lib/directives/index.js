import Vue from 'vue'
import * as directives from './directives.js'
// 初始化自定义指令,所有全局的自定义指令在./directives/index.js中写
Object.keys(directives).forEach(key => Vue.directive(key, directives[key]))
