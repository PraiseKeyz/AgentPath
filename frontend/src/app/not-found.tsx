import type { Metadata } from 'next'
import React from 'react'

import { NotFoundBodyClass } from '@/components/layout/NotFoundBodyClass'
import { NotFoundPage } from '@/components/layout/NotFoundPage'

export const metadata: Metadata = {
  title: 'Page not found',
  description: 'The page you are looking for could not be found.',
}

export default function NotFound() {
  return (
    <>
      <NotFoundBodyClass />
      <NotFoundPage />
    </>
  )
}
