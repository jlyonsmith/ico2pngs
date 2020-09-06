import parseArgs from "minimist"
import { fullVersion } from "./version"
import Xray from "x-ray"

export class GetFaviconTool {
  constructor(container) {
    this.toolName = container.toolName
    this.log = container.log
    this.debug = container.debug
  }

  async run(argv) {
    const options = {
      string: [],
      boolean: ["help", "version", "debug"],
      alias: {},
      default: {},
    }

    const args = parseArgs(argv, options)

    this.debug = args.debug

    if (args.version) {
      this.log.info(`v${fullVersion}`)
      return 0
    }

    if (args.help) {
      this.log.info(`
Usage: ${this.toolName} [options]

options:
  --help          Shows this help.
  --version       Shows the tool version.
`)
      return 0
    }

    const x = Xray()
    const selectors = [
      "link[rel=apple-touch-icon-precomposed][href]",
      "link[rel=apple-touch-icon][href]",
      'link[rel="shortcut icon"][href]',
      "link[rel=icon][href]",
      "meta[name=msapplication-TileImage][content]",
      "meta[name=twitter\\:image][content]",
      "meta[property=og\\:image][content]",
    ]
    const fetchFavicons = async (url) =>
      new Promise(function (resolve, reject) {
        x(url, selectors.join(), [
          {
            href: "@href",
            content: "@content",
            property: "@property",
            rel: "@rel",
            name: "@name",
            sizes: "@sizes",
          },
        ])((err, favicons) => {
          if (err) {
            return reject(err)
          }

          favicons = favicons.map((favicon) => ({
            href: favicon.href || favicon.content,
            name: favicon.name || favicon.rel || favicon.property,
            size:
              Math.min.apply(null, (favicon.sizes || "").split(/[^0-9\.]+/g)) ||
              undefined,
          }))

          return resolve(favicons)
        })
      })

    const url = args._[0]
    const favicons = await fetchFavicons(url)

    this.log.info(JSON.stringify(favicons, null, "  "))

    return 0
  }
}
