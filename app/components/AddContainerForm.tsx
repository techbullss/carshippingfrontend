"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AddContainerForm({
  open,
  onClose,
  onSuccess,
  containerToEdit,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  containerToEdit?: any | null;
}) {
  const [form, setForm] = useState({
    containerNumber: "",
    size: "",
    type: "",
    price: "",
    status: "Available",
  });
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (containerToEdit) {
      setForm({
        containerNumber: containerToEdit.containerNumber,
        size: containerToEdit.size,
        type: containerToEdit.type,
        price: containerToEdit.price,
        status: containerToEdit.status,
      });
      setPreviews(containerToEdit.imageUrls || []);
    } else {
      setForm({
        containerNumber: "",
        size: "",
        type: "",
        price: "",
        status: "Available",
      });
      setPreviews([]);
    }
    setImages([]);
  }, [containerToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      // Append instead of replacing
      setImages((prev) => [...prev, ...files]);
      setPreviews((prev) => [
        ...prev,
        ...files.map((f) => URL.createObjectURL(f)),
      ]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    images.forEach((img) => fd.append("images", img));

    await fetch(
      containerToEdit
        ? `https://carshipping.duckdns.org:8443/api/containers/${containerToEdit.id}`
        : "https://carshipping.duckdns.org:8443/api/containers",
      {
        method: containerToEdit ? "PUT" : "POST",
        credentials: 'include',
        body: fd,
      }
    );

    onSuccess();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {containerToEdit ? "Edit Container" : "Add Container"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="containerNumber"
            placeholder="Container Number"
            value={form.containerNumber}
            onChange={handleChange}
            required
          />
          <Input
            name="size"
            placeholder="Size (20ft, 40ft)"
            value={form.size}
            onChange={handleChange}
            required
          />
          <Input
            name="type"
            placeholder="Type (Dry, Reefer)"
            value={form.type}
            onChange={handleChange}
            required
          />
          <Input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
          />
          <Input
            name="status"
            placeholder="Status"
            value={form.status}
            onChange={handleChange}
          />

          {/* Image Upload */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Upload Images
            </label>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
            <div className="flex gap-2 mt-2 flex-wrap">
              {previews.map((src, i) => (
                <div key={i} className="relative">
                  <img
                    src={src}
                    alt="preview"
                    className="w-20 h-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full">
            {containerToEdit ? "Update" : "Save"} Container
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
