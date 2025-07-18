'use client';

import React from 'react';
import { Button } from '@/registry/new-york-v4/ui/button';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, subtitle }) => {
  const { logout } = useAuth();
  const router = useRouter();
  
  const handleLogout = () => {
    logout();
    router.push('/');
  };
  
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-gray-600">{subtitle}</p>
      </div>
      <Button variant="outline" onClick={handleLogout}>
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </div>
  );
};
