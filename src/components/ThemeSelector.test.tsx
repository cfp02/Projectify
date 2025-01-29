/// <reference types="jest" />
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { ThemeSelector } from './ThemeSelector'
import { ThemeProvider } from '@/contexts/ThemeContext'

describe('ThemeSelector', () => {
  it('renders theme selector with current theme name', () => {
    render(
      <ThemeProvider>
        <ThemeSelector />
      </ThemeProvider>
    )
    
    // The default theme name should be visible
    expect(screen.getByText('Emerald Sea')).toBeInTheDocument()
  })
}) 