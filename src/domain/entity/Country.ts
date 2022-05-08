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
    const { locale, locales, language, languages, currency, emoji, capital, name, continent } = countryMapper.map(
      country ?? 'US',
    )

    this.code = country
    this.locale = locale
    this.locales = locales
    this.language = language
    this.languages = languages
    this.currency = currency
    this.emoji = emoji
    this.capital = capital
    this.name = name
    this.continent = continent
  }
}
