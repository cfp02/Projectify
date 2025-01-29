'use client'

import { TopBar } from '@/components/TopBar'
import { ProjectSidebar } from '@/components/ProjectSidebar'
import { useParams } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const projectId = params.id as string
  const { currentTheme } = useTheme()

  return (
    <div style={{ backgroundColor: currentTheme.colors.background }}>
      <TopBar />
      <ProjectSidebar currentProjectId={projectId} />
      <div className="min-h-screen pt-16 pl-64">
        {children}
      </div>
    </div>
  )
} 