import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const CATEGORIES = ["audio", "footwear", "watches", "skincare"];

const toFormValues = (product) => ({
  title: product?.title || "",
  description: product?.description || "",
  category: product?.category || CATEGORIES[0],
  brand: product?.brand || "",
  price: product?.price ?? "",
  discount: product?.discount ?? "",
  rating: product?.rating ?? "",
  badge: product?.badge || "",
  image: product?.image || "",
  galleryImages: product?.galleryImages?.length ? product.galleryImages : [],
  inStock: product?.inStock ?? true,
  tags: (product?.tags || []).join(", "),
  stripePriceId: product?.stripePriceId || "",
  stripeProductId: product?.stripeProductId || "",
});

export default function ProductForm({ initialValues, onSubmit, onCancel, isSubmitting }) {
  const [form, setForm] = useState(() => toFormValues(initialValues));

  const update = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const updateGalleryImage = (index, value) => {
    setForm((prev) => {
      const next = [...prev.galleryImages];
      next[index] = value;
      return { ...prev, galleryImages: next };
    });
  };

  const addGalleryImage = () => {
    setForm((prev) => ({ ...prev, galleryImages: [...prev.galleryImages, ""] }));
  };

  const removeGalleryImage = (index) => {
    setForm((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      price: Number(form.price) || 0,
      discount: Number(form.discount) || 0,
      rating: Number(form.rating) || 0,
      tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      galleryImages: form.galleryImages.map((url) => url.trim()).filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-4">
      <div className="space-y-1.5">
        <Label htmlFor="product-title">Title</Label>
        <Input id="product-title" value={form.title} onChange={update("title")} required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="product-description">Description</Label>
        <Textarea id="product-description" value={form.description} onChange={update("description")} rows={3} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="product-category">Category</Label>
          <select
            id="product-category"
            value={form.category}
            onChange={update("category")}
            className={cn(
              "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
            )}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category} className="bg-background text-foreground">
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="product-brand">Brand</Label>
          <Input id="product-brand" value={form.brand} onChange={update("brand")} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="product-badge">Badge</Label>
          <Input id="product-badge" value={form.badge} onChange={update("badge")} placeholder="Best Seller" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="space-y-1.5">
          <Label htmlFor="product-price">Price ($)</Label>
          <Input id="product-price" type="number" step="0.01" value={form.price} onChange={update("price")} required />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="product-discount">Discount (%)</Label>
          <Input id="product-discount" type="number" value={form.discount} onChange={update("discount")} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="product-rating">Rating</Label>
          <Input id="product-rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={update("rating")} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="product-stock">In stock</Label>
          <div className="flex h-9 items-center">
            <Switch
              id="product-stock"
              checked={form.inStock}
              onCheckedChange={(checked) => setForm((prev) => ({ ...prev, inStock: checked }))}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="product-tags">Tags (comma separated)</Label>
          <Input id="product-tags" value={form.tags} onChange={update("tags")} placeholder="premium, travel, new" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="product-image">Image URL</Label>
          <Input id="product-image" value={form.image} onChange={update("image")} required />
        </div>
      </div>

      {form.image && (
        <img
          src={form.image}
          alt="Preview"
          className="h-28 w-28 rounded-lg border border-border/60 object-cover"
          onError={(event) => {
            event.currentTarget.style.visibility = "hidden";
          }}
          onLoad={(event) => {
            event.currentTarget.style.visibility = "visible";
          }}
        />
      )}

      <div className="space-y-2">
        <Label>Gallery images</Label>
        <div className="space-y-2">
          {form.galleryImages.map((url, index) => (
            <div key={index} className="flex items-center gap-2">
              <img
                src={url}
                alt=""
                className="h-10 w-10 shrink-0 rounded-md border border-border/60 object-cover"
                onError={(event) => {
                  event.currentTarget.style.visibility = "hidden";
                }}
                onLoad={(event) => {
                  event.currentTarget.style.visibility = "visible";
                }}
              />
              <Input
                value={url}
                onChange={(event) => updateGalleryImage(index, event.target.value)}
                placeholder="https://..."
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                aria-label="Remove image"
                onClick={() => removeGalleryImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addGalleryImage}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add image
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="product-stripe-price">Stripe Price ID</Label>
          <Input id="product-stripe-price" value={form.stripePriceId} onChange={update("stripePriceId")} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="product-stripe-product">Stripe Product ID</Label>
          <Input id="product-stripe-product" value={form.stripeProductId} onChange={update("stripeProductId")} />
        </div>
      </div>

      </div>

      <div className="flex justify-end gap-2 border-t border-border/60 px-6 py-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save product"}
        </Button>
      </div>
    </form>
  );
}
