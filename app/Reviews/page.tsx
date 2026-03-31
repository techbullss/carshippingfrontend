import { Suspense } from "react";
import ReviewsClient from "../components/ReviewsClient";


export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReviewsClient />
    </Suspense>
  );
}