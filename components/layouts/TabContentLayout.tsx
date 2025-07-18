'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface TabContentLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full' | 'none';
  actions?: React.ReactNode;
}

/**
 * TabContentLayout - A reusable component for consistent tab content styling
 * 
 * @param children - The content to be rendered inside the layout
 * @param title - Optional title for the tab content
 * @param description - Optional description text below the title
 * @param className - Additional CSS classes to apply to the container
 * @param maxWidth - Maximum width constraint for the content (default: '6xl')
 * @param actions - Optional actions to display next to the title (buttons, etc.)
 */
export const TabContentLayout: React.FC<TabContentLayoutProps> = ({
  children,
  title,
  description,
  className,
  maxWidth = '6xl',
  actions,
}) => {
  return (
    <div className={cn(
      "w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-6",
      maxWidth !== 'none' && maxWidth !== 'full' ? `max-w-${maxWidth}` : '',
      className
    )}>
      {(title || actions) && (
        <div className="flex justify-between items-center w-full">
          <div>
            {title && <h2 className="text-2xl font-bold">{title}</h2>}
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
