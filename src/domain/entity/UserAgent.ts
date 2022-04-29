import { UAParserAdapter } from '@/infra/adapter/userAgentParser/UAParserAdapter'
import { UserAgentParser } from '@/infra/adapter/userAgentParser/UserAgentParser'

export class UserAgent {
  userAgent: string;
  browser?: string;
  os?: string;
  device?: string;
  platform?: string;

  constructor (
    userAgent: string,
    userAgentParser: UserAgentParser = new UAParserAdapter(),
  ) {
    const parsedUserAgent = userAgentParser.parse(userAgent)

    this.userAgent = userAgent
    this.browser = parsedUserAgent.browser
    this.os = parsedUserAgent.os
    this.device = parsedUserAgent.device
    this.platform = parsedUserAgent.platform
  }
}
