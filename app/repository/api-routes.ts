// API Routes - Single source of truth for all API endpoints
export const apiRoutes = {
  auth: {
    login: '/login',
    signup: '/register',
    forgotPassword: '/password/email',
    checkResetCode: (token: string) =>
      `/password/find/${encodeURIComponent(token)}`,
    resetPassword: '/password/reset',
  },
  user: {
    activate: '/user/activate',
    resendActivation: '/user/resend-activate',
    detail: '/detail',
  },
  contact: {
    contactSales: '/contact-sales',
    request: '/integration-request',
    feedback: '/send-feedback',
  },
  payment: {
    verify: '/payment/verify',
    flutterWaveVerify: '/flutter-payment/verify',
  },
  misc: {
    unsubscribe: '/unsubscribe',
    senderNameRequest: '/sender-name-request',
  },
  referral: {
    referrals: '/referral',
    commissions: '/commission',
  },
  alert: {
    alerts: '/alert',
    edit: '/alert',
  },
} as const

export type ApiRoutes = typeof apiRoutes
