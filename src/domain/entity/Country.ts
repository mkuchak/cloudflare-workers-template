import { CountryLocaleMapAdapter } from '@/infra/adapter/countryMapper/CountryLocaleMapAdapter'
import { CountryMapper } from '@/infra/adapter/countryMapper/CountryMapper'

export class Country {
  locale: string;
  locales: string[];
  language: string;
  languages: string[];
  currency: string;
  emoji: string;
  capital: string;
  name: string;
  continent: string;

  constructor (
    country: string,
    countryMapper: CountryMapper = new CountryLocaleMapAdapter(),
  ) {
    const {
      locale,
      locales,
      language,
      languages,
      currency,
      emoji,
      capital,
      name,
      continent,
    } = countryMapper.map(country ?? 'US')

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
