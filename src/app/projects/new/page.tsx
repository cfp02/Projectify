'use client'

import { ProjectForm } from '@/components/ProjectForm'
import { redirect } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTheme } from '@/contexts/ThemeContext'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NewProjectPage() {
  const { currentTheme } = useTheme()
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: currentTheme.colors.background }}>
        <div className="animate-pulse" style={{ color: currentTheme.colors.primary }}>Loading...</div>
      </div>
    )
  }

  async function createProject(data: {
    title: string
    subtitle: string
    description: string
    tags: string[]
  }) {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to create project')
      }

      router.push('/projects')
    } catch (error) {
      console.error('Failed to create project:', error)
      // You might want to show an error message to the user here
    }
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: currentTheme.colors.background }}>
      <div className="container mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold" style={{ color: currentTheme.colors.primary }}>Create New Project</h1>
        <ProjectForm onSubmit={createProject} />
      </div>
    </div>
  )
} 