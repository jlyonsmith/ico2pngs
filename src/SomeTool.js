import parseArgs from "minimist"
import { fullVersion } from "./version"

export class SomeTool {
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

    // TODO: Add your code here...

    return 0
  }
}
