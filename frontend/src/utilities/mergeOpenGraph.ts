import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description:
    'Upkora Academy is a practical tech bootcamp offering live mentorship, real-world portfolio building, and dedicated career coaching.',
  images: [
    {
      url: `${getServerSideURL()}/images/logo-main.png`,
    },
  ],
  siteName: 'Upkora Academy',
  title: 'Upkora Academy',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
