export interface Country {
  locale: string
  locales: string[]
  language: string
  languages: string[]
  currency: string
  emoji: string
  capital: string
  name: string
  continent: string
}

export interface CountryMapper {
  map(country: string): Country
}
