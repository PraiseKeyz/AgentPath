'use client'

import React, { useEffect, useState } from 'react'
import { getRoadmap, updateMilestone, deleteMilestone, addMilestone, type Roadmap, type Milestone } from '@/services/roadmap.service'
import { Plus, Trash2, CheckCircle2, Circle, Clock } from 'lucide-react'

const STATUS_ICONS = {
  pending: <Circle size={16} className="text-gray-400" />,
  in_progress: <Clock size={16} className="text-orange-500" />,
  done: <CheckCircle2 size={16} className="text-green-600" />,
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

  if (loading) return <div className="p-6 text-gray-400 text-sm">Loading…</div>

  const milestones = roadmap?.milestones ?? []
  const done = milestones.filter((m) => m.status === 'done').length

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">My Roadmap</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1 text-sm text-green-700 font-semibold hover:text-green-800"
        >
          <Plus size={16} /> Add milestone
        </button>
      </div>

      {milestones.length > 0 && (
        <p className="text-sm text-gray-400 mb-6">{done} of {milestones.length} complete</p>
      )}

      {showForm && (
        <form onSubmit={handleAdd} className="flex gap-2 mb-6">
          <input
            autoFocus
            type="text"
            placeholder="e.g. Apply to JAF scholarship"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
          />
          <button type="submit" className="bg-green-700 text-white px-4 rounded-lg text-sm font-semibold hover:bg-green-800">
            Add
          </button>
          <button type="button" onClick={() => setShowForm(false)} className="px-3 text-gray-400 hover:text-gray-600 text-sm">
            Cancel
          </button>
        </form>
      )}

      {milestones.length === 0 && !showForm && (
        <div className="text-center py-16">
          <p className="text-gray-400 text-sm mb-4">No milestones yet. Add one to start tracking your progress.</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-700 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-green-800 transition-colors"
          >
            Add first milestone
          </button>
        </div>
      )}

      <ul className="flex flex-col gap-2">
        {milestones.map((m) => (
          <li key={m._id} className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl group">
            <button
              onClick={() => handleStatusCycle(m)}
              className="mt-0.5 shrink-0"
              title="Click to advance status"
            >
              {STATUS_ICONS[m.status]}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${m.status === 'done' ? 'line-through text-gray-400' : ''}`}>
                {m.title}
              </p>
              {m.description && <p className="text-xs text-gray-400 mt-0.5">{m.description}</p>}
              {m.dueDate && (
                <p className="text-xs text-orange-500 mt-1">Due {new Date(m.dueDate).toLocaleDateString()}</p>
              )}
            </div>
            <button
              onClick={() => handleDelete(m._id)}
              className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all shrink-0"
            >
              <Trash2 size={14} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
