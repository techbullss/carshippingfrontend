'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import VerificationSuccess from '../components/VerificationSuccess';

export default function VerifyEmail() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'verify' | 'resend'>('verify');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
const [verificationSuccess, setVerificationSuccess] = useState(false);
  
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

      if (!res.ok) throw new Error('Invalid or expired code.');

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

      if (!res.ok) throw new Error('Failed to resend code.');

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
              ? 'A verification code has been sent to your email.'
              : 'Enter your email to resend the verification code.'}
          </p>

          {step === 'verify' ? (
            <form onSubmit={handleVerify} className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Enter verification code"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />

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
                  'Verify Code'
                )}
              </Button>

              <p className="text-center text-sm mt-3">
                Didn’t receive the code?{' '}
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
              <Input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

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
