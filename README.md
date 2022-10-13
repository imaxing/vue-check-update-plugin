# 为 vue cli 项目添加版本信息插件

安装

```bash
npm i vue-check-update-plugin -D
```

使用

```js
const CheckUpdatePlugin = require('vue-check-update-plugin')
const isDevelopment = process.env.NODE_ENV === 'development'
module.exports = {
  configureWebpack: config => {
    if (!isDevelopment) {
      config.plugins.push(
        new CheckUpdatePlugin({
          name: 'project-name-key', // 版本名称
          versionPath: 'dist/version.json', // 版本信息文件写入路径
          htmlPath: 'dist/index.html', // html 文件路径
          title: '新版本提示', // 新版本标题
          content: ['修改了xxx Bug', '增加了xxx 新功能'] // 新版本更新日志
        })
      )
    }
  }
}
```
