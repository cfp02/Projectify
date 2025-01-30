'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export function CollapsibleSection({ title, children, defaultExpanded = true }: CollapsibleSectionProps) {
  const { currentTheme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="mb-6 rounded-lg overflow-hidden" style={{
      backgroundColor: currentTheme.colors.cardBackground,
      border: `1px solid ${currentTheme.colors.border.default}`,
    }}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex justify-between items-center"
        style={{ color: currentTheme.colors.text.primary }}
      >
        <h2 className="text-xl font-semibold" style={{ color: currentTheme.colors.primary }}>
          {title}
        </h2>
        <span className="transform transition-transform duration-200" style={{
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
        }}>
          ▼
        </span>
      </button>
      
      <div
        className="transition-all duration-200 overflow-hidden"
        style={{
          maxHeight: isExpanded ? '100000px' : '0',
          opacity: isExpanded ? 1 : 0,
        }}
      >
        <div className="px-6 pb-6">
          {children}
        </div>
      </div>
    </div>
  );
} 