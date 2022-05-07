import { ProviderFactory } from '@/shared/provider/ProviderFactory'
import { UserAgentParser } from '@/shared/provider/UserAgentParser/UserAgentParser'

export class UserAgent {
  tag: string
  browser: string
  os: string
  device: string
  platform: string

  constructor(
    userAgent: string,
    userAgentParser: UserAgentParser = new ProviderFactory().createUserAgentParserProvider(),
  ) {
    const parsedUserAgent = userAgentParser.parse(userAgent)

    this.tag = userAgent
    this.browser = parsedUserAgent.browser
    this.os = parsedUserAgent.os
    this.device = parsedUserAgent.device
    this.platform = parsedUserAgent.platform
  }
}
