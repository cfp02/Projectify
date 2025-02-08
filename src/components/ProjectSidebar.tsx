'use client'

import { useTheme } from '@/contexts/ThemeContext'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Project {
  id: string
  title: string
}

interface Section {
  id: string
  title: string
}

interface ProjectSidebarProps {
  currentProjectId?: string
  sections?: Section[]
}

export function ProjectSidebar({ currentProjectId, sections }: ProjectSidebarProps) {
  const { currentTheme } = useTheme()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('/api/projects')
        if (response.ok) {
          const data = await response.json()
          setProjects(data)
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return (
    <div
      className="fixed top-16 left-0 bottom-0 w-64 overflow-y-auto"
      style={{
        backgroundColor: currentTheme.colors.cardBackground,
        borderRight: `1px solid ${currentTheme.colors.border.default}`,
      }}
    >
      <div className="p-4">
        <div className="mb-6">
          <Link
            href="/projects"
            className="flex items-center gap-2 px-3 py-2 mb-4 rounded-md text-sm font-medium w-full transition-colors duration-200 hover:bg-opacity-10"
            style={{ 
              color: currentTheme.colors.primary,
              backgroundColor: `${currentTheme.colors.primary}05`,
            }}
          >
            <span>←</span>
            <span>All Projects</span>
          </Link>
          {loading ? (
            <div 
              className="animate-pulse text-sm px-2"
              style={{ color: currentTheme.colors.text.muted }}
            >
              Loading...
            </div>
          ) : (
            <nav className="space-y-1">
              {projects.map(project => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className={`block px-2 py-1.5 rounded-md text-sm transition-colors duration-200 ${
                    project.id === currentProjectId ? 'font-medium' : ''
                  }`}
                  style={{
                    backgroundColor: project.id === currentProjectId 
                      ? currentTheme.colors.primary + '10'
                      : 'transparent',
                    color: project.id === currentProjectId
                      ? currentTheme.colors.primary
                      : currentTheme.colors.text.primary,
                  }}
                >
                  {project.title}
                </Link>
              ))}
            </nav>
          )}
        </div>

        {sections && sections.length > 0 && (
          <div>
            <h2 
              className="text-sm font-semibold mb-2 px-2"
              style={{ color: currentTheme.colors.text.secondary }}
            >
              Page Outline
            </h2>
            <nav className="space-y-1">
              {sections.map(section => (
                <a
                  key={section.id}
                  href={`#section-${section.id}`}
                  className="block px-2 py-1.5 rounded-md text-sm transition-colors duration-200"
                  style={{ color: currentTheme.colors.text.primary }}
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </div>
  )
} 