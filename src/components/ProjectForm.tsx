'use client'
import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

interface ProjectFormProps {
  onSubmit: (data: {
    title: string
    subtitle: string
    description: string
    tags: string[]
  }) => void
  initialData?: {
    title: string
    subtitle: string
    description: string
    tags: string[]
  }
}

export function ProjectForm({ onSubmit, initialData }: ProjectFormProps) {
  const { currentTheme } = useTheme()
  const [title, setTitle] = useState(initialData?.title || '')
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ title, subtitle, description, tags })
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium"
          style={{ color: currentTheme.colors.text.primary }}
        >
          Project Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none"
          style={{
            backgroundColor: currentTheme.colors.cardBackground,
            color: currentTheme.colors.text.primary,
            borderColor: currentTheme.colors.border.default
          }}
        />
      </div>

      <div>
        <label
          htmlFor="subtitle"
          className="block text-sm font-medium"
          style={{ color: currentTheme.colors.text.primary }}
        >
          Subtitle
        </label>
        <input
          type="text"
          id="subtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none"
          style={{
            backgroundColor: currentTheme.colors.cardBackground,
            color: currentTheme.colors.text.primary,
            borderColor: currentTheme.colors.border.default
          }}
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium"
          style={{ color: currentTheme.colors.text.primary }}
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none"
          style={{
            backgroundColor: currentTheme.colors.cardBackground,
            color: currentTheme.colors.text.primary,
            borderColor: currentTheme.colors.border.default
          }}
        />
      </div>

      <div>
        <label
          htmlFor="tags"
          className="block text-sm font-medium"
          style={{ color: currentTheme.colors.text.primary }}
        >
          Tags
        </label>
        <div className="mt-1 flex items-center gap-2">
          <input
            type="text"
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none"
            style={{
              backgroundColor: currentTheme.colors.cardBackground,
              color: currentTheme.colors.text.primary,
              borderColor: currentTheme.colors.border.default
            }}
            placeholder="Add tags..."
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="rounded px-3 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: currentTheme.colors.primary }}
          >
            Add
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full px-3 py-1 text-sm"
              style={{ backgroundColor: currentTheme.colors.secondary }}
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-2 text-white hover:text-gray-200"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="w-full rounded-md px-4 py-2 text-sm font-medium text-white"
          style={{ backgroundColor: currentTheme.colors.primary }}
        >
          {initialData ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  )
} 