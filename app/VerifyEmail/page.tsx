'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import VerificationSuccess from '../components/VerificationSuccess';

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'verify' | 'resend'>('verify');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  
  // Get email from URL query parameter when component mounts
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    } else {
      // If no email in URL, you might want to redirect or show an error
      setError('No email address provided. Please go back to registration.');
    }
  }, [searchParams]);
  
  if (verificationSuccess) {
    return <VerificationSuccess />;
  }
  
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch(`https://api.f-carshipping.com/api/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(errorData || 'Invalid or expired code.');
      }

      setMessage(' Email verified successfully!');
      setVerificationSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch(`https://api.f-carshipping.com/api/auth/resend-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(errorData || 'Failed to resend code.');
      }

      setMessage(' Verification code resent! Please check your email.');
      setStep('verify');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <Card className="max-w-md w-full shadow-lg">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-center mb-2">Email Verification</h2>
          <p className="text-gray-600 text-center mb-6">
            {step === 'verify'
              ? `A verification code has been sent to ${email}`
              : 'Resend verification code to your email.'}
          </p>

          {step === 'verify' ? (
            <form onSubmit={handleVerify} className="space-y-4">
              {/* Display email as read-only */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  disabled
                  className="w-full bg-gray-100 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Verification code sent to this email
                </p>
              </div>

              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Code
                </label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="w-full"
                  maxLength={6}
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {message && <p className="text-green-600 text-sm">{message}</p>}

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !code}
              >
                {loading ? (
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                ) : (
                  'Verify Code'
                )}
              </Button>

              <p className="text-center text-sm mt-3">
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={() => setStep('resend')}
                  className="text-blue-600 hover:underline"
                >
                  Resend
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleResend} className="space-y-4">
              {/* Display email as read-only for resend as well */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  disabled
                  className="w-full bg-gray-100 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Code will be sent to this email
                </p>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {message && <p className="text-green-600 text-sm">{message}</p>}

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                ) : (
                  'Resend Code'
                )}
              </Button>

              <p className="text-center text-sm mt-3">
                Already have a code?{' '}
                <button
                  type="button"
                  onClick={() => setStep('verify')}
                  className="text-blue-600 hover:underline"
                >
                  Verify here
                </button>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}