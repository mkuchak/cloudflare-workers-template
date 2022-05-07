export interface UserAgent {
  browser: string
  os: string
  device: string
  platform: string
}

export interface UserAgentParser {
  parse(userAgent: string): UserAgent
}
