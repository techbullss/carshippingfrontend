"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import MotorcycleCard from "@/app/components/MotorcycleCard";
import AddMotorcycleForm from "@/app/components/AddMotorcycleForm";

export default function MotorcyclePage() {
  const [motorcycles, setMotorcycles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [selected, setSelected] = useState<any | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const fetchList = async () => {
    setLoading(true);
    try {
      const params: string[] = [];
      if (search) params.push(`search=${encodeURIComponent(search)}`);
      if (filterType) params.push(`type=${encodeURIComponent(filterType)}`);
      if (filterStatus) params.push(`status=${encodeURIComponent(filterStatus)}`);
      const q = params.length ? `?${params.join("&")}` : "";
      const res = await fetch(`https://carshipping.duckdns.org:8443/api/motorcycles${q}`, { credentials: 'include' , method: 'GET',headers: { 'Content-Type': 'application/json' } });
      const data = await res.json();
      setMotorcycles(Array.isArray(data.content) ? data.content : []);
    } catch (e) {
      console.error(e);
      setMotorcycles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [search, filterType, filterStatus]);

  const handleDelete = async (m: any) => {
    if (!confirm("Delete this motorcycle?")) return;
    await fetch(`https://carshipping.duckdns.org:8443/api/motorcycles/${m.id}`, { method: "DELETE", credentials: 'include' });
    fetchList();
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Motorcycles</h1>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <input
            placeholder="Search brand or model..."
            className="border p-2 rounded-md w-full md:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="border p-2 rounded-md" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">All types</option>
            <option>Sport</option>
            <option>Cruiser</option>
            <option>Dirt</option>
            <option>Touring</option>
            <option>Standard</option>
          </select>
          <select className="border p-2 rounded-md" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All status</option>
            <option>Available</option>
            <option>Sold</option>
            <option>Reserved</option>
          </select>

          <button onClick={() => { setEditing(null); setFormOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">Loading…</div>
      ) : motorcycles.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No motorcycles found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {motorcycles.map((m) => (
            <MotorcycleCard
              key={m.id}
              m={m}
              onEdit={(x) => { setEditing(x); setFormOpen(true); }}
              onDelete={(x) => handleDelete(x)}
              onDetails={(x) => { setSelected(x); setDrawerOpen(true); }}
            />
          ))}
        </div>
      )}

      {/* Drawer details */}
      {drawerOpen && selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="relative w-full sm:w-[420px] md:w-[520px] lg:w-[640px] bg-white shadow-2xl h-full overflow-y-auto"
          >
            <div className="sticky top-0 z-20 bg-white border-b p-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{selected.brand} {selected.model}</h2>
                <div className="text-sm text-gray-500">{selected.type} • {selected.engineCapacity} cc</div>
              </div>
              <button className="p-2 rounded-full hover:bg-gray-100" onClick={() => setDrawerOpen(false)}>
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-2xl font-semibold text-blue-600">KES {selected.price?.toLocaleString()}</div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Status</div>
                  <div className={`font-medium ${selected.status === "Available" ? "text-green-600" : "text-red-600"}`}>{selected.status}</div>
                </div>
                <div>
                  <div className="text-gray-500">Location</div>
                  <div className="font-medium">{selected.location || "—"}</div>
                </div>
                <div>
                  <div className="text-gray-500">Owner</div>
                  <div className="font-medium">{selected.owner || "—"}</div>
                </div>
                <div>
                  <div className="text-gray-500">Created</div>
                  <div className="font-medium">{selected.createdAt ? new Date(selected.createdAt).toLocaleString() : "—"}</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-gray-700">{selected.description || "No description provided."}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Images</h3>
                {selected.imageUrls?.length ? (
                  <div className="grid grid-cols-2 gap-3">
                    {selected.imageUrls.map((img: string, idx: number) => (
                      <div key={idx} className="relative overflow-hidden rounded-lg border">
                        <img src={img} alt={`moto-${idx}`} className="w-full h-40 object-cover transform hover:scale-105 transition" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 italic">No images available.</div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <AddMotorcycleForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={() => { setFormOpen(false); fetchList(); }}
        motorcycleToEdit={editing}
      />
    </div>
  );
}
