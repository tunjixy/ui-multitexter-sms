// Permanent redirects for old URLs
const redirects: Record<string, string> = {
  '/make-money': '/',
  '/multitexter-coverage': '/sms-coverage',
  '/privacy': '/privacy-policy',
  '/cdn-cgi/l/email-protection': '/',
  '/epayments/recharge_options': '/',
}

export default defineEventHandler((event) => {
  const path = getRequestURL(event).pathname.replace(/\/+$/, '')
  const target = redirects[path]

  if (target) {
    return sendRedirect(event, target, 301)
  }
})
