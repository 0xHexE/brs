'use client';

import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';

interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  fullName?: string;
  role?: string;
}

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      try {
        const { data: session } = await authClient.getSession();
        if (session?.user) {
          setUser({
            email: session.user.email,
            fullName: session.user.name,
            id: session.user.id,
            image: session.user.image ?? undefined,
            name: session.user.name,
          });
        }
      } catch (error) {
        console.error('Failed to get user session:', error);
      } finally {
        setLoading(false);
      }
    }

    getUser();
  }, []);

  return { user, loading };
}
