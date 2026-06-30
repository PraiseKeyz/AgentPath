import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'

interface Props {
  className?: string
}

export const Logo = ({ className }: Props) => {
  return (
    <Image
      alt="Upkora Academy"
      className={clsx('h-11 w-auto', className)}
      height={44}
      priority
      src="/images/logo-main.png"
      width={160}
    />
  )
}
