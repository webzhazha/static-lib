# mixin 说明文档

## index.js

`index.js` 用于全局功能的 `mixin` ，少数具备有全局通用性的可引入到 `mixin` 中

目前有以下功能：

1. 全局路径跳转，比如登录
2. 全局分享构建方法
3. 全局模板图片构造方法
4. 全局的渠道引入管理

在全局引入之前请认真考虑全局通用性，避免后续 `mixin` 越来越大。

## buildImage 方法介绍

```js
methods: {
  // 检查图片是否是
  // 外部线上图片正则 || 静态站图片 || 本地打包后带有版本号的图片 || base64 图片
  // 补充 IMAGESDOMAIN: https://images.91160.com/ 前缀
  fixImageUrl,
  // 通过 type 1 生成用于 img 标签的 src ，type 2 用于生成元素背景图 css
  buildImageCss,
  // generateImageUrl 支持传入默认图，内部调用 buildImageCss 方法
  generateImageUrl,
  // buildUrlString 通过 type 1 用于 img 标签，type 2 用于背景图
  buildUrlString,
  // 用于在模板上 :style="{top: 10px; background: createCssUrl()}" 创建 url('xxx.jpg')，内部调用 buildUrlString
  createCssUrl
}

```

## 其他

Best regards!
