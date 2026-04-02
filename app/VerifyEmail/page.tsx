import { Suspense } from 'react';
import VerifyEmailContent from '../components/VerifyEmailContent';


export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}