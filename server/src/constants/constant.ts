export const OAUTH_EXCHANEGE_EXPIRY = 10 * 60 * 1000; // 10 minutes in ms

// JWT expiry constants
export const ACCESS_TOKEN_EXPIRY_MS = 15 * 60 * 1000;              // 15 minutes in ms
export const ACCESS_TOKEN_EXPIRY_JWT = "15m";                       // for jwt.sign
export const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;   // 7 days in ms
export const REFRESH_TOKEN_EXPIRY_JWT = "7d";                       // for jwt.sign
