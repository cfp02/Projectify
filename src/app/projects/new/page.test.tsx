import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import NewProjectPage from './page'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { getServerSession } from 'next-auth'

// Mock next-auth
jest.mock('next-auth')
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

describe('NewProjectPage', () => {
  beforeEach(() => {
    // Mock authenticated session
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { email: 'test@example.com' }
    })
  })

  it('renders the new project form', async () => {
    const page = await NewProjectPage()
    render(
      <ThemeProvider>
        {page}
      </ThemeProvider>
    )

    expect(screen.getByText('Create New Project')).toBeInTheDocument()
    expect(screen.getByLabelText('Project Title')).toBeInTheDocument()
    expect(screen.getByLabelText('Subtitle')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    expect(screen.getByLabelText('Tags')).toBeInTheDocument()
  })
}) 