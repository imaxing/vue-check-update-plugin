const fs = require('fs')
module.exports = class CheckUpdatePlugin {
  constructor(props) {
    this.props = props
  }
  apply(compiler) {
    const {
      name = 'update-check-key',
      versionPath,
      htmlPath,
      content = [],
      title = '新版本提示',
      version,
      syncFunctionName = 'syncVersionNumber'
    } = this.props
    compiler.hooks.done.tap('CheckUpdatePlugin', () => {
      fs.writeFile(versionPath, JSON.stringify({ content, title, version, date: Date.now() }), 'utf8', () => {})
      fs.readFile(htmlPath, 'utf8', (error, data) => {
        if (error) throw error
        const [header, footer] = data.split('<body>')

        fs.writeFile(
          htmlPath,
          [
            header,
            `<script>
              !localStorage['${name}'] && localStorage.setItem('${name}', "${version}");
              window['${syncFunctionName}'] = function () {
                localStorage.setItem('${name}', "${version}")
              }
          </script>
        `,
            footer
          ].join(''),
          'utf8',
          () => {}
        )
      })
    })
  }
}
