import { ProviderFactory } from '@/shared/infra/factory/ProviderFactory'
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
    Object.assign(this, userAgentParser.parse(userAgent))
    this.tag = userAgent
  }
}
