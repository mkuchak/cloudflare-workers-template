import UAParser from 'ua-parser-js'

import { UserAgent, UserAgentParser } from '../UserAgentParser'

export class UAParserProvider implements UserAgentParser {
  private uaParser: UAParser.UAParserInstance

  constructor() {
    this.uaParser = new UAParser()
  }

  parse(userAgent: string): UserAgent {
    const uaParsed = this.uaParser.setUA(userAgent).getResult()

    return {
      browser:
        uaParsed.browser.name && uaParsed.browser.version
          ? `${uaParsed.browser.name} ${uaParsed.browser.version}`
          : undefined,
      os: uaParsed.os.name && uaParsed.os.version ? `${uaParsed.os.name} ${uaParsed.os.version}` : undefined,
      device:
        uaParsed.device.vendor && uaParsed.device.model ? `${uaParsed.device.vendor} ${uaParsed.device.model}` : 'PC',
      platform: uaParsed.device.type ?? 'desktop',
    }
  }
}
