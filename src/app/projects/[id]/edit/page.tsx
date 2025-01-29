'use client'

import { ProjectForm } from '@/components/ProjectForm'
import { useSession } from 'next-auth/react'
import { useTheme } from '@/contexts/ThemeContext'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  subtitle: string
  description: string
  tags: { id: string; name: string }[]
}

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const { currentTheme } = useTheme()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchProject()
    }
  }, [session, params.id])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}`)
      if (!response.ok) throw new Error('Failed to fetch project')
      const data = await response.json()
      setProject(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  async function updateProject(data: {
    title: string
    subtitle: string
    description: string
    tags: string[]
  }) {
    try {
      const response = await fetch(`/api/projects/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to update project')
      }

      router.push(`/projects/${params.id}`)
    } catch (error) {
      console.error('Failed to update project:', error)
      setError(error instanceof Error ? error.message : 'Failed to update project')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: currentTheme.colors.background }}>
        <div className="animate-pulse" style={{ color: currentTheme.colors.primary }}>Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: currentTheme.colors.background }}>
        <div className="px-4 py-2 rounded-md border" style={{
          color: currentTheme.colors.status.inactive.text,
          backgroundColor: currentTheme.colors.status.inactive.background,
          borderColor: currentTheme.colors.border.default,
        }}>
          Error: {error}
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: currentTheme.colors.background }}>
        <div style={{ color: currentTheme.colors.text.primary }}>Project not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: currentTheme.colors.background }}>
      <div className="container mx-auto max-w-2xl">
        <div className="flex justify-between items-center mb-8">
          <Link
            href={`/projects/${params.id}`}
            className="flex items-center gap-2 transition-colors duration-200"
            style={{ color: currentTheme.colors.primary }}
          >
            <span>←</span>
            <span>Back to Project</span>
          </Link>
        </div>
        <h1 className="mb-8 text-3xl font-bold" style={{ color: currentTheme.colors.primary }}>Edit Project</h1>
        <ProjectForm
          onSubmit={updateProject}
          initialData={{
            title: project.title,
            subtitle: project.subtitle,
            description: project.description,
            tags: project.tags.map(tag => tag.name)
          }}
        />
      </div>
    </div>
  )
} 