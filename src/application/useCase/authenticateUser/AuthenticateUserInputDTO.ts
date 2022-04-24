export interface AuthenticateUserInputDTO {
  email: string;
  password: string;
  lastIp: string;
  userAgent: string;
  asn: number;
  asOrganization: string;
  timezone: string;
  continent: string;
  country: string;
  region: string;
  regionCode: string;
  city: string;
  postalCode: string;
  longitude: string;
  latitude: string;
}
