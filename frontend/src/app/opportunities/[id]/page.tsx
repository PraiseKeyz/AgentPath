'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getOpportunity, type Opportunity } from '@/services/opportunities.service'
import { ArrowLeft, ExternalLink } from 'lucide-react'

const TYPE_COLORS: Record<string, string> = {
  scholarship: 'bg-[#E6F3FE] text-[#0075DE]',
  fellowship: 'bg-[#F3EDFF] text-[#AD6DED]',
  internship: 'bg-[#E8F7F6] text-[#2A9D99]',
  competition: 'bg-[#FFF5E0] text-[#FF8A33]',
  grant: 'bg-[#FDEDF8] text-[#FF83DD]',
}

export default function OpportunityDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOpportunity(id)
      .then(setOpportunity)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="p-6 flex items-center gap-2 text-[#B4B4B0] text-sm">
        <div className="w-4 h-4 border-2 border-[#E9E9E7] border-t-[#0075DE] rounded-full animate-spin" />
        Loading…
      </div>
    )
  }

  if (!opportunity) return <div className="p-6 text-[#787774]">Opportunity not found.</div>

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link href="/opportunities" className="inline-flex items-center gap-1.5 text-sm text-[#787774] hover:text-[#000000] transition-colors duration-200 mb-6">
        <ArrowLeft size={14} />
        Back to opportunities
      </Link>

      <div className="bg-white rounded-xl border border-[#E9E9E7] shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <h1 className="text-xl font-bold text-[#000000]">{opportunity.title}</h1>
          <span className={`shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${TYPE_COLORS[opportunity.type] ?? 'bg-[#F6F5F4] text-[#787774]'}`}>
            {opportunity.type}
          </span>
        </div>

        <p className="text-sm text-[#787774] mb-6">{opportunity.provider}</p>

        <div className="flex flex-col gap-6">
          <section>
            <h2 className="text-xs font-semibold text-[#B4B4B0] uppercase tracking-wide mb-2">About</h2>
            <p className="text-sm text-[#37352F] leading-relaxed">{opportunity.description}</p>
          </section>

          <section>
            <h2 className="text-xs font-semibold text-[#B4B4B0] uppercase tracking-wide mb-2">Eligibility</h2>
            <p className="text-sm text-[#37352F] leading-relaxed">{opportunity.eligibility}</p>
          </section>

          {opportunity.deadline && (
            <section>
              <h2 className="text-xs font-semibold text-[#B4B4B0] uppercase tracking-wide mb-2">Deadline</h2>
              <p className="text-sm font-medium text-[#F64932]">
                {new Date(opportunity.deadline).toLocaleDateString('en-NG', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                })}
              </p>
            </section>
          )}

          {opportunity.tags.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-[#B4B4B0] uppercase tracking-wide mb-2">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {opportunity.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-[#F6F5F4] text-[#787774] px-2.5 py-0.5 rounded-full font-medium">{tag}</span>
                ))}
              </div>
            </section>
          )}

          <a
            href={opportunity.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#0075DE] text-white rounded-lg py-3 font-semibold text-sm hover:bg-[#097FE8] transition-all duration-200 cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
          >
            Apply now <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  )
}
