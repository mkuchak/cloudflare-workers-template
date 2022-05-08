import { IProviderFactory } from '@/domain/factory/ProviderFactory'
import { CountryMapper } from '@/shared/provider/CountryMapper/CountryMapper'
import { CountryLocaleMapProvider } from '@/shared/provider/CountryMapper/implementation/CountryLocaleMapProvider'
import { Hash } from '@/shared/provider/Hash/Hash'
import { BcryptjsHashProvider } from '@/shared/provider/Hash/implementation/BcryptjsHashProvider'
import { CloudflareWorkerJWTProvider } from '@/shared/provider/JWT/implementation/CloudflareWorkerJWTProvider'
import { JWT } from '@/shared/provider/JWT/JWT'
import { UAParserProvider } from '@/shared/provider/UserAgentParser/implementation/UAParserProvider'
import { UserAgentParser } from '@/shared/provider/UserAgentParser/UserAgentParser'
import { NanoidProvider } from '@/shared/provider/UUID/implementation/NanoidProvider'
import { UUID } from '@/shared/provider/UUID/UUID'

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
