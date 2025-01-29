import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProjectForm } from './ProjectForm'
import { ThemeProvider } from '@/contexts/ThemeContext'

describe('ProjectForm', () => {
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  it('renders empty form correctly', () => {
    render(
      <ThemeProvider>
        <ProjectForm onSubmit={mockOnSubmit} />
      </ThemeProvider>
    )

    expect(screen.getByLabelText('Project Title')).toBeInTheDocument()
    expect(screen.getByLabelText('Subtitle')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    expect(screen.getByLabelText('Tags')).toBeInTheDocument()
    expect(screen.getByText('Create Project')).toBeInTheDocument()
  })

  it('submits form data correctly', () => {
    render(
      <ThemeProvider>
        <ProjectForm onSubmit={mockOnSubmit} />
      </ThemeProvider>
    )

    const titleInput = screen.getByLabelText('Project Title')
    const subtitleInput = screen.getByLabelText('Subtitle')
    const descriptionInput = screen.getByLabelText('Description')
    const tagInput = screen.getByLabelText('Tags')
    const addTagButton = screen.getByText('Add')
    const submitButton = screen.getByText('Create Project')

    fireEvent.change(titleInput, { target: { value: 'Test Project' } })
    fireEvent.change(subtitleInput, { target: { value: 'A test project' } })
    fireEvent.change(descriptionInput, { target: { value: 'Project description' } })
    
    // Add a tag
    fireEvent.change(tagInput, { target: { value: 'test-tag' } })
    fireEvent.click(addTagButton)

    fireEvent.submit(submitButton)

    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Test Project',
      subtitle: 'A test project',
      description: 'Project description',
      tags: ['test-tag']
    })
  })

  it('renders with initial data', () => {
    const initialData = {
      title: 'Existing Project',
      subtitle: 'An existing project',
      description: 'Existing description',
      tags: ['existing-tag']
    }

    render(
      <ThemeProvider>
        <ProjectForm onSubmit={mockOnSubmit} initialData={initialData} />
      </ThemeProvider>
    )

    expect(screen.getByLabelText('Project Title')).toHaveValue('Existing Project')
    expect(screen.getByLabelText('Subtitle')).toHaveValue('An existing project')
    expect(screen.getByLabelText('Description')).toHaveValue('Existing description')
    expect(screen.getByText('existing-tag')).toBeInTheDocument()
    expect(screen.getByText('Update Project')).toBeInTheDocument()
  })
}) 