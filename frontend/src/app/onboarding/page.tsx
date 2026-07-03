'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { completeOnboarding } from '@/services/users.service'

const STEPS = ['University', 'Course & Year', 'Your Goals']

const NIGERIAN_UNIVERSITIES = [
  'University of Ibadan (UI)',
  'University of Lagos (UNILAG)',
  'Obafemi Awolowo University (OAU)',
  'University of Nigeria, Nsukka (UNN)',
  'Ahmadu Bello University (ABU)',
  'Covenant University',
  'University of Benin (UNIBEN)',
  'University of Ilorin (UNILORIN)',
  'Federal University of Technology, Minna (FUTMINNA)',
  'Federal University of Technology, Akure (FUTA)',
  'Lagos State University (LASU)',
  'Babcock University',
]

const SUGGESTED_GOALS = [
  'Find Scholarships',
  'Internship Placement',
  'CV / Resume Review',
  'Write Application Essays',
  'Study Abroad / Fellowships',
  'Career Mentorship',
]

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

  function addGoal(goal: string) {
    const trimmed = goal.trim()
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
      setError('Please add at least one goal to help your mentor guide you.')
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
    <div className="min-h-screen bg-[#F6F5F4] flex items-center justify-center p-6 font-sans antialiased animate-fade-in">
      <div className="w-full max-w-lg">
        {/* Navigation / Progress header */}
        <div className="mb-8">
          <div className="flex gap-2">
            {STEPS.map((label, i) => (
              <div key={label} className="flex-1">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i <= step ? 'bg-[#0075DE]' : 'bg-[#E9E9E7]'
                  }`}
                />
                <p
                  className={`text-[10px] uppercase tracking-wider mt-2 font-bold transition-colors duration-300 ${
                    i === step ? 'text-[#0075DE]' : i < step ? 'text-[#787774]' : 'text-[#B4B4B0]'
                  }`}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Step Cards */}
        <div className="bg-white rounded-xl border border-[#E9E9E7] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-8 transition-all duration-300">
          {step === 0 && (
            <div className="flex flex-col gap-6 animate-slide-up">
              <div>
                <h2 className="text-xl font-extrabold text-[#000000] tracking-tight flex items-center gap-2">
                  <span>🎓</span> Which university do you attend?
                </h2>
                <p className="text-[#787774] text-xs font-medium mt-1">
                  We customize opportunity matches based on your institution.
                </p>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Start typing your university..."
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  list="universities-list"
                  className="w-full border border-[#E9E9E7] rounded-lg px-3.5 py-3 text-sm bg-white text-[#000000] placeholder:text-[#B4B4B0] focus:outline-none focus:ring-2 focus:ring-[#0075DE] focus:border-[#0075DE] transition-all duration-200"
                />
                <datalist id="universities-list">
                  {NIGERIAN_UNIVERSITIES.map((uni) => (
                    <option key={uni} value={uni} />
                  ))}
                </datalist>
              </div>

              <button
                onClick={() => university.trim() && setStep(1)}
                disabled={!university.trim()}
                className="w-full bg-[#0075DE] text-white rounded-lg py-2.5 font-bold text-sm hover:bg-[#097FE8] active:bg-[#005BAB] disabled:opacity-40 transition-all duration-200 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
              >
                Continue
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-6 animate-slide-up">
              <div>
                <h2 className="text-xl font-extrabold text-[#000000] tracking-tight flex items-center gap-2">
                  <span>📚</span> What are you studying?
                </h2>
                <p className="text-[#787774] text-xs font-medium mt-1">
                  This helps your mentor recommend course-specific fellowships and internships.
                </p>
              </div>

              <div className="flex flex-col gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#37352F] uppercase tracking-wider mb-2">
                    Course of Study
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mechanical Engineering"
                    value={courseOfStudy}
                    onChange={(e) => setCourseOfStudy(e.target.value)}
                    className="w-full border border-[#E9E9E7] rounded-lg px-3.5 py-3 text-sm bg-white text-[#000000] placeholder:text-[#B4B4B0] focus:outline-none focus:ring-2 focus:ring-[#0075DE] focus:border-[#0075DE] transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#37352F] uppercase tracking-wider mb-2">
                    Year of Study
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {[1, 2, 3, 4, 5, 6].map((y) => (
                      <button
                        key={y}
                        type="button"
                        onClick={() => setYearOfStudy(y)}
                        className={`py-2 rounded-lg text-sm font-semibold transition-all duration-150 border cursor-pointer ${
                          yearOfStudy === y
                            ? 'bg-[#0075DE] text-white border-[#0075DE] shadow-[0_1px_3px_rgba(0,117,222,0.2)]'
                            : 'bg-white text-[#37352F] border-[#E9E9E7] hover:bg-[#F6F5F4]'
                        }`}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(0)}
                  className="flex-1 border border-[#E9E9E7] bg-white text-[#37352F] rounded-lg py-2.5 font-bold text-sm hover:bg-[#F6F5F4] transition-all duration-150 cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={() => courseOfStudy.trim() && setStep(2)}
                  disabled={!courseOfStudy.trim()}
                  className="flex-1 bg-[#0075DE] text-white rounded-lg py-2.5 font-bold text-sm hover:bg-[#097FE8] active:bg-[#005BAB] disabled:opacity-40 transition-all duration-200 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-6 animate-slide-up">
              <div>
                <h2 className="text-xl font-extrabold text-[#000000] tracking-tight flex items-center gap-2">
                  <span>🎯</span> What are you hoping to achieve?
                </h2>
                <p className="text-[#787774] text-xs font-medium mt-1">
                  Add goals to align your mentor's guidance with your aspirations.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a goal and press enter..."
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal(goalInput))}
                    className="flex-1 border border-[#E9E9E7] rounded-lg px-3.5 py-2.5 text-sm bg-white text-[#000000] placeholder:text-[#B4B4B0] focus:outline-none focus:ring-2 focus:ring-[#0075DE] focus:border-[#0075DE] transition-all duration-200"
                  />
                  <button
                    onClick={() => addGoal(goalInput)}
                    className="px-4 border border-[#E9E9E7] bg-[#F6F5F4] text-[#37352F] rounded-lg text-sm font-bold hover:bg-[#EFEEEC] transition-all duration-150 cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                {/* Suggested Quick Add Pills */}
                <div>
                  <p className="text-[10px] font-bold text-[#B4B4B0] uppercase tracking-wider mb-2">Suggested Goals</p>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_GOALS.map((sGoal) => {
                      const alreadyAdded = goals.includes(sGoal)
                      return (
                        <button
                          key={sGoal}
                          type="button"
                          disabled={alreadyAdded}
                          onClick={() => addGoal(sGoal)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all duration-150 ${
                            alreadyAdded
                              ? 'bg-[#E9E9E7] text-[#B4B4B0] border-[#E9E9E7] cursor-not-allowed'
                              : 'bg-white text-[#37352F] border-[#E9E9E7] hover:bg-[#E6F3FE] hover:border-[#D3E5EF] hover:text-[#0075DE] cursor-pointer'
                          }`}
                        >
                          + {sGoal}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Stated Goals List */}
                {goals.length > 0 && (
                  <div className="border border-[#E9E9E7] rounded-lg p-3 bg-[#F6F5F4]/50">
                    <p className="text-[10px] font-bold text-[#B4B4B0] uppercase tracking-wider mb-2">My Goals</p>
                    <ul className="flex flex-wrap gap-1.5">
                      {goals.map((g) => (
                        <li
                          key={g}
                          className="flex items-center gap-1.5 bg-[#E6F3FE] text-[#0075DE] text-xs font-semibold px-3 py-1 rounded-full border border-[#D3E5EF] animate-fade-in"
                        >
                          <span>{g}</span>
                          <button
                            onClick={() => removeGoal(g)}
                            className="text-[#62AEF0] hover:text-[#F64932] transition-colors cursor-pointer text-sm font-bold"
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {error && (
                  <p className="text-[#F64932] text-xs font-medium bg-[#FEF3F1] border border-[#F77463]/25 px-3 py-2.5 rounded-lg animate-fade-in">
                    {error}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-[#E9E9E7] bg-white text-[#37352F] rounded-lg py-2.5 font-bold text-sm hover:bg-[#F6F5F4] transition-all duration-150 cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={finish}
                  disabled={loading}
                  className="flex-1 bg-[#0075DE] text-white rounded-lg py-2.5 font-bold text-sm hover:bg-[#097FE8] active:bg-[#005BAB] disabled:opacity-40 transition-all duration-200 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
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
