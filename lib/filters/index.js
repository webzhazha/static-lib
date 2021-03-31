import Vue from 'vue'
import * as filters from './filter.js'
// 初始化自定义过滤器
Object.keys(filters).forEach(key => Vue.filter(key, filters[key]))
