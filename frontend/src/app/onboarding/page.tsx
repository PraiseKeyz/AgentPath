'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { completeOnboarding } from '@/services/users.service'

const STEPS = ['University', 'Course & Year', 'Your Goals']

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [university, setUniversity] = useState('')
  const [courseOfStudy, setCourseOfStudy] = useState('')
  const [yearOfStudy, setYearOfStudy] = useState(1)
  const [goalInput, setGoalInput] = useState('')
  const [goals, setGoals] = useState<string[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function addGoal() {
    const trimmed = goalInput.trim()
    if (trimmed && !goals.includes(trimmed)) {
      setGoals([...goals, trimmed])
      setGoalInput('')
    }
  }

  function removeGoal(g: string) {
    setGoals(goals.filter((x) => x !== g))
  }

  async function finish() {
    if (goals.length === 0) {
      setError('Add at least one goal to continue.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await completeOnboarding({ university, courseOfStudy, yearOfStudy, goals })
      router.push('/chat')
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="flex gap-2 mb-8">
          {STEPS.map((label, i) => (
            <div key={label} className="flex-1">
              <div className={`h-1.5 rounded-full ${i <= step ? 'bg-green-700' : 'bg-gray-200'}`} />
              <p className={`text-xs mt-1 ${i === step ? 'text-green-700 font-semibold' : 'text-gray-400'}`}>{label}</p>
            </div>
          ))}
        </div>

        {step === 0 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Which university do you attend?</h2>
            <input
              type="text"
              placeholder="e.g. University of Lagos"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
            />
            <button
              onClick={() => university.trim() && setStep(1)}
              disabled={!university.trim()}
              className="bg-green-700 text-white rounded-lg py-2.5 font-semibold hover:bg-green-800 disabled:opacity-40 transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">What are you studying?</h2>
            <input
              type="text"
              placeholder="e.g. Computer Science"
              value={courseOfStudy}
              onChange={(e) => setCourseOfStudy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
            />
            <div>
              <label className="block text-sm font-medium mb-1">Year of study</label>
              <select
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
              >
                {[1, 2, 3, 4, 5, 6].map((y) => (
                  <option key={y} value={y}>Year {y}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep(0)} className="flex-1 border border-gray-300 rounded-lg py-2.5 font-semibold hover:bg-gray-50">Back</button>
              <button
                onClick={() => courseOfStudy.trim() && setStep(2)}
                disabled={!courseOfStudy.trim()}
                className="flex-1 bg-green-700 text-white rounded-lg py-2.5 font-semibold hover:bg-green-800 disabled:opacity-40 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">What are you hoping to achieve?</h2>
            <p className="text-gray-500 text-sm">Add one goal at a time. Be as specific or broad as you like.</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Win a scholarship this year"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal())}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
              />
              <button onClick={addGoal} className="px-4 bg-gray-100 rounded-lg text-sm font-semibold hover:bg-gray-200">Add</button>
            </div>
            {goals.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {goals.map((g) => (
                  <li key={g} className="flex items-center gap-1 bg-green-50 text-green-800 text-sm px-3 py-1 rounded-full">
                    {g}
                    <button onClick={() => removeGoal(g)} className="ml-1 text-green-600 hover:text-red-500">×</button>
                  </li>
                ))}
              </ul>
            )}
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="flex-1 border border-gray-300 rounded-lg py-2.5 font-semibold hover:bg-gray-50">Back</button>
              <button
                onClick={finish}
                disabled={loading}
                className="flex-1 bg-green-700 text-white rounded-lg py-2.5 font-semibold hover:bg-green-800 disabled:opacity-40 transition-colors"
              >
                {loading ? 'Setting up…' : 'Meet my mentor →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
