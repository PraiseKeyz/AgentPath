import React from 'react'

import { QueryProvider } from '@/providers/QueryProvider'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return <QueryProvider>{children}</QueryProvider>
}
