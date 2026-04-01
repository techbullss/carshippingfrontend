import ReviewsClient from "@/app/components/ReviewsClient";
import { Suspense } from "react";


interface PageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function ReviewTokenPage({ params }: PageProps) {
  const { token } = await params;
  
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <ReviewsClient token={token} />
    </Suspense>
  );
}