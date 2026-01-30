
import { Suspense } from "react";
import MotorcycleListing from "../components/MotorcycleListing";
import Loading from "../components/Loading";

export default function MotorcyclePage() {
  // Only renders the client component inside a <Suspense>
  return (
    <div>
        <Suspense fallback={<Loading />}>
      <MotorcycleListing />
    </Suspense>
    </div>
  );
}
