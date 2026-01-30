export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Loading */}
      <div className="sticky top-0 bg-white shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
          <div className="flex gap-2">
            <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
          </div>
        </div>
      </div>
      
      {/* Content Loading */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-md p-4">
            <div className="h-48 bg-gray-200 rounded-xl mb-4 animate-pulse"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}