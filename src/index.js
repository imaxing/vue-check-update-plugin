const fs = require('fs')
module.exports = class CheckUpdatePlugin {
  constructor(props) {
    this.props = props
  }
  apply(compiler) {
    const { name, versionPath, htmlPath, content, title, version } = this.props
    compiler.hooks.done.tap('CheckUpdatePlugin', () => {
      fs.writeFile(versionPath, JSON.stringify({ content, title, version, date: Date.now() }), 'utf8', () => {})
      fs.readFile(htmlPath, 'utf8', (error, data) => {
        if (error) throw error
        const [header, footer] = data.split('<body>')

        fs.writeFile(
          htmlPath,
          [
            header,
            `
                <script>
                    !localStorage['${name}'] && localStorage.setItem('${name}', "${version}");
                    window.version = {
                        path: window.location.origin + '/version.json?v=' + Date.now(),
                        sync: function () {
                            localStorage.setItem('${name}', "${version}")
                        }
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
