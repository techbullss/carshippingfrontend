import CommercialVehicleListing from "../components/CommercialVehicleListing";
export const dynamic = "force-dynamic"; // keep dynamic fetch if needed

export default function CommercialVehiclesPage() {
  // Only renders the client component inside a <Suspense>
  return (
    <div>
      <CommercialVehicleListing />
    </div>
  );
}
