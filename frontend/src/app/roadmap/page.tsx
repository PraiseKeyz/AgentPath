'use client'

import React, { useEffect, useState } from 'react'
import {
  getRoadmap, updateMilestone, deleteMilestone, addMilestone,
  type Roadmap, type Milestone,
} from '@/services/roadmap.service'
import {
  Plus, Trash2, CheckCircle2, Circle, Clock, Map, Target,
  Calendar, X, ChevronRight,
} from 'lucide-react'

const COLUMNS: { key: Milestone['status']; label: string; icon: React.ReactNode; accent: string; bg: string }[] = [
  { key: 'pending', label: 'To Do', icon: <Circle size={14} />, accent: 'text-[#787774]', bg: 'bg-[#F6F5F4]' },
  { key: 'in_progress', label: 'In Progress', icon: <Clock size={14} />, accent: 'text-[#FF8A33]', bg: 'bg-[#FFF5E0]' },
  { key: 'done', label: 'Completed', icon: <CheckCircle2 size={14} />, accent: 'text-[#1AAE39]', bg: 'bg-[#E2F5E9]' },
]

const NEXT_STATUS: Record<Milestone['status'], Milestone['status']> = {
  pending: 'in_progress',
  in_progress: 'done',
  done: 'pending',
}

// SVG Progress Ring Component
function ProgressRing({ done, total }: { done: number; total: number }) {
  const pct = total > 0 ? (done / total) * 100 : 0
  const r = 28
  const stroke = 5
  const circumference = 2 * Math.PI * r

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="70" height="70" viewBox="0 0 70 70">
        {/* Track */}
        <circle cx="35" cy="35" r={r} fill="none" stroke="#E9E9E7" strokeWidth={stroke} />
        {/* Progress */}
        <circle
          cx="35" cy="35" r={r}
          fill="none"
          stroke="#0075DE"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (pct / 100) * circumference}
          transform="rotate(-90 35 35)"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <span className="absolute text-xs font-extrabold text-[#37352F]">
        {Math.round(pct)}%
      </span>
    </div>
  )
}

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newDueDate, setNewDueDate] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    getRoadmap().then(setRoadmap).finally(() => setLoading(false))
  }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newTitle.trim()) return
    setError('')
    try {
      const updated = await addMilestone({
        title: newTitle.trim(),
        description: newDescription.trim() || undefined,
        dueDate: newDueDate || undefined,
      })
      setRoadmap(updated)
      setNewTitle('')
      setNewDescription('')
      setNewDueDate('')
      setShowForm(false)
    } catch (err: any) {
      setError(err.message ?? 'Failed to add milestone')
    }
  }

  async function handleStatusCycle(m: Milestone) {
    try {
      const updated = await updateMilestone(m._id, { status: NEXT_STATUS[m.status] })
      setRoadmap(updated)
    } catch (err: any) {
      setError(err.message ?? 'Failed to update status')
    }
  }

  async function handleDelete(id: string) {
    try {
      const updated = await deleteMilestone(id)
      setRoadmap(updated)
    } catch (err: any) {
      setError(err.message ?? 'Failed to delete milestone')
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 md:p-8 animate-fade-in">
        <div className="h-6 bg-[#F6F5F4] rounded w-40 animate-pulse mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-[#F6F5F4] rounded-xl p-4 h-48 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const milestones = roadmap?.milestones ?? []
  const done = milestones.filter((m) => m.status === 'done').length

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-[#E9E9E7] pb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#F6F5F4] text-[#37352F] border border-[#E9E9E7]">
            <Map size={18} strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#000000] tracking-tight">Your Roadmap</h1>
            <p className="text-xs text-[#787774] font-medium">Track milestones and plan your journey</p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-1.5 bg-[#0075DE] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#097FE8] active:bg-[#005BAB] transition-all duration-150 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
        >
          <Plus size={14} strokeWidth={2.5} />
          Add milestone
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 flex items-center gap-2 bg-[#FEF3F1] border border-[#F77463]/20 text-[#F64932] text-xs font-medium px-3.5 py-2.5 rounded-lg animate-fade-in">
          {error}
          <button onClick={() => setError('')} className="ml-auto cursor-pointer"><X size={12} /></button>
        </div>
      )}

      {/* Progress Summary */}
      {milestones.length > 0 && (
        <div className="flex items-center gap-6 mb-8 p-5 bg-white border border-[#E9E9E7] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <ProgressRing done={done} total={milestones.length} />
          <div>
            <p className="text-sm font-extrabold text-[#000000]">
              {done} of {milestones.length} milestone{milestones.length > 1 ? 's' : ''} completed
            </p>
            <p className="text-xs text-[#787774] font-medium mt-0.5">
              {milestones.length - done === 0
                ? 'All done! Great work 🎉'
                : `${milestones.length - done} remaining`}
            </p>
          </div>
        </div>
      )}

      {/* Add Milestone Inline Form */}
      {showForm && (
        <div className="mb-6 p-5 bg-white border border-[#0075DE]/20 rounded-xl shadow-[0_2px_8px_rgba(0,117,222,0.06)] animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#37352F]">New Milestone</h3>
            <button onClick={() => setShowForm(false)} className="text-[#787774] hover:text-[#37352F] cursor-pointer">
              <X size={16} />
            </button>
          </div>
          <form onSubmit={handleAdd} className="flex flex-col gap-3">
            <input
              autoFocus
              type="text"
              placeholder="What do you want to accomplish?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full border border-[#E9E9E7] rounded-lg px-3.5 py-2.5 text-sm bg-white text-[#000000] placeholder:text-[#B4B4B0] focus:outline-none focus:ring-2 focus:ring-[#0075DE]/20 focus:border-[#0075DE] transition-all duration-200"
            />
            <textarea
              placeholder="Add a description (optional)"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows={2}
              className="w-full border border-[#E9E9E7] rounded-lg px-3.5 py-2.5 text-sm bg-white text-[#000000] placeholder:text-[#B4B4B0] focus:outline-none focus:ring-2 focus:ring-[#0075DE]/20 focus:border-[#0075DE] transition-all duration-200 resize-none"
            />
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-[#B4B4B0]" />
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="border border-[#E9E9E7] rounded-lg px-3 py-1.5 text-xs bg-white text-[#37352F] focus:outline-none focus:ring-2 focus:ring-[#0075DE]/20 focus:border-[#0075DE] transition-all"
                />
              </div>
              <div className="flex gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-1.5 text-xs font-bold text-[#787774] hover:text-[#37352F] border border-[#E9E9E7] rounded-lg hover:bg-[#F6F5F4] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim()}
                  className="px-4 py-1.5 text-xs font-bold bg-[#0075DE] text-white rounded-lg hover:bg-[#097FE8] disabled:opacity-40 transition-all cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                >
                  Add
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Empty State */}
      {milestones.length === 0 && !showForm && (
        <div className="text-center py-16 bg-white border border-[#E9E9E7] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] animate-slide-up">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FFF5E0] text-[#FF8A33] mb-4">
            <Target size={20} />
          </div>
          <h2 className="text-base font-extrabold text-[#000000] tracking-tight mb-2">Your journey starts here</h2>
          <p className="text-xs text-[#787774] font-medium max-w-sm mx-auto mb-6 leading-relaxed">
            Add milestones to track your applications, deadlines, and academic goals. Your roadmap is your personal action plan.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-[#0075DE] text-white px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-[#097FE8] transition-all cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
          >
            <Plus size={14} />
            Add first milestone
          </button>
        </div>
      )}

      {/* Kanban Columns */}
      {milestones.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLUMNS.map((col) => {
            const items = milestones.filter((m) => m.status === col.key)
            return (
              <div key={col.key} className="flex flex-col">
                {/* Column Header */}
                <div className={`flex items-center gap-2 px-3 py-2.5 rounded-t-xl ${col.bg} border border-b-0 border-[#E9E9E7]`}>
                  <span className={col.accent}>{col.icon}</span>
                  <span className="text-xs font-bold text-[#37352F]">{col.label}</span>
                  <span className="text-[10px] font-bold text-[#B4B4B0] bg-white px-1.5 py-0.5 rounded-full border border-[#E9E9E7] ml-auto">
                    {items.length}
                  </span>
                </div>

                {/* Column Body */}
                <div className="flex-1 bg-[#FAFAF9] border border-[#E9E9E7] rounded-b-xl p-2.5 min-h-[120px] flex flex-col gap-2">
                  {items.length === 0 && (
                    <p className="text-[10px] text-[#B4B4B0] text-center py-6 font-medium">
                      No milestones
                    </p>
                  )}

                  {items.map((m) => (
                    <div
                      key={m._id}
                      className="bg-white border border-[#E9E9E7] rounded-lg p-3.5 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-[#D3D3D0] transition-all duration-150 group"
                    >
                      {/* Title */}
                      <p className={`text-xs font-bold leading-snug mb-1 ${
                        m.status === 'done' ? 'line-through text-[#B4B4B0]' : 'text-[#37352F]'
                      }`}>
                        {m.title}
                      </p>

                      {/* Description */}
                      {m.description && (
                        <p className="text-[10px] text-[#787774] line-clamp-2 mb-2 leading-relaxed">{m.description}</p>
                      )}

                      {/* Due Date */}
                      {m.dueDate && (
                        <div className="flex items-center gap-1 mb-2">
                          <Calendar size={10} className="text-[#B4B4B0]" />
                          <span className="text-[10px] font-medium text-[#787774]">
                            {new Date(m.dueDate).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#E9E9E7]/60">
                        <button
                          onClick={() => handleStatusCycle(m)}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0075DE] hover:text-[#005BAB] transition-colors cursor-pointer"
                          title={`Move to ${NEXT_STATUS[m.status].replace('_', ' ')}`}
                        >
                          <ChevronRight size={12} />
                          {m.status === 'pending' && 'Start'}
                          {m.status === 'in_progress' && 'Complete'}
                          {m.status === 'done' && 'Restart'}
                        </button>

                        <button
                          onClick={() => handleDelete(m._id)}
                          className="opacity-0 group-hover:opacity-100 text-[#B4B4B0] hover:text-[#F64932] p-1 rounded hover:bg-[#FEF3F1] transition-all duration-150 cursor-pointer"
                          title="Delete milestone"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
