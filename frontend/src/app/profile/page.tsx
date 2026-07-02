'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getMe, logout, type User } from '@/services/auth.service'
import { updateProfile } from '@/services/users.service'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [name, setName] = useState('')
  const [university, setUniversity] = useState('')
  const [courseOfStudy, setCourseOfStudy] = useState('')
  const [yearOfStudy, setYearOfStudy] = useState(1)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getMe()
      .then((u) => {
        setUser(u)
        setName(u.name)
        setUniversity(u.university)
        setCourseOfStudy(u.courseOfStudy)
        setYearOfStudy(u.yearOfStudy)
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false))
  }, [router])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const updated = await updateProfile({ name, university, courseOfStudy, yearOfStudy })
      setUser(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  function handleLogout() {
    logout()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center gap-2 text-[#B4B4B0] text-sm">
        <div className="w-4 h-4 border-2 border-[#E9E9E7] border-t-[#0075DE] rounded-full animate-spin" />
        Loading…
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
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-xl font-bold text-[#000000] mb-6">Profile</h1>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-full bg-[#0075DE] text-white flex items-center justify-center font-bold text-lg">
          {initials}
        </div>
        <div>
          <p className="font-semibold text-[#000000]">{user.name}</p>
          <p className="text-sm text-[#787774]">{user.email}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-[#37352F] mb-1.5">Full name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-[#E9E9E7] rounded-lg px-3 py-2.5 text-sm bg-white text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#0075DE] focus:border-[#0075DE] transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#37352F] mb-1.5">Email</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full border border-[#E9E9E7] rounded-lg px-3 py-2.5 text-sm bg-[#F6F5F4] text-[#B4B4B0] cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#37352F] mb-1.5">University</label>
          <input
            type="text"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            className="w-full border border-[#E9E9E7] rounded-lg px-3 py-2.5 text-sm bg-white text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#0075DE] focus:border-[#0075DE] transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#37352F] mb-1.5">Course of study</label>
          <input
            type="text"
            value={courseOfStudy}
            onChange={(e) => setCourseOfStudy(e.target.value)}
            className="w-full border border-[#E9E9E7] rounded-lg px-3 py-2.5 text-sm bg-white text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#0075DE] focus:border-[#0075DE] transition-all duration-200"
          />
        </div>
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

        <button
          type="submit"
          disabled={saving}
          className="bg-[#0075DE] text-white rounded-lg py-2.5 font-semibold text-sm hover:bg-[#097FE8] disabled:opacity-50 transition-all duration-200 cursor-pointer"
        >
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save changes'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-[#E9E9E7]">
        <button
          onClick={handleLogout}
          className="w-full text-sm text-[#F64932] font-semibold hover:text-[#D93B27] transition-colors cursor-pointer"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
