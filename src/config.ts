const getBoolean = (value: any) => {
  try {
    return !!JSON.parse(String(value || false).toLowerCase())
  } catch {
    return true
  }
}

export const config = {
  nodeEnv: process.env.NODE_ENV,
  dataProxyURL: process.env.DATAPROXY_URL || 'http://localhost:9000',
  jwtSecret: process.env.JWT_SECRET || 'secret',
  jwtExpiration: Number(process.env.JWT_EXPIRATION) || 15, // minutes
  refreshTokenExpiration: Number(process.env.REFRESH_TOKEN_EXPIRATION) || 30, // days
  renewRefreshTokenExpiration: getBoolean(process.env.RENEW_REFRESH_TOKEN_EXPIRATION),
}
