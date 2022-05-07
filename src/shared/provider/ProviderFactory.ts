import { IProviderFactory } from '../infra/factory/ProviderFactory'
import { CountryMapper } from './CountryMapper/CountryMapper'
import { CountryLocaleMapProvider } from './CountryMapper/implementation/CountryLocaleMapProvider'
import { Hash } from './Hash/Hash'
import { BcryptjsHashProvider } from './Hash/implementation/BcryptjsHashProvider'
import { CloudflareWorkerJWTProvider } from './JWT/implementation/CloudflareWorkerJWTProvider'
import { JWT } from './JWT/JWT'
import { UAParserProvider } from './UserAgentParser/implementation/UAParserProvider'
import { UserAgentParser } from './UserAgentParser/UserAgentParser'
import { NanoidProvider } from './UUID/implementation/NanoidProvider'
import { UUID } from './UUID/UUID'

export class ProviderFactory implements IProviderFactory {
  createCountryMapperProvider(): CountryMapper {
    return new CountryLocaleMapProvider()
  }

  createUserAgentParserProvider(): UserAgentParser {
    return new UAParserProvider()
  }

  createUUIDProvider(): UUID {
    return new NanoidProvider()
  }

  createHashProvider(): Hash {
    return new BcryptjsHashProvider()
  }

  createJWTProvider(): JWT {
    return new CloudflareWorkerJWTProvider()
  }
}
