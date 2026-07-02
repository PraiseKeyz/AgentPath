'use client'

import React, { useEffect, useState } from 'react'
import { getRoadmap, updateMilestone, deleteMilestone, addMilestone, type Roadmap, type Milestone } from '@/services/roadmap.service'
import { Plus, Trash2, CheckCircle2, Circle, Clock, Target } from 'lucide-react'

const STATUS_ICONS: Record<Milestone['status'], React.ReactNode> = {
  pending: <Circle size={18} className="text-[#B4B4B0]" />,
  in_progress: <Clock size={18} className="text-[#FF8A33]" />,
  done: <CheckCircle2 size={18} className="text-[#1AAE39]" />,
}

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  useEffect(() => {
    getRoadmap().then(setRoadmap).finally(() => setLoading(false))
  }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newTitle.trim()) return
    const updated = await addMilestone({ title: newTitle.trim() })
    setRoadmap(updated)
    setNewTitle('')
    setShowForm(false)
  }

  async function handleStatusCycle(m: Milestone) {
    const next: Milestone['status'] = m.status === 'pending' ? 'in_progress' : m.status === 'in_progress' ? 'done' : 'pending'
    const updated = await updateMilestone(m._id, { status: next })
    setRoadmap(updated)
  }

  async function handleDelete(id: string) {
    const updated = await deleteMilestone(id)
    setRoadmap(updated)
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center gap-2 text-[#B4B4B0] text-sm">
        <div className="w-4 h-4 border-2 border-[#E9E9E7] border-t-[#0075DE] rounded-full animate-spin" />
        Loading…
      </div>
    )
  }

  const milestones = roadmap?.milestones ?? []
  const done = milestones.filter((m) => m.status === 'done').length

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-bold text-[#000000]">My Roadmap</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 text-sm text-[#0075DE] font-semibold hover:text-[#005BAB] transition-colors duration-200 cursor-pointer"
        >
          <Plus size={16} />
          Add milestone
        </button>
      </div>

      {milestones.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-[#787774] mb-2">{done} of {milestones.length} complete</p>
          <div className="h-1.5 bg-[#E9E9E7] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1AAE39] rounded-full transition-all duration-500"
              style={{ width: `${milestones.length ? (done / milestones.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleAdd} className="flex gap-2 mb-6">
          <input
            autoFocus
            type="text"
            placeholder="e.g. Apply to JAF scholarship"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 border border-[#E9E9E7] rounded-lg px-3 py-2.5 text-sm bg-white text-[#000000] placeholder:text-[#B4B4B0] focus:outline-none focus:ring-2 focus:ring-[#0075DE] focus:border-[#0075DE] transition-all duration-200"
          />
          <button type="submit" className="bg-[#0075DE] text-white px-4 rounded-lg text-sm font-semibold hover:bg-[#097FE8] transition-all duration-200 cursor-pointer">
            Add
          </button>
          <button type="button" onClick={() => setShowForm(false)} className="px-3 text-[#787774] hover:text-[#000000] text-sm transition-colors cursor-pointer">
            Cancel
          </button>
        </form>
      )}

      {milestones.length === 0 && !showForm && (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FFF5E0] text-[#FF8A33] mb-4">
            <Target size={24} />
          </div>
          <p className="text-[#787774] text-sm mb-4">No milestones yet. Add one to start tracking your progress.</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-[#0075DE] text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#097FE8] transition-all duration-200 cursor-pointer"
          >
            Add first milestone
          </button>
        </div>
      )}

      <ul className="flex flex-col gap-2">
        {milestones.map((m) => (
          <li key={m._id} className="flex items-start gap-3 p-4 bg-white border border-[#E9E9E7] rounded-xl hover:border-[#D3D3D0] transition-all duration-200 group">
            <button
              onClick={() => handleStatusCycle(m)}
              className="mt-0.5 shrink-0 cursor-pointer hover:scale-110 transition-transform duration-150"
              title="Click to advance status"
            >
              {STATUS_ICONS[m.status]}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${m.status === 'done' ? 'line-through text-[#B4B4B0]' : 'text-[#000000]'}`}>
                {m.title}
              </p>
              {m.description && <p className="text-xs text-[#787774] mt-0.5">{m.description}</p>}
              {m.dueDate && (
                <p className="text-xs text-[#FF8A33] mt-1 font-medium">Due {new Date(m.dueDate).toLocaleDateString()}</p>
              )}
            </div>
            <button
              onClick={() => handleDelete(m._id)}
              className="opacity-0 group-hover:opacity-100 text-[#B4B4B0] hover:text-[#F64932] transition-all duration-150 shrink-0 cursor-pointer"
            >
              <Trash2 size={14} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
