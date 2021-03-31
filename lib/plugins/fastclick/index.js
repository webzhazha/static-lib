import FastClick from 'fastclick'
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}
FastClick.prototype.focus = (ele) => { 'use strict'; ele.focus(); }; // 修改focus()方法