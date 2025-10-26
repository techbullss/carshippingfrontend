'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ResetPasswordForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setMessage("Passwords don't match");
      return;
    }

    const res = await fetch('https://api.f-carshipping.com/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });

    const text = await res.text();
    setMessage(text);

    if (res.ok) {
      setTimeout(() => router.push('/Login'), 2000);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg p-8 rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 border rounded-lg mb-4"
        />

        <input
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          className="w-full p-3 border rounded-lg mb-4"
        />

        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition"
        >
          Reset Password
        </button>

        {message && <p className="text-center mt-4 text-sm text-gray-700">{message}</p>}
      </form>
    </div>
  );
}
