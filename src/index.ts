const fs = require('fs')

const readFile = (p: string): Promise<string> => {
  return new Promise((rl, rj) => fs.readFile(p, 'utf8', (e: any, d: string) => (e ? rj(e) : rl(d))))
}

const writeFile = (p: string, d: any): Promise<string> => {
  return new Promise((rl, rj) => fs.writeFile(p, JSON.stringify(d), 'utf8', (e: any, d: string) => (e ? rj(e) : rl(d))))
}

interface CheckUpdatePluginProps {
  name?: string
  versionPath: string
  templatePath: string
  contents?: string[]
  title?: string
  version: string
  syncFunctionName?: string
}

class CheckUpdatePlugin {
  props: CheckUpdatePluginProps = {
    name: '',
    title: '',
    versionPath: '',
    version: '',
    templatePath: '',
    contents: [],
    syncFunctionName: ''
  }
  constructor(props: CheckUpdatePluginProps) {
    this.props = props
  }

  apply(compiler: any) {
    const {
      name,
      versionPath = 'dist/version.json',
      templatePath = 'dist/index.html',
      contents = [],
      title = '新版本提示',
      version = '1.0.0',
      syncFunctionName = 'syncVersionInformation'
    } = this.props

    if (!name) {
      throw Error('Missing name parameter')
    }

    compiler.hooks.done.tapPromise('CheckUpdatePlugin', async () => {
      try {
        await writeFile(versionPath, { contents, title, version, timestamp: Date.now() })
        const data = await readFile(templatePath)
        const [header, footer] = data.split('<body>')
        const body = `
          <script>
            !localStorage['${name}'] && localStorage.setItem('${name}', "${version}");
            window['${syncFunctionName}'] = function () {
              localStorage.setItem('${name}', "${version}")
            }
          </script>
        `
        await writeFile(templatePath, [header, body, footer].join(''))
      } catch (error) {
        console.error('Error occurred while applying plugin', error)
        throw error
      }
    })
  }
}

module.exports = CheckUpdatePlugin
