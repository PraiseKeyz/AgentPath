'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getOpportunity, type Opportunity } from '@/services/opportunities.service'
import { ArrowLeft, ExternalLink } from 'lucide-react'

export default function OpportunityDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOpportunity(id)
      .then(setOpportunity)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="p-6 text-gray-400 text-sm">Loading…</div>
  if (!opportunity) return <div className="p-6 text-gray-500">Opportunity not found.</div>

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link href="/opportunities" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft size={14} /> Back
      </Link>

      <div className="flex items-start justify-between gap-3 mb-4">
        <h1 className="text-2xl font-bold">{opportunity.title}</h1>
        <span className="shrink-0 text-xs font-medium px-2 py-0.5 bg-green-100 text-green-800 rounded-full capitalize">
          {opportunity.type}
        </span>
      </div>

      <p className="text-sm text-gray-500 mb-6">{opportunity.provider}</p>

      <div className="flex flex-col gap-6">
        <section>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">About</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{opportunity.description}</p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">Eligibility</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{opportunity.eligibility}</p>
        </section>

        {opportunity.deadline && (
          <section>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">Deadline</h2>
            <p className="text-sm font-medium text-orange-600">
              {new Date(opportunity.deadline).toLocaleDateString('en-NG', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
              })}
            </p>
          </section>
        )}

        {opportunity.tags.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {opportunity.tags.map((tag) => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{tag}</span>
              ))}
            </div>
          </section>
        )}

        <a
          href={opportunity.applicationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-green-700 text-white rounded-lg py-3 font-semibold hover:bg-green-800 transition-colors"
        >
          Apply now <ExternalLink size={14} />
        </a>
      </div>
    </div>
  )
}
