"use client";
import MotorcycleListing from "../components/MotorcycleListing";

export default function MotorcyclePage() {
  // Only renders the client component inside a <Suspense>
  return (
    <div>
    <MotorcycleListing />
    </div>
  );
}
