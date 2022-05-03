export interface GetUserTokensOutputDTO {
  id: string;
  userAgent: UserAgent | string;
  lastIp: string;
  asOrganization: string;
  timezone: string;
  continent: string;
  country: Country | string;
  region: string;
  regionCode: string;
  city: string;
  postalCode: string;
  longitude: string;
  latitude: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface Country {
  code: string;
  locale: string;
  locales: string[];
  language: string;
  languages: string[];
  currency: string;
  emoji: string;
  capital: string;
  name: string;
  continent: string;
}

interface UserAgent {
  tag: string;
  device: string;
  platform: string;
}
