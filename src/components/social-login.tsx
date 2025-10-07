'use client';

import { authClient } from '@/app/lib/auth-client';

export function SocialLogin() {
  const signInWithGoogle = async () => {
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/dashboard',
      });
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  const signInWithApple = async () => {
    try {
      await authClient.signIn.social({
        provider: 'apple',
        callbackURL: '/dashboard',
      });
    } catch (error) {
      console.error('Apple sign-in error:', error);
    }
  };

  const signInWithMeta = async () => {
    try {
      await authClient.signIn.social({
        provider: 'facebook',
        callbackURL: '/dashboard',
      });
    } catch (error) {
      console.error('Meta sign-in error:', error);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={signInWithGoogle}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Sign in with Google
      </button>
      
      <button
        onClick={signInWithApple}
        className="w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
      >
        Sign in with Apple
      </button>
      
      <button
        onClick={signInWithMeta}
        className="w-full py-2 px-4 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
      >
        Sign in with Meta
      </button>
    </div>
  );
}