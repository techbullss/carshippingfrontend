import ContainerListing from "../components/ContainerListing";
export const dynamic = "force-dynamic"; // keep dynamic fetch if needed

export default function VehiclesPage() {
  // Only renders the client component inside a <Suspense>
  return (
    <div>
      <ContainerListing />
    </div>
  );
}
