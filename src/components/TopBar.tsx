'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { ThemeSelector } from './ThemeSelector'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'

export function TopBar() {
  const { currentTheme } = useTheme()
  const { data: session } = useSession()

  return (
    <div 
      className="fixed top-0 left-0 right-0 h-16 z-50 px-4"
      style={{ 
        backgroundColor: currentTheme.colors.cardBackground,
        borderBottom: `1px solid ${currentTheme.colors.border.default}`,
      }}
    >
      <div className="h-full max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link 
            href="/" 
            className="text-xl font-bold"
            style={{ color: currentTheme.colors.primary }}
          >
            Projectify
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/projects"
              className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              style={{ color: currentTheme.colors.text.primary }}
            >
              Projects
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeSelector />
          {session?.user && (
            <Link
              href="/profile"
              className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200 hover:bg-black/5"
            >
              <span style={{ color: currentTheme.colors.text.secondary }}>
                {session.user.name}
              </span>
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name || 'User avatar'}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
} 