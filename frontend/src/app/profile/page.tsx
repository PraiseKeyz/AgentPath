'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getMe, logout, type User } from '@/services/auth.service'
import { updateProfile } from '@/services/users.service'
import { clientFetch } from '@/lib/api/client'
import {
  User as UserIcon, GraduationCap, Target, Shield, LogOut,
  Check, X, Plus, Calendar,
} from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Academic form state
  const [name, setName] = useState('')
  const [university, setUniversity] = useState('')
  const [courseOfStudy, setCourseOfStudy] = useState('')
  const [yearOfStudy, setYearOfStudy] = useState(1)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [profileError, setProfileError] = useState('')

  // Goals state
  const [goals, setGoals] = useState<string[]>([])
  const [goalInput, setGoalInput] = useState('')
  const [savingGoals, setSavingGoals] = useState(false)

  // Password state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    getMe()
      .then((u) => {
        setUser(u)
        setName(u.name)
        setUniversity(u.university)
        setCourseOfStudy(u.courseOfStudy)
        setYearOfStudy(u.yearOfStudy)
        setGoals(u.goals ?? [])
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false))
  }, [router])

  // Check if academic form has been modified
  const isDirty = user
    ? name !== user.name ||
      university !== user.university ||
      courseOfStudy !== user.courseOfStudy ||
      yearOfStudy !== user.yearOfStudy
    : false

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setProfileError('')
    try {
      const updated = await updateProfile({ name, university, courseOfStudy, yearOfStudy })
      setUser(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err: any) {
      setProfileError(err.message ?? 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  // Goals management
  async function addGoal() {
    const trimmed = goalInput.trim()
    if (!trimmed || goals.includes(trimmed)) return
    const newGoals = [...goals, trimmed]
    setGoals(newGoals)
    setGoalInput('')
    setSavingGoals(true)
    try {
      await updateProfile({ goals: newGoals } as any)
    } catch {
      setGoals(goals) // revert
    } finally {
      setSavingGoals(false)
    }
  }

  async function removeGoal(g: string) {
    const newGoals = goals.filter((x) => x !== g)
    setGoals(newGoals)
    setSavingGoals(true)
    try {
      await updateProfile({ goals: newGoals } as any)
    } catch {
      setGoals(goals) // revert
    } finally {
      setSavingGoals(false)
    }
  }

  // Password change
  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (!currentPassword || !newPassword) return
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters')
      return
    }
    setPasswordSaving(true)
    setPasswordError('')
    setPasswordSuccess(false)
    try {
      await clientFetch('/auth/change-password', {
        method: 'PATCH',
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      setPasswordSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setTimeout(() => setPasswordSuccess(false), 3000)
    } catch (err: any) {
      setPasswordError(err.message ?? 'Failed to change password')
    } finally {
      setPasswordSaving(false)
    }
  }

  function handleLogout() {
    logout()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="max-w-lg mx-auto p-6 md:p-8 animate-fade-in">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-[#F6F5F4] animate-pulse" />
          <div>
            <div className="h-5 bg-[#F6F5F4] rounded w-32 animate-pulse mb-2" />
            <div className="h-3 bg-[#F6F5F4] rounded w-48 animate-pulse" />
          </div>
        </div>
        <div className="h-64 bg-[#F6F5F4] rounded-xl animate-pulse" />
      </div>
    )
  }

  if (!user) return null

  const initials = user.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="max-w-lg mx-auto p-6 md:p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-6 border-b border-[#E9E9E7] pb-5">
        <div className="p-2 rounded-lg bg-[#F6F5F4] text-[#37352F] border border-[#E9E9E7]">
          <UserIcon size={18} strokeWidth={1.8} />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-[#000000] tracking-tight">Profile</h1>
          <p className="text-xs text-[#787774] font-medium">Manage your account and preferences</p>
        </div>
      </div>

      {/* Avatar + Identity Card */}
      <div className="flex items-center gap-4 mb-8 p-5 bg-white border border-[#E9E9E7] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0075DE] to-[#62AEF0] text-white flex items-center justify-center font-bold text-lg shadow-[0_2px_8px_rgba(0,117,222,0.2)] select-none shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-base font-extrabold text-[#000000] truncate">{user.name}</p>
          <p className="text-xs text-[#787774] font-medium truncate">{user.email}</p>
          <div className="flex items-center gap-1 mt-1">
            <Calendar size={10} className="text-[#B4B4B0]" />
            <p className="text-[10px] text-[#B4B4B0] font-medium">
              Joined {new Date(user.createdAt).toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Section 1: Academic Information */}
      <div className="bg-white border border-[#E9E9E7] rounded-xl p-6 mb-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2 mb-5">
          <GraduationCap size={16} className="text-[#0075DE]" />
          <h2 className="text-sm font-extrabold text-[#37352F]">Academic Information</h2>
        </div>

        <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
          <div>
            <label className="block text-[10px] font-bold text-[#B4B4B0] uppercase tracking-wider mb-1.5">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-[#E9E9E7] rounded-lg px-3.5 py-2.5 text-sm bg-white text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#0075DE]/20 focus:border-[#0075DE] transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#B4B4B0] uppercase tracking-wider mb-1.5">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full border border-[#E9E9E7] rounded-lg px-3.5 py-2.5 text-sm bg-[#F6F5F4] text-[#B4B4B0] cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#B4B4B0] uppercase tracking-wider mb-1.5">University</label>
            <input
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="w-full border border-[#E9E9E7] rounded-lg px-3.5 py-2.5 text-sm bg-white text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#0075DE]/20 focus:border-[#0075DE] transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#B4B4B0] uppercase tracking-wider mb-1.5">Course of Study</label>
            <input
              type="text"
              value={courseOfStudy}
              onChange={(e) => setCourseOfStudy(e.target.value)}
              className="w-full border border-[#E9E9E7] rounded-lg px-3.5 py-2.5 text-sm bg-white text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#0075DE]/20 focus:border-[#0075DE] transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#B4B4B0] uppercase tracking-wider mb-2">Year of Study</label>
            <div className="grid grid-cols-6 gap-2">
              {[1, 2, 3, 4, 5, 6].map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setYearOfStudy(y)}
                  className={`py-2 rounded-lg text-xs font-bold transition-all duration-150 border cursor-pointer ${
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

          {profileError && (
            <p className="text-[#F64932] text-xs font-medium bg-[#FEF3F1] border border-[#F77463]/20 px-3 py-2 rounded-lg animate-fade-in">{profileError}</p>
          )}

          {isDirty && (
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#0075DE] text-white rounded-lg py-2.5 font-bold text-sm hover:bg-[#097FE8] disabled:opacity-50 transition-all duration-150 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.05)] animate-fade-in"
            >
              {saving ? 'Saving…' : saved ? (
                <span className="inline-flex items-center gap-1.5"><Check size={14} /> Saved</span>
              ) : 'Save changes'}
            </button>
          )}

          {saved && !isDirty && (
            <p className="text-center text-xs font-bold text-[#1AAE39] animate-fade-in flex items-center justify-center gap-1">
              <Check size={12} /> Changes saved successfully
            </p>
          )}
        </form>
      </div>

      {/* Section 2: Goals */}
      <div className="bg-white border border-[#E9E9E7] rounded-xl p-6 mb-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2 mb-5">
          <Target size={16} className="text-[#FF8A33]" />
          <h2 className="text-sm font-extrabold text-[#37352F]">Your Goals</h2>
          {savingGoals && (
            <div className="w-3 h-3 border-2 border-[#E9E9E7] border-t-[#0075DE] rounded-full animate-spin ml-2" />
          )}
        </div>

        {/* Goal Pills */}
        {goals.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {goals.map((g) => (
              <span
                key={g}
                className="inline-flex items-center gap-1.5 bg-[#E6F3FE] text-[#0075DE] text-xs font-bold px-3 py-1.5 rounded-full border border-[#D3E5EF] animate-fade-in"
              >
                {g}
                <button
                  onClick={() => removeGoal(g)}
                  className="text-[#62AEF0] hover:text-[#F64932] transition-colors cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}

        {goals.length === 0 && (
          <p className="text-xs text-[#B4B4B0] font-medium mb-4">
            No goals set yet. Add goals to help your mentor guide you better.
          </p>
        )}

        {/* Add Goal Input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add a new goal…"
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal())}
            className="flex-1 border border-[#E9E9E7] rounded-lg px-3 py-2 text-xs bg-white text-[#000000] placeholder:text-[#B4B4B0] focus:outline-none focus:ring-2 focus:ring-[#0075DE]/20 focus:border-[#0075DE] transition-all duration-200"
          />
          <button
            onClick={addGoal}
            disabled={!goalInput.trim()}
            className="inline-flex items-center gap-1 px-3 py-2 border border-[#E9E9E7] bg-[#F6F5F4] text-[#37352F] rounded-lg text-xs font-bold hover:bg-[#EFEEEC] disabled:opacity-40 transition-all cursor-pointer"
          >
            <Plus size={12} /> Add
          </button>
        </div>
      </div>

      {/* Section 3: Account & Security */}
      <div className="bg-white border border-[#E9E9E7] rounded-xl p-6 mb-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2 mb-5">
          <Shield size={16} className="text-[#AD6DED]" />
          <h2 className="text-sm font-extrabold text-[#37352F]">Account & Security</h2>
        </div>

        <form onSubmit={handleChangePassword} className="flex flex-col gap-3">
          <div>
            <label className="block text-[10px] font-bold text-[#B4B4B0] uppercase tracking-wider mb-1.5">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-[#E9E9E7] rounded-lg px-3.5 py-2.5 text-sm bg-white text-[#000000] placeholder:text-[#B4B4B0] focus:outline-none focus:ring-2 focus:ring-[#0075DE]/20 focus:border-[#0075DE] transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#B4B4B0] uppercase tracking-wider mb-1.5">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              minLength={8}
              className="w-full border border-[#E9E9E7] rounded-lg px-3.5 py-2.5 text-sm bg-white text-[#000000] placeholder:text-[#B4B4B0] focus:outline-none focus:ring-2 focus:ring-[#0075DE]/20 focus:border-[#0075DE] transition-all duration-200"
            />
            <span className="block text-[10px] text-[#787774] mt-1 font-medium">Must be at least 8 characters.</span>
          </div>

          {passwordError && (
            <p className="text-[#F64932] text-xs font-medium bg-[#FEF3F1] border border-[#F77463]/20 px-3 py-2 rounded-lg animate-fade-in">{passwordError}</p>
          )}

          {passwordSuccess && (
            <p className="text-xs font-bold text-[#1AAE39] flex items-center gap-1 animate-fade-in">
              <Check size={12} /> Password updated successfully
            </p>
          )}

          <button
            type="submit"
            disabled={passwordSaving || !currentPassword || !newPassword}
            className="w-full border border-[#E9E9E7] text-[#37352F] rounded-lg py-2.5 font-bold text-sm hover:bg-[#F6F5F4] disabled:opacity-40 transition-all duration-150 cursor-pointer"
          >
            {passwordSaving ? 'Updating…' : 'Update password'}
          </button>
        </form>

        {/* Logout */}
        <div className="mt-6 pt-5 border-t border-[#E9E9E7]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 border border-[#E9E9E7] text-[#F64932] rounded-lg py-2.5 font-bold text-sm hover:bg-[#FEF3F1] hover:border-[#F77463]/30 transition-all duration-150 cursor-pointer"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
