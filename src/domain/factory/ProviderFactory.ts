import { CountryMapper } from '@/shared/provider/CountryMapper/CountryMapper'
import { Hash } from '@/shared/provider/Hash/Hash'
import { JWT } from '@/shared/provider/JWT/JWT'
import { UserAgentParser } from '@/shared/provider/UserAgentParser/UserAgentParser'
import { UUID } from '@/shared/provider/UUID/UUID'

export interface IProviderFactory {
  createCountryMapperProvider(): CountryMapper
  createUserAgentParserProvider(): UserAgentParser
  createUUIDProvider(): UUID
  createHashProvider(): Hash
  createJWTProvider(): JWT
}
