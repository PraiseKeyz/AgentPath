import Link from 'next/link'
import React from 'react'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">AgentPath</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-xl">
        Your AI mentor for navigating university opportunities. Built for first-generation Nigerian students.
      </p>
      <div className="flex gap-4">
        <Link
          href="/auth/register"
          className="px-6 py-3 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-800 transition-colors"
        >
          Get Started
        </Link>
        <Link
          href="/auth/login"
          className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Sign In
        </Link>
      </div>
    </main>
  )
}
