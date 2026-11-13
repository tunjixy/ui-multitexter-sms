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
    password: '/change-password',
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
    payment: '/payment-user',
  },
  referral: {
    referrals: '/referral',
    commissions: '/commission',
  },
  alert: {
    alerts: '/alert',
    edit: '/alert',
  },
  history: {
    payments: '/epayment-history',
    recharges: '/recharge-history',
    transactions: '/transaction-history',
  },
  birthday: {
    lists: (page: number) => `/birthday/list?page=${page}`,
    create: '/birthday/create',
    edit: (id: number) => `/birthday/update/${id}`,
    start: (id: number) => `/birthday/start/${id}`,
    stop: (id: number) => `/birthday/stop/${id}`,
    upload: '/birthday-upload',
    delete: (id: number) => `/birthday/delete/${id}`,
  },
  profile: {
    bio: '/profile',
    summary: '/profile-summary',
    update: '/update-profile',
  },
  phonebook: {
    contactLists: (page?: number) =>
      page ? `/contactlist?page=${page}` : `/contactlist?limit=all`,
    createList: '/contactlist/create',
    updateList: (listId: number) => `/contactlist/update/${listId}`,
    deleteList: '/contactlist/delete',
    contacts: (listId: number, page: number) =>
      `/contacts/${listId}?page=${page}`,
    contactNetworkCount: (listId: number) => `/contacts-count/${listId}`,
    createContact: '/contacts/create',
    uploadContact: '/contacts/upload',
    searchContacts: (listId: number, page: number) =>
      `/contacts/${listId}?page=${page}`,
    deleteContact: '/contacts/delete',
  },
  share: {
    lists: '/recent-shared',
    transfer: '/share-credit',
  },
} as const

export type ApiRoutes = typeof apiRoutes
