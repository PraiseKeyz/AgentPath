'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getOpportunity, isDbOpportunity, type Opportunity } from '@/services/opportunities.service'
import { addMilestone } from '@/services/roadmap.service'
import { ArrowLeft, ExternalLink, Calendar, Shield, Building2, Tag, Plus, Check, AlertCircle } from 'lucide-react'

const TYPE_COLORS: Record<string, { pill: string; accent: string }> = {
  scholarship: { pill: 'bg-[#E6F3FE] text-[#0075DE] border-[#D3E5EF]', accent: '#0075DE' },
  fellowship: { pill: 'bg-[#F3EDFF] text-[#AD6DED] border-[#E4D4F4]', accent: '#AD6DED' },
  internship: { pill: 'bg-[#E2F5F4] text-[#2A9D99] border-[#C5E8E6]', accent: '#2A9D99' },
  competition: { pill: 'bg-[#FFF5E0] text-[#FF8A33] border-[#FFE4B8]', accent: '#FF8A33' },
  grant: { pill: 'bg-[#FDEDF8] text-[#FF83DD] border-[#F5D0EC]', accent: '#FF83DD' },
}

export default function OpportunityDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null)
  const [loading, setLoading] = useState(true)
  const [addingToRoadmap, setAddingToRoadmap] = useState(false)
  const [addedToRoadmap, setAddedToRoadmap] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getOpportunity(id)
      .then(setOpportunity)
      .finally(() => setLoading(false))
  }, [id])

  async function handleAddToRoadmap() {
    if (!opportunity || addingToRoadmap || addedToRoadmap) return
    setAddingToRoadmap(true)
    setError('')
    try {
      await addMilestone({
        title: `Apply: ${opportunity.title}`,
        description: `${opportunity.type} from ${opportunity.provider}`,
        opportunityId: isDbOpportunity(opportunity) ? opportunity._id : undefined,
        dueDate: opportunity.deadline ?? undefined,
      })
      setAddedToRoadmap(true)
    } catch (err: any) {
      setError(err.message ?? 'Failed to add to roadmap')
    } finally {
      setAddingToRoadmap(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 md:p-8 animate-fade-in">
        <div className="h-4 bg-[#F6F5F4] rounded w-40 animate-pulse mb-8" />
        <div className="bg-white border border-[#E9E9E7] rounded-xl p-8">
          <div className="h-5 bg-[#F6F5F4] rounded w-24 animate-pulse mb-4" />
          <div className="h-7 bg-[#F6F5F4] rounded w-3/4 animate-pulse mb-2" />
          <div className="h-4 bg-[#F6F5F4] rounded w-1/3 animate-pulse mb-8" />
          <div className="h-3 bg-[#F6F5F4] rounded w-full animate-pulse mb-2" />
          <div className="h-3 bg-[#F6F5F4] rounded w-full animate-pulse mb-2" />
          <div className="h-3 bg-[#F6F5F4] rounded w-2/3 animate-pulse" />
        </div>
      </div>
    )
  }

  if (!opportunity) {
    return (
      <div className="max-w-2xl mx-auto p-6 md:p-8 text-center py-20">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FEF3F1] text-[#F64932] mb-4">
          <AlertCircle size={20} />
        </div>
        <h2 className="text-base font-extrabold text-[#000000] mb-2">Opportunity not found</h2>
        <p className="text-xs text-[#787774] mb-4">This opportunity may have been removed or the link is invalid.</p>
        <Link href="/opportunities" className="text-xs text-[#0075DE] font-bold hover:text-[#005BAB]">
          ← Back to opportunities
        </Link>
      </div>
    )
  }

  const colors = TYPE_COLORS[opportunity.type] ?? { pill: 'bg-[#F6F5F4] text-[#787774] border-[#E9E9E7]', accent: '#787774' }

  const daysLeft = opportunity.deadline
    ? Math.ceil((new Date(opportunity.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null
  const isUrgent = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7
  const isExpired = daysLeft !== null && daysLeft < 0

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-8 animate-fade-in">
      {/* Back Link */}
      <Link
        href="/opportunities"
        className="inline-flex items-center gap-1.5 text-xs text-[#787774] hover:text-[#37352F] font-bold transition-colors duration-150 mb-6"
      >
        <ArrowLeft size={14} strokeWidth={2.2} />
        Back to opportunities
      </Link>

      {/* Hero Card */}
      <div className="bg-white rounded-xl border border-[#E9E9E7] shadow-[0_4px_16px_rgba(0,0,0,0.05)] overflow-hidden">
        {/* Colored top accent bar */}
        <div className="h-1" style={{ backgroundColor: colors.accent }} />

        <div className="p-6 md:p-8">
          {/* Type Badge */}
          <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border mb-4 ${colors.pill}`}>
            {opportunity.type}
          </span>

          {/* Title */}
          <h1 className="text-2xl font-extrabold text-[#000000] tracking-tight mb-2 leading-tight">
            {opportunity.title}
          </h1>

          {/* Provider */}
          <div className="flex items-center gap-2 mb-6">
            <Building2 size={14} className="text-[#B4B4B0]" />
            <span className="text-sm text-[#787774] font-medium">{opportunity.provider}</span>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Deadline */}
            <div className="flex items-start gap-3 p-3.5 bg-[#F6F5F4] rounded-lg border border-[#E9E9E7]/50">
              <Calendar size={16} className={isUrgent ? 'text-[#F64932]' : isExpired ? 'text-[#B4B4B0]' : 'text-[#787774]'} />
              <div>
                <p className="text-[10px] font-bold text-[#B4B4B0] uppercase tracking-wider mb-0.5">Deadline</p>
                {opportunity.deadline ? (
                  <>
                    <p className={`text-xs font-bold ${isUrgent ? 'text-[#F64932]' : isExpired ? 'text-[#B4B4B0]' : 'text-[#37352F]'}`}>
                      {new Date(opportunity.deadline).toLocaleDateString('en-NG', {
                        year: 'numeric', month: 'long', day: 'numeric',
                      })}
                    </p>
                    {daysLeft !== null && daysLeft >= 0 && (
                      <p className={`text-[10px] font-medium mt-0.5 ${isUrgent ? 'text-[#F64932]' : 'text-[#787774]'}`}>
                        {daysLeft === 0 ? 'Due today!' : `${daysLeft} day${daysLeft > 1 ? 's' : ''} left`}
                      </p>
                    )}
                    {isExpired && <p className="text-[10px] text-[#B4B4B0] font-medium mt-0.5">Expired</p>}
                  </>
                ) : (
                  <p className="text-xs text-[#787774] font-medium">Rolling / No deadline</p>
                )}
              </div>
            </div>

            {/* Eligibility */}
            <div className="flex items-start gap-3 p-3.5 bg-[#F6F5F4] rounded-lg border border-[#E9E9E7]/50">
              <Shield size={16} className="text-[#787774]" />
              <div>
                <p className="text-[10px] font-bold text-[#B4B4B0] uppercase tracking-wider mb-0.5">Eligibility</p>
                <p className="text-xs text-[#37352F] font-medium leading-relaxed line-clamp-3">{opportunity.eligibility || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-[10px] font-bold text-[#B4B4B0] uppercase tracking-wider mb-2">About this opportunity</h2>
            <p className="text-sm text-[#37352F] leading-relaxed whitespace-pre-line">{opportunity.description}</p>
          </div>

          {/* Tags */}
          {opportunity.tags.length > 0 && (
            <div className="mb-8">
              <h2 className="text-[10px] font-bold text-[#B4B4B0] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Tag size={11} /> Tags
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {opportunity.tags.map((tag) => (
                  <span key={tag} className="text-[10px] bg-[#F6F5F4] text-[#787774] px-2.5 py-1 rounded-full font-bold border border-[#E9E9E7]/60">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-4 flex items-center gap-2 bg-[#FEF3F1] border border-[#F77463]/20 text-[#F64932] text-xs font-medium px-3.5 py-2.5 rounded-lg animate-fade-in">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={opportunity.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[#0075DE] text-white rounded-lg py-3 font-bold text-sm hover:bg-[#097FE8] active:bg-[#005BAB] transition-all duration-150 cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
            >
              Apply now
              <ExternalLink size={14} />
            </a>

            <button
              onClick={handleAddToRoadmap}
              disabled={addingToRoadmap || addedToRoadmap}
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-lg py-3 font-bold text-sm border transition-all duration-150 cursor-pointer ${
                addedToRoadmap
                  ? 'bg-[#E2F5E9] text-[#1AAE39] border-[#B8E6C8]'
                  : 'bg-white text-[#37352F] border-[#E9E9E7] hover:bg-[#F6F5F4] hover:border-[#D3D3D0]'
              } disabled:cursor-not-allowed`}
            >
              {addedToRoadmap ? (
                <>
                  <Check size={14} />
                  Added to Roadmap
                </>
              ) : addingToRoadmap ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-[#E9E9E7] border-t-[#0075DE] rounded-full animate-spin" />
                  Adding…
                </>
              ) : (
                <>
                  <Plus size={14} />
                  Add to Roadmap
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
