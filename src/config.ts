export const config = {
  nodeEnv: process.env.NODE_ENV,
  dataProxyURL: process.env.DATAPROXY_URL,
  jwtSecret: process.env.JWT_SECRET || 'secret',
  jwtExpiration: Number(process.env.JWT_EXPIRATION) || 15, // minutes
  refreshTokenExpiration: Number(process.env.REFRESH_TOKEN_EXPIRATION) || 30, // days
}
