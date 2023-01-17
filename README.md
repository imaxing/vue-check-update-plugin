# 为 vuecli 项目增加新版本检测功能

> 如需通知用户有新版本, 需要更新 package.json 的 version 值

安装

```bash
npm i vue-check-update-plugin -D
```

使用

```js
// vue.config.js
const CheckUpdatePlugin = require('vue-check-update-plugin')
module.exports = {
  configureWebpack: config => {
    if (process.env.NODE_ENV !== 'development') {
      config.plugins.push(
        new CheckUpdatePlugin({
          name: 'project-name-key', // 版本名称
          versionPath: 'dist/version.json', // 版本信息文件写入路径
          htmlPath: 'dist/index.html', // html 文件路径
          title: '新版本提示', // 新版本标题
          version: require('./package.json').version, // 次版本号与用户本地上次加载的版本号比对
          syncFunctionName: 'syncVersionNumber', // 注入到html中的全局函数
          content: ['修改了xxx Bug', '增加了xxx 新功能'] // 新版本更新日志
        })
      )
    }
  }
}
```

```js
// 在任意代码出调用此函数即可
Vue.prototype.$checkUpdate = function() {
  axios.get(window.location.origin + '/version.json?v=' + Date.now()).then(rsp => {
    // 由插件提供的比对数据
    const { version, title, content, date } = rsp.data.data

    // 当前版本是最新版本
    // project-name-key 需要与插件name值一致
    if (version === localStorage.getItem('project-name-key')) return

    // 检测到新版本并弹出提示
    this.$notify({
      title,
      duration: 0,
      showClose: true,
      dangerouslyUseHTMLString: true,
      message: content.toString(),
      // 关闭后手动同步服务器上的最新版本号到本地
      onClose: () => window.syncVersionNumber()
    })
  })
}
```
