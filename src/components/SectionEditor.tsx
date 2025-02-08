'use client'

import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

interface Section {
  id: string
  title: string
  content: string
  order: number
}

interface SectionEditorProps {
  projectId: string
  initialSections?: Section[]
  onSectionsChange?: (sections: Section[]) => void
}

export function SectionEditor({ projectId, initialSections = [], onSectionsChange }: SectionEditorProps) {
  const { currentTheme } = useTheme()
  const [sections, setSections] = useState<Section[]>(initialSections)
  const [editingSection, setEditingSection] = useState<Section | null>(null)
  const [newSectionTitle, setNewSectionTitle] = useState('')
  const [newSectionContent, setNewSectionContent] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleCreateSection = async () => {
    if (!newSectionTitle.trim() || !newSectionContent.trim()) return

    try {
      const response = await fetch(`/api/projects/${projectId}/sections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newSectionTitle,
          content: newSectionContent,
          order: sections.length,
        }),
      })

      if (!response.ok) throw new Error('Failed to create section')

      const newSection = await response.json()
      const updatedSections = [...sections, newSection]
      setSections(updatedSections)
      onSectionsChange?.(updatedSections)
      setNewSectionTitle('')
      setNewSectionContent('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleUpdateSection = async (section: Section) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/sections/${section.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: section.title,
          content: section.content,
          order: section.order,
        }),
      })

      if (!response.ok) throw new Error('Failed to update section')

      const updatedSection = await response.json()
      const updatedSections = sections.map(s => 
        s.id === updatedSection.id ? updatedSection : s
      )
      setSections(updatedSections)
      onSectionsChange?.(updatedSections)
      setEditingSection(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return

    try {
      const response = await fetch(`/api/projects/${projectId}/sections/${sectionId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete section')

      const updatedSections = sections.filter(s => s.id !== sectionId)
      setSections(updatedSections)
      onSectionsChange?.(updatedSections)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleReorderSections = async (draggedId: string, targetId: string) => {
    const draggedIndex = sections.findIndex(s => s.id === draggedId)
    const targetIndex = sections.findIndex(s => s.id === targetId)
    
    if (draggedIndex === -1 || targetIndex === -1) return

    const reorderedSections = [...sections]
    const [draggedSection] = reorderedSections.splice(draggedIndex, 1)
    reorderedSections.splice(targetIndex, 0, draggedSection)

    // Update order numbers
    const updatedSections = reorderedSections.map((section, index) => ({
      ...section,
      order: index,
    }))

    try {
      const response = await fetch(`/api/projects/${projectId}/sections/reorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sections: updatedSections }),
      })

      if (!response.ok) throw new Error('Failed to reorder sections')

      setSections(updatedSections)
      onSectionsChange?.(updatedSections)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div 
          className="p-4 rounded-lg"
          style={{ 
            backgroundColor: currentTheme.colors.status.inactive.background,
            color: currentTheme.colors.status.inactive.text,
          }}
        >
          {error}
        </div>
      )}

      {/* Section List */}
      <div className="space-y-4">
        {sections.map((section, index) => (
          <div
            key={section.id}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('text/plain', section.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              const draggedId = e.dataTransfer.getData('text/plain')
              handleReorderSections(draggedId, section.id)
            }}
            className="p-4 rounded-lg cursor-move"
            style={{
              backgroundColor: currentTheme.colors.cardBackground,
              border: `1px solid ${currentTheme.colors.border.default}`,
            }}
          >
            {editingSection?.id === section.id ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editingSection.title}
                  onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                  className="w-full p-2 rounded-lg"
                  style={{
                    backgroundColor: currentTheme.colors.background,
                    color: currentTheme.colors.text.primary,
                    border: `1px solid ${currentTheme.colors.border.default}`,
                  }}
                />
                <textarea
                  value={editingSection.content}
                  onChange={(e) => setEditingSection({ ...editingSection, content: e.target.value })}
                  rows={4}
                  className="w-full p-2 rounded-lg"
                  style={{
                    backgroundColor: currentTheme.colors.background,
                    color: currentTheme.colors.text.primary,
                    border: `1px solid ${currentTheme.colors.border.default}`,
                  }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateSection(editingSection)}
                    className="px-4 py-2 rounded-lg text-sm font-medium"
                    style={{
                      backgroundColor: currentTheme.colors.primary,
                      color: currentTheme.colors.background,
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingSection(null)}
                    className="px-4 py-2 rounded-lg text-sm font-medium"
                    style={{
                      backgroundColor: currentTheme.colors.cardBackground,
                      color: currentTheme.colors.text.primary,
                      border: `1px solid ${currentTheme.colors.border.default}`,
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium" style={{ color: currentTheme.colors.text.primary }}>
                    {section.title}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingSection(section)}
                      className="p-2 rounded-lg text-sm"
                      style={{ color: currentTheme.colors.primary }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      className="p-2 rounded-lg text-sm"
                      style={{ color: currentTheme.colors.status.inactive.text }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p style={{ color: currentTheme.colors.text.secondary }}>{section.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* New Section Form */}
      <div 
        className="p-4 rounded-lg space-y-4"
        style={{
          backgroundColor: currentTheme.colors.cardBackground,
          border: `1px solid ${currentTheme.colors.border.default}`,
        }}
      >
        <h3 className="text-lg font-medium" style={{ color: currentTheme.colors.text.primary }}>
          Add New Section
        </h3>
        <input
          type="text"
          value={newSectionTitle}
          onChange={(e) => setNewSectionTitle(e.target.value)}
          placeholder="Section Title"
          className="w-full p-2 rounded-lg"
          style={{
            backgroundColor: currentTheme.colors.background,
            color: currentTheme.colors.text.primary,
            border: `1px solid ${currentTheme.colors.border.default}`,
          }}
        />
        <textarea
          value={newSectionContent}
          onChange={(e) => setNewSectionContent(e.target.value)}
          placeholder="Section Content"
          rows={4}
          className="w-full p-2 rounded-lg"
          style={{
            backgroundColor: currentTheme.colors.background,
            color: currentTheme.colors.text.primary,
            border: `1px solid ${currentTheme.colors.border.default}`,
          }}
        />
        <button
          onClick={handleCreateSection}
          disabled={!newSectionTitle.trim() || !newSectionContent.trim()}
          className="w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          style={{
            backgroundColor: currentTheme.colors.primary,
            color: currentTheme.colors.background,
            opacity: !newSectionTitle.trim() || !newSectionContent.trim() ? 0.7 : 1,
          }}
        >
          Create Section
        </button>
      </div>
    </div>
  )
} 