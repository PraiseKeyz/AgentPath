const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email']

export function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))
}
