import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useProducts } from "@/hooks/useProducts";

const emptySlide = {
  productId: "",
  imageUrl: "",
  title: "",
  badge: "",
  description: "",
  active: true,
};

export default function HeroSlideForm({ initialValues, onSubmit, onCancel, isSubmitting }) {
  const [form, setForm] = useState({ ...emptySlide, ...initialValues });
  const [pickingProduct, setPickingProduct] = useState(!initialValues?.productId);
  const [search, setSearch] = useState("");
  const { data: products, isLoading: productsLoading } = useProducts();

  const filteredProducts = (products ?? []).filter((product) =>
    product.title?.toLowerCase().includes(search.toLowerCase())
  );

  const update = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const selectProduct = (product) => {
    setForm((prev) => ({
      ...prev,
      productId: product.productId,
      imageUrl: product.image,
      title: prev.title || product.title,
    }));
    setPickingProduct(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label>Product</Label>

        {!pickingProduct && form.productId && (
          <div className="flex items-center gap-3 rounded-lg border border-border/60 p-2">
            <img
              src={form.imageUrl}
              alt={form.title}
              className="h-14 w-14 rounded-md border border-border/60 object-contain bg-neutral-950"
            />
            <div className="flex-1 text-sm">
              <p className="font-medium text-foreground">{form.title}</p>
              <p className="text-muted-foreground">{form.productId}</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => setPickingProduct(true)}>
              Change product
            </Button>
          </div>
        )}

        {pickingProduct && (
          <div className="space-y-2">
            <Input
              placeholder="Search products by title..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <div className="max-h-60 overflow-y-auto rounded-lg border border-border/60">
              {productsLoading && (
                <p className="p-3 text-sm text-muted-foreground">Loading products...</p>
              )}
              {!productsLoading && filteredProducts.length === 0 && (
                <p className="p-3 text-sm text-muted-foreground">No products found.</p>
              )}
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => selectProduct(product)}
                  className="flex w-full items-center gap-3 border-b border-border/40 p-2 text-left last:border-b-0 hover:bg-accent"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-10 w-10 rounded-md border border-border/60 object-contain bg-neutral-950"
                  />
                  <div className="flex-1 text-sm">
                    <p className="font-medium text-foreground">{product.title}</p>
                    <p className="text-muted-foreground">${product.price?.toFixed(2)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="slide-title">Title</Label>
        <Input id="slide-title" value={form.title} onChange={update("title")} required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="slide-badge">Badge</Label>
        <Input id="slide-badge" value={form.badge} onChange={update("badge")} placeholder="New Arrivals" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="slide-description">Description</Label>
        <Textarea id="slide-description" value={form.description} onChange={update("description")} rows={3} />
      </div>

      <div className="flex items-center gap-3">
        <Switch
          id="slide-active"
          checked={form.active}
          onCheckedChange={(checked) => setForm((prev) => ({ ...prev, active: checked }))}
        />
        <Label htmlFor="slide-active">Visible on homepage</Label>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting || !form.productId}>
          {isSubmitting ? "Saving..." : "Save slide"}
        </Button>
      </div>
    </form>
  );
}
