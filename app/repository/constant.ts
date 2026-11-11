/**
 * Application Constants
 */

/**
 * Cookie names used throughout the application
 */
export const COOKIE_NAMES = {
  AUTH_TOKEN: 'multitexter_auth_token',
  LAST_VISIT: 'last_visit',
} as const

/**
 * Cookie options for auth tokens
 */
export const AUTH_COOKIE_OPTIONS = {
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/',
  sameSite: 'lax' as const,
  httpOnly: false, // Can be set to true for enhanced security
}

/* export const ACCOUNT_UNVERIFIED = 'account unverified'
export const ACCOUNT_DEACTIVATED =
  'account is deactivated. please reactivate to continue' */
