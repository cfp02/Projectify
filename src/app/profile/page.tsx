'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'
import { ThemeSelector } from '@/components/ThemeSelector'
import Image from 'next/image'
import Link from 'next/link'

export default function ProfilePage() {
  const { currentTheme } = useTheme()
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  if (status === 'loading' || !session?.user) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: currentTheme.colors.background }}>
        <div className="animate-pulse" style={{ color: currentTheme.colors.primary }}>Loading...</div>
      </div>
    )
  }

  const { user } = session

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' });
  };

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: currentTheme.colors.background }}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: currentTheme.colors.primary }}>
            Profile Settings
          </h1>
          <p style={{ color: currentTheme.colors.text.secondary }}>
            Manage your account preferences and settings
          </p>
        </div>

        <div className="space-y-6">
          {/* User Info Section */}
          <div 
            className="p-6 rounded-xl"
            style={{ 
              backgroundColor: currentTheme.colors.cardBackground,
              boxShadow: `0 0 0 1px ${currentTheme.colors.border.default}`,
            }}
          >
            <h2 className="text-xl font-semibold mb-4" style={{ color: currentTheme.colors.primary }}>
              User Information
            </h2>
            <div className="flex items-center gap-4">
              {user.image && (
                <Image
                  src={user.image}
                  alt={user.name || 'User avatar'}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              )}
              <div>
                <div className="font-medium" style={{ color: currentTheme.colors.text.primary }}>
                  {user.name}
                </div>
                <div style={{ color: currentTheme.colors.text.secondary }}>
                  {user.email}
                </div>
              </div>
            </div>
          </div>

          {/* Theme Settings */}
          <div 
            className="p-6 rounded-xl"
            style={{ 
              backgroundColor: currentTheme.colors.cardBackground,
              boxShadow: `0 0 0 1px ${currentTheme.colors.border.default}`,
            }}
          >
            <h2 className="text-xl font-semibold mb-4" style={{ color: currentTheme.colors.primary }}>
              Theme Preferences
            </h2>
            <div className="flex items-center gap-4">
              <ThemeSelector />
              <p style={{ color: currentTheme.colors.text.secondary }}>
                Choose your preferred color theme
              </p>
            </div>
          </div>

          {/* Account Settings */}
          <div 
            className="p-6 rounded-xl"
            style={{ 
              backgroundColor: currentTheme.colors.cardBackground,
              boxShadow: `0 0 0 1px ${currentTheme.colors.border.default}`,
            }}
          >
            <h2 className="text-xl font-semibold mb-4" style={{ color: currentTheme.colors.primary }}>
              Account Settings
            </h2>
            <div className="space-y-4">
              <button
                onClick={handleSignOut}
                className="inline-block px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                style={{
                  backgroundColor: currentTheme.colors.status.inactive.background,
                  color: currentTheme.colors.status.inactive.text,
                  border: `1px solid ${currentTheme.colors.border.default}`,
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 