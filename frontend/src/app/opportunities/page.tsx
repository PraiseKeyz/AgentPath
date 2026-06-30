'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { getOpportunities, type Opportunity } from '@/services/opportunities.service'
import { Search } from 'lucide-react'

const TYPES = ['all', 'scholarship', 'fellowship', 'internship', 'competition', 'grant']

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [type, setType] = useState('all')

  useEffect(() => {
    setLoading(true)
    getOpportunities({ q: q || undefined, type: type === 'all' ? undefined : type })
      .then(setOpportunities)
      .finally(() => setLoading(false))
  }, [q, type])

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Opportunities</h1>

      <div className="flex flex-col gap-3 mb-6">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search opportunities…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-colors ${
                type === t ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="text-gray-400 text-sm">Loading…</p>}

      {!loading && opportunities.length === 0 && (
        <p className="text-gray-500 text-sm text-center py-12">No opportunities found.</p>
      )}

      <ul className="flex flex-col gap-3">
        {opportunities.map((o) => (
          <li key={o._id}>
            <Link
              href={`/opportunities/${o._id}`}
              className="block p-4 border border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-semibold text-sm">{o.title}</h2>
                <span className="shrink-0 text-xs font-medium px-2 py-0.5 bg-green-100 text-green-800 rounded-full capitalize">
                  {o.type}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{o.provider}</p>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{o.description}</p>
              {o.deadline && (
                <p className="text-xs text-orange-600 mt-2 font-medium">
                  Deadline: {new Date(o.deadline).toLocaleDateString()}
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
