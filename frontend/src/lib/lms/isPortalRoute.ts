export function isPortalRoute(pathname: string) {
  return pathname.startsWith('/dashboard') || /^\/courses\/[^/]+\/learn(\/|$)/.test(pathname)
}
