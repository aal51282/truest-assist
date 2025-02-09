'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    // Check if user is not logged in
    if (!isLoggedIn && !document.cookie.includes('token=')) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  // If not logged in, don't render anything
  if (!isLoggedIn && !document.cookie.includes('token=')) {
    return null;
  }

  // If logged in, render the protected content
  return <>{children}</>;
} 