'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { getOpportunities, type Opportunity } from '@/services/opportunities.service'
import { Search, Compass } from 'lucide-react'

const TYPES = ['all', 'scholarship', 'fellowship', 'internship', 'competition', 'grant']

const TYPE_COLORS: Record<string, string> = {
  scholarship: 'bg-[#E6F3FE] text-[#0075DE]',
  fellowship: 'bg-[#F3EDFF] text-[#AD6DED]',
  internship: 'bg-[#E8F7F6] text-[#2A9D99]',
  competition: 'bg-[#FFF5E0] text-[#FF8A33]',
  grant: 'bg-[#FDEDF8] text-[#FF83DD]',
}

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
      <h1 className="text-xl font-bold text-[#000000] mb-6">Opportunities</h1>

      <div className="flex flex-col gap-3 mb-6">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B4B4B0]" />
          <input
            type="text"
            placeholder="Search opportunities…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-[#E9E9E7] rounded-lg text-sm bg-white text-[#000000] placeholder:text-[#B4B4B0] focus:outline-none focus:ring-2 focus:ring-[#0075DE] focus:border-[#0075DE] transition-all duration-200"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all duration-200 cursor-pointer ${
                type === t
                  ? 'bg-[#0075DE] text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)]'
                  : 'bg-[#F6F5F4] text-[#787774] hover:bg-[#EFEEEC] hover:text-[#37352F]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-[#B4B4B0] text-sm py-8 justify-center">
          <div className="w-4 h-4 border-2 border-[#E9E9E7] border-t-[#0075DE] rounded-full animate-spin" />
          Loading…
        </div>
      )}

      {!loading && opportunities.length === 0 && (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#E6F3FE] text-[#0075DE] mb-4">
            <Compass size={24} />
          </div>
          <p className="text-[#787774] text-sm">No opportunities found.</p>
        </div>
      )}

      <ul className="flex flex-col gap-3">
        {opportunities.map((o) => (
          <li key={o._id}>
            <Link
              href={`/opportunities/${o._id}`}
              className="block p-5 bg-white border border-[#E9E9E7] rounded-xl hover:border-[#D3D3D0] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-semibold text-sm text-[#000000]">{o.title}</h2>
                <span className={`shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${TYPE_COLORS[o.type] ?? 'bg-[#F6F5F4] text-[#787774]'}`}>
                  {o.type}
                </span>
              </div>
              <p className="text-xs text-[#787774] mt-1">{o.provider}</p>
              <p className="text-sm text-[#37352F] mt-2 line-clamp-2 leading-relaxed">{o.description}</p>
              {o.deadline && (
                <p className="text-xs text-[#F64932] mt-2 font-medium">
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
