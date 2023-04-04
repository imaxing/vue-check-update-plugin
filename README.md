# 为 vuecli 项目增加新版本检测功能

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
          name: 'project-name-key', // 保持唯一
          version: '1.0.0', // 保持最新
          contents: ['修改了xxx Bug', '增加了xxx 新功能'] // 更新日志
        })
      )
    }
  }
}
```

```js
// 在任意代码出调用此函数即可
Vue.prototype.$checkUpdate = function () {
  axios.get(window.location.origin + '/version.json?v=' + Date.now()).then(rsp => {
    const { version, title, contents } = rsp.data.data

    if (version === localStorage.getItem('project-name-key')) return

    this.$notify({
      title,
      duration: 0,
      showClose: true,
      dangerouslyUseHTMLString: true,
      message: contents.toString(),
      // 关闭后手动同步服务器上的最新版本号到本地
      onClose: () => window.syncVersionInformation()
    })
  })
}
```

#### Props

| 参数名           | 说明                                                  | 默认值                 |
| ---------------- | ----------------------------------------------------- | ---------------------- |
| name             | 唯一标识 (string)                                     | -                      |
| version          | 更新的版本号(string)                                  | -                      |
| versionPath      | 版本信息存放文件路径(string)                          | dist/version.json      |
| templatePath     | html 模板路径(string)                                 | dist/index.html        |
| title            | 版本更新大标题(string)                                | false                  |
| syncFunctionName | 同步最新版本号函数名(string) window[syncFunctionName] | syncVersionInformation |
| contents         | 版本更新日志(string[])                                | []                     |
