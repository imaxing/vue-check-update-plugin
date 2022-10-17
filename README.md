# 为 vue cli 项目添加版本信息插件

安装

```bash
npm i vue-check-update-plugin -D
```

使用

```js
// vue.config.js
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
          utilName: 'NEW_VERSION_CHECK', // 注入到html中的全局变量明 window.NEW_VERSION_CHECK
          content: ['修改了xxx Bug', '增加了xxx 新功能'] // 新版本更新日志
        })
      )
    }
  }
}
```

```js
// main.js
import Vue from 'vue'
import axios from 'axios'
Vue.prototype.$checkUpdate = function() {
  axios.get(window.NEW_VERSION_CHECK.path + '?v=' + Date.now()).then(rsp => {
    // 插件提供的数据
    const { version, title, content, date } = rsp.data.data
    // project-name-key 需要与插件name值一致
    if (version === localStorage.getItem('project-name-key')) return console.log('当前版本是最新版本')

    // 检测到新版本

    this.$notify({
      title,
      duration: 0,
      showClose: true,
      dangerouslyUseHTMLString: true,
      message: content.toString(),
      // 关闭后同步版本号到本地
      onClose: () => window.syncVersionNumber()
    })
  })
}
```
