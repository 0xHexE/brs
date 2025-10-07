'use client';

import { type ReactNode, useState } from 'react';
import { authClient } from '@/app/lib/auth-client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

interface ForgotPasswordDialogProps {
  children: ReactNode;
}

export function ForgotPasswordDialog({ children }: ForgotPasswordDialogProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [fieldError, setFieldError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    setError('');
    setFieldError('');
    setSuccess(false);

    try {
      const result = await authClient.forgetPassword({
        email,
        redirectTo: '/reset-password',
      });

      if (result.error) {
        if (result.error.code === 'INVALID_EMAIL') {
          setFieldError(result.error.message ?? 'Invalid Email');
        } else {
          setError(result.error.message || 'Failed to send reset email');
        }
      } else {
        setSuccess(true);
        setEmail('');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Forgot your password?</DialogTitle>
          <DialogDescription>
            Enter your email address and we'll send you a link to reset your
            password.
          </DialogDescription>
        </DialogHeader>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field data-invalid={!!fieldError}>
              <FieldLabel htmlFor="reset-email">Email</FieldLabel>
              <Input
                id="reset-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setFieldError('');
                }}
                aria-invalid={!!fieldError}
                autoFocus
                required
              />
              <FieldError>{fieldError}</FieldError>
            </Field>

            {error && (
              <FieldDescription className="text-red-500">
                {error}
              </FieldDescription>
            )}

            <div className="flex gap-3">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="flex-1">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="text-green-600 mb-2">✓ Reset link sent!</div>
              <FieldDescription>
                We've sent a password reset link to your email address. Please
                check your inbox and follow the instructions.
              </FieldDescription>
            </div>
            <DialogClose asChild>
              <Button
                type="button"
                className="w-full"
                onClick={() => setSuccess(false)}
              >
                Got it
              </Button>
            </DialogClose>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
