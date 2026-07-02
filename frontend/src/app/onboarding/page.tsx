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
    <div className="min-h-screen bg-[#F6F5F4] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress bar */}
        <div className="flex gap-2 mb-8">
          {STEPS.map((label, i) => (
            <div key={label} className="flex-1">
              <div
                className={`h-1.5 rounded-full transition-colors duration-300 ${
                  i <= step ? 'bg-[#0075DE]' : 'bg-[#E9E9E7]'
                }`}
              />
              <p
                className={`text-xs mt-1.5 font-medium transition-colors duration-300 ${
                  i === step ? 'text-[#0075DE]' : i < step ? 'text-[#787774]' : 'text-[#B4B4B0]'
                }`}
              >
                {label}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.04)] p-8">
          {step === 0 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-[#000000]">Which university do you attend?</h2>
              <input
                type="text"
                placeholder="e.g. University of Lagos"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="border border-[#E9E9E7] rounded-lg px-3 py-2.5 text-sm bg-white text-[#000000] placeholder:text-[#B4B4B0] focus:outline-none focus:ring-2 focus:ring-[#0075DE] focus:border-[#0075DE] transition-all duration-200"
              />
              <button
                onClick={() => university.trim() && setStep(1)}
                disabled={!university.trim()}
                className="bg-[#0075DE] text-white rounded-lg py-2.5 font-semibold text-sm hover:bg-[#097FE8] disabled:opacity-40 transition-all duration-200 cursor-pointer"
              >
                Next
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-[#000000]">What are you studying?</h2>
              <input
                type="text"
                placeholder="e.g. Computer Science"
                value={courseOfStudy}
                onChange={(e) => setCourseOfStudy(e.target.value)}
                className="border border-[#E9E9E7] rounded-lg px-3 py-2.5 text-sm bg-white text-[#000000] placeholder:text-[#B4B4B0] focus:outline-none focus:ring-2 focus:ring-[#0075DE] focus:border-[#0075DE] transition-all duration-200"
              />
              <div>
                <label className="block text-sm font-medium text-[#37352F] mb-1.5">Year of study</label>
                <select
                  value={yearOfStudy}
                  onChange={(e) => setYearOfStudy(Number(e.target.value))}
                  className="w-full border border-[#E9E9E7] rounded-lg px-3 py-2.5 text-sm bg-white text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#0075DE] focus:border-[#0075DE] transition-all duration-200"
                >
                  {[1, 2, 3, 4, 5, 6].map((y) => (
                    <option key={y} value={y}>Year {y}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setStep(0)}
                  className="flex-1 border border-[#E9E9E7] bg-white text-[#37352F] rounded-lg py-2.5 font-semibold text-sm hover:bg-[#F6F5F4] transition-all duration-200 cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={() => courseOfStudy.trim() && setStep(2)}
                  disabled={!courseOfStudy.trim()}
                  className="flex-1 bg-[#0075DE] text-white rounded-lg py-2.5 font-semibold text-sm hover:bg-[#097FE8] disabled:opacity-40 transition-all duration-200 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-[#000000]">What are you hoping to achieve?</h2>
              <p className="text-[#787774] text-sm -mt-2">Add one goal at a time. Be as specific or broad as you like.</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Win a scholarship this year"
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal())}
                  className="flex-1 border border-[#E9E9E7] rounded-lg px-3 py-2.5 text-sm bg-white text-[#000000] placeholder:text-[#B4B4B0] focus:outline-none focus:ring-2 focus:ring-[#0075DE] focus:border-[#0075DE] transition-all duration-200"
                />
                <button
                  onClick={addGoal}
                  className="px-4 bg-[#F6F5F4] border border-[#E9E9E7] rounded-lg text-sm font-semibold text-[#37352F] hover:bg-[#EFEEEC] transition-all duration-200 cursor-pointer"
                >
                  Add
                </button>
              </div>
              {goals.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                  {goals.map((g) => (
                    <li key={g} className="flex items-center gap-1 bg-[#E6F3FE] text-[#0075DE] text-sm px-3 py-1 rounded-full font-medium">
                      {g}
                      <button
                        onClick={() => removeGoal(g)}
                        className="ml-1 text-[#62AEF0] hover:text-[#F64932] transition-colors cursor-pointer"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {error && <p className="text-[#F64932] text-sm bg-[#FEF3F1] px-3 py-2 rounded-lg">{error}</p>}
              <div className="flex gap-2">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-[#E9E9E7] bg-white text-[#37352F] rounded-lg py-2.5 font-semibold text-sm hover:bg-[#F6F5F4] transition-all duration-200 cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={finish}
                  disabled={loading}
                  className="flex-1 bg-[#0075DE] text-white rounded-lg py-2.5 font-semibold text-sm hover:bg-[#097FE8] disabled:opacity-40 transition-all duration-200 cursor-pointer"
                >
                  {loading ? 'Setting up…' : 'Meet my mentor →'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
