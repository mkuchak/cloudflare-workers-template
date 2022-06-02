import { ProviderFactory } from '@/shared/infra/factory/ProviderFactory'
import { CountryMapper } from '@/shared/provider/CountryMapper/CountryMapper'

export class Country {
  code: string
  locale: string
  locales: string[]
  language: string
  languages: string[]
  currency: string
  emoji: string
  capital: string
  name: string
  continent: string

  constructor(country: string, countryMapper: CountryMapper = new ProviderFactory().createCountryMapperProvider()) {
    Object.assign(this, countryMapper.map(country ?? 'US'))
    this.code = country
  }
}
