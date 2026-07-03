'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { getOpportunities, type Opportunity } from '@/services/opportunities.service'
import { Search, Compass, Calendar, Building2, ExternalLink } from 'lucide-react'

const TYPES = ['all', 'scholarship', 'fellowship', 'internship', 'competition', 'grant'] as const

const TYPE_COLORS: Record<string, { pill: string; border: string; bg: string }> = {
  scholarship: { pill: 'bg-[#E6F3FE] text-[#0075DE] border-[#D3E5EF]', border: 'border-l-[#0075DE]', bg: 'bg-[#0075DE]' },
  fellowship: { pill: 'bg-[#F3EDFF] text-[#AD6DED] border-[#E4D4F4]', border: 'border-l-[#AD6DED]', bg: 'bg-[#AD6DED]' },
  internship: { pill: 'bg-[#E2F5F4] text-[#2A9D99] border-[#C5E8E6]', border: 'border-l-[#2A9D99]', bg: 'bg-[#2A9D99]' },
  competition: { pill: 'bg-[#FFF5E0] text-[#FF8A33] border-[#FFE4B8]', border: 'border-l-[#FF8A33]', bg: 'bg-[#FF8A33]' },
  grant: { pill: 'bg-[#FDEDF8] text-[#FF83DD] border-[#F5D0EC]', border: 'border-l-[#FF83DD]', bg: 'bg-[#FF83DD]' },
}

const TYPE_FILTER_COLORS: Record<string, string> = {
  all: 'bg-[#0075DE] text-white shadow-[0_1px_3px_rgba(0,117,222,0.15)]',
  scholarship: 'bg-[#0075DE] text-white shadow-[0_1px_3px_rgba(0,117,222,0.15)]',
  fellowship: 'bg-[#AD6DED] text-white shadow-[0_1px_3px_rgba(173,109,237,0.15)]',
  internship: 'bg-[#2A9D99] text-white shadow-[0_1px_3px_rgba(42,157,153,0.15)]',
  competition: 'bg-[#FF8A33] text-white shadow-[0_1px_3px_rgba(255,138,51,0.15)]',
  grant: 'bg-[#FF83DD] text-white shadow-[0_1px_3px_rgba(255,131,221,0.15)]',
}

function daysUntilDeadline(deadline: string | null): number | null {
  if (!deadline) return null
  const now = new Date()
  const dl = new Date(deadline)
  return Math.ceil((dl.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [type, setType] = useState<string>('all')

  useEffect(() => {
    setLoading(true)
    getOpportunities({ q: q || undefined, type: type === 'all' ? undefined : type })
      .then(setOpportunities)
      .finally(() => setLoading(false))
  }, [q, type])

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-[#E9E9E7] pb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#F6F5F4] text-[#37352F] border border-[#E9E9E7]">
            <Compass size={18} strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#000000] tracking-tight">Opportunities</h1>
            <p className="text-xs text-[#787774] font-medium">Scholarships, fellowships, internships & more</p>
          </div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B4B4B0]" />
          <input
            type="text"
            placeholder="Search by title, provider, or keyword…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-[#E9E9E7] rounded-xl text-sm bg-white text-[#000000] placeholder:text-[#B4B4B0] focus:outline-none focus:ring-2 focus:ring-[#0075DE]/20 focus:border-[#0075DE] transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition-all duration-150 cursor-pointer ${
                type === t
                  ? TYPE_FILTER_COLORS[t]
                  : 'bg-[#F6F5F4] text-[#787774] hover:bg-[#EFEEEC] hover:text-[#37352F] border border-transparent'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white border border-[#E9E9E7] rounded-xl p-5">
              <div className="h-4 bg-[#F6F5F4] rounded w-20 animate-pulse mb-3" />
              <div className="h-5 bg-[#F6F5F4] rounded w-3/4 animate-pulse mb-2" />
              <div className="h-3 bg-[#F6F5F4] rounded w-1/3 animate-pulse mb-4" />
              <div className="h-3 bg-[#F6F5F4] rounded w-full animate-pulse mb-1.5" />
              <div className="h-3 bg-[#F6F5F4] rounded w-2/3 animate-pulse" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && opportunities.length === 0 && (
        <div className="text-center py-16 bg-white border border-[#E9E9E7] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] animate-slide-up">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#E6F3FE] text-[#0075DE] mb-4">
            <Compass size={20} />
          </div>
          <h2 className="text-base font-extrabold text-[#000000] tracking-tight mb-2">No opportunities found</h2>
          <p className="text-xs text-[#787774] font-medium max-w-xs mx-auto">
            {q || type !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'New opportunities are added regularly. Check back soon!'}
          </p>
        </div>
      )}

      {/* Cards Grid */}
      {!loading && opportunities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {opportunities.map((o) => {
            const colors = TYPE_COLORS[o.type] ?? { pill: 'bg-[#F6F5F4] text-[#787774] border-[#E9E9E7]', border: 'border-l-[#B4B4B0]', bg: 'bg-[#B4B4B0]' }
            const daysLeft = daysUntilDeadline(o.deadline)
            const isUrgent = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7

            return (
              <Link
                key={o._id}
                href={`/opportunities/${o._id}`}
                className={`block bg-white border border-[#E9E9E7] rounded-xl p-5 border-l-[3px] ${colors.border} hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)] hover:border-l-[3px] transition-all duration-200 group animate-slide-up`}
              >
                {/* Type Badge */}
                <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border mb-3 ${colors.pill}`}>
                  {o.type}
                </span>

                {/* Title */}
                <h2 className="font-bold text-sm text-[#37352F] group-hover:text-[#000000] transition-colors mb-1 line-clamp-2 leading-snug">
                  {o.title}
                </h2>

                {/* Provider */}
                <div className="flex items-center gap-1.5 mb-3">
                  <Building2 size={12} className="text-[#B4B4B0]" />
                  <span className="text-xs text-[#787774] font-medium">{o.provider}</span>
                </div>

                {/* Description */}
                <p className="text-xs text-[#787774] line-clamp-2 leading-relaxed mb-3">{o.description}</p>

                {/* Footer: Deadline + Tags */}
                <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#E9E9E7]/60">
                  {o.deadline ? (
                    <div className={`flex items-center gap-1.5 text-[10px] font-bold ${isUrgent ? 'text-[#F64932]' : 'text-[#787774]'}`}>
                      <Calendar size={11} />
                      <span>
                        {daysLeft !== null && daysLeft >= 0
                          ? daysLeft === 0 ? 'Due today' : `${daysLeft}d left`
                          : daysLeft !== null && daysLeft < 0 ? 'Expired' : ''}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px] font-medium text-[#B4B4B0]">No deadline</span>
                  )}

                  {o.tags.length > 0 && (
                    <div className="flex gap-1 overflow-hidden">
                      {o.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[10px] bg-[#F6F5F4] text-[#787774] px-2 py-0.5 rounded-full font-medium truncate max-w-[80px]">
                          {tag}
                        </span>
                      ))}
                      {o.tags.length > 2 && (
                        <span className="text-[10px] text-[#B4B4B0] font-medium">+{o.tags.length - 2}</span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
