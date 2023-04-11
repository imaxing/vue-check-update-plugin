const fs = require('fs')

/**
 * 注入代码逻辑
 * @param props
 * @returns
 */
const getVersionInjection = (props: GetVersionInjectProps): string => {
  const { name, version, syncName } = props

  return `
    <script>
      // the code is injected by the vue-check-update-plugin
      !localStorage['${name}'] && localStorage.setItem('${name}', "${version}");
      window['${syncName}'] = function () {
        localStorage.setItem('${name}', "${version}")
      }
    </script>
  `
}

interface CheckUpdatePluginProps {
  name: string
  versionPath: string
  template: string
  contents?: string[]
  title?: string
  version: string
  syncName?: string
}

interface GetVersionInjectProps {
  name: string
  version: string
  syncName: string
}

module.exports = class CheckUpdatePlugin {
  props: CheckUpdatePluginProps = {
    name: '',
    title: '',
    versionPath: '',
    version: '',
    template: '',
    contents: [],
    syncName: ''
  }
  constructor(props: CheckUpdatePluginProps) {
    this.props = props

    if (!props.name) {
      throw Error('Missing name parameter')
    }
  }

  apply(compiler: any) {
    const {
      name,
      title,
      version,
      versionPath = 'dist/version.json',
      template = 'dist/index.html',
      syncName = 'syncVersion',
      contents = []
    } = this.props

    compiler.hooks.done.tapPromise('CheckUpdatePlugin', (): Promise<void> => {
      return new Promise(resolve => {
        fs.writeFileSync(versionPath, JSON.stringify({ contents, title, version, timestamp: Date.now() }))
        const data = fs.readFileSync(template, { encoding: 'utf8' })
        const [header, rest] = data.split('</head>')
        const body = getVersionInjection({ name, version, syncName })
        fs.writeFileSync(template, [header, body, rest].join(''))
        resolve(void 0)
      })
    })
  }
}
