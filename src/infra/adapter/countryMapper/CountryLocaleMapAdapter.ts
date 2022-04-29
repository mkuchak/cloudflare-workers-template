import clm from 'country-locale-map'

import { Country, CountryMapper } from './CountryMapper'

export class CountryLocaleMapAdapter implements CountryMapper {
  map (country: string): Country {
    const {
      default_locale,
      locales,
      languages,
      currency,
      emoji,
      capital,
      name,
      region,
    } = clm.getCountryByAlpha2(country ?? 'US')

    return {
      locale: default_locale,
      locales,
      language: languages[0],
      languages,
      currency,
      emoji,
      capital,
      name,
      continent: region,
    }
  }
}
