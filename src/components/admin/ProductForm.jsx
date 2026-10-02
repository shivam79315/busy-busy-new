import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { buildSkuCombinations, PRODUCT_CATEGORIES } from "@/lib/productSchema";
import { cn } from "@/lib/utils";

const toFormValues = (product) => ({
  title: product?.title || "",
  description: product?.description || "",
  category: product?.category || PRODUCT_CATEGORIES[0],
  brand: product?.brand || "",
  price: product?.price ?? "",
  discount: product?.discount ?? "",
  rating: product?.rating ?? "",
  badge: product?.badge || "",
  image: product?.image || "",
  galleryImages: product?.galleryImages?.length ? product.galleryImages : [],
  tags: (product?.tags || []).join(", "),
  stripePriceId: product?.stripePriceId || "",
  stripeProductId: product?.stripeProductId || "",
});

const toSkuStocks = (skus) =>
  Object.fromEntries(
    (skus || []).map((sku) => [sku.id, { stock: sku.stock ?? 0, inventoryPolicy: sku.inventoryPolicy || "deny" }])
  );

export default function ProductForm({ initialValues, initialSkus, onSubmit, onCancel, isSubmitting }) {
  const [form, setForm] = useState(() => toFormValues(initialValues));
  const [variants, setVariants] = useState(() => initialValues?.variants || []);
  const [skuStocks, setSkuStocks] = useState(() => toSkuStocks(initialSkus));

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

  const addVariantGroup = () => setVariants((prev) => [...prev, { name: "", options: [] }]);

  const removeVariantGroup = (groupIndex) =>
    setVariants((prev) => prev.filter((_, i) => i !== groupIndex));

  const renameVariantGroup = (groupIndex, name) =>
    setVariants((prev) => prev.map((group, i) => (i === groupIndex ? { ...group, name } : group)));

  const addVariantOption = (groupIndex, rawValue) => {
    const value = rawValue.trim();
    if (!value) return;
    setVariants((prev) =>
      prev.map((group, i) =>
        i === groupIndex && !group.options.includes(value)
          ? { ...group, options: [...group.options, value] }
          : group
      )
    );
  };

  const removeVariantOption = (groupIndex, option) =>
    setVariants((prev) =>
      prev.map((group, i) =>
        i === groupIndex ? { ...group, options: group.options.filter((o) => o !== option) } : group
      )
    );

  const updateSkuField = (skuId, field, value) =>
    setSkuStocks((prev) => ({
      ...prev,
      [skuId]: { stock: 0, inventoryPolicy: "deny", ...prev[skuId], [field]: value },
    }));

  const skuCombinations = buildSkuCombinations(variants);
  const groupNames = variants.filter((group) => group.name && group.options.length).map((group) => group.name);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      price: Number(form.price) || 0,
      discount: Number(form.discount) || 0,
      rating: Number(form.rating) || 0,
      tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      galleryImages: form.galleryImages.map((url) => url.trim()).filter(Boolean),
      variants: variants.filter((group) => group.name && group.options.length),
      skus: skuCombinations.map((combo) => ({
        id: combo.id,
        optionValues: combo.optionValues,
        stock: Number((skuStocks[combo.id] || {}).stock) || 0,
        inventoryPolicy: (skuStocks[combo.id] || {}).inventoryPolicy || "deny",
      })),
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
            {PRODUCT_CATEGORIES.map((category) => (
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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

      <div className="space-y-3 rounded-lg border border-border/60 p-4">
        <div className="flex items-center justify-between">
          <Label>Variants</Label>
          <Button type="button" variant="outline" size="sm" onClick={addVariantGroup}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add variant group
          </Button>
        </div>

        {variants.length === 0 && (
          <p className="text-xs text-muted-foreground">
            No variant groups — this product has a single default stock count below.
          </p>
        )}

        {variants.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-2 rounded-md border border-border/60 p-3">
            <div className="flex items-center gap-2">
              <Input
                value={group.name}
                onChange={(event) => renameVariantGroup(groupIndex, event.target.value)}
                placeholder="Group name, e.g. Color"
                className="h-8"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                aria-label="Remove variant group"
                onClick={() => removeVariantGroup(groupIndex)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {group.options.map((option) => (
                <span
                  key={option}
                  className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground"
                >
                  {option}
                  <button
                    type="button"
                    aria-label={`Remove ${option}`}
                    onClick={() => removeVariantOption(groupIndex, option)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder="Add value, press Enter"
                className="h-7 w-36 rounded-full border border-dashed border-input bg-transparent px-2.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addVariantOption(groupIndex, event.currentTarget.value);
                    event.currentTarget.value = "";
                  }
                }}
              />
            </div>
          </div>
        ))}

        <div className="space-y-2">
          <Label>Stock per variant</Label>
          <div className="overflow-x-auto rounded-md border border-border/60">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left text-xs text-muted-foreground">
                  {groupNames.map((name) => (
                    <th key={name} className="p-2 font-medium">{name}</th>
                  ))}
                  <th className="p-2 font-medium">Stock</th>
                  <th className="p-2 font-medium">If out of stock</th>
                </tr>
              </thead>
              <tbody>
                {skuCombinations.map((combo) => {
                  const current = skuStocks[combo.id] || { stock: 0, inventoryPolicy: "deny" };
                  return (
                    <tr key={combo.id} className="border-b border-border/60 last:border-0">
                      {groupNames.map((name) => (
                        <td key={name} className="p-2">{combo.optionValues[name] || "—"}</td>
                      ))}
                      <td className="p-2">
                        <Input
                          type="number"
                          min="0"
                          className="h-8 w-20"
                          value={current.stock}
                          onChange={(event) => updateSkuField(combo.id, "stock", event.target.value)}
                        />
                      </td>
                      <td className="p-2">
                        <select
                          value={current.inventoryPolicy}
                          onChange={(event) => updateSkuField(combo.id, "inventoryPolicy", event.target.value)}
                          className="h-8 rounded-md border border-input bg-transparent px-2 text-xs"
                        >
                          <option value="deny" className="bg-background">Stop selling</option>
                          <option value="continue" className="bg-background">Allow backorder</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
