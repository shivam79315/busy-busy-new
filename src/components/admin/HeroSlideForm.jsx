import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const emptySlide = {
  title: "",
  badge: "",
  description: "",
  imageUrl: "",
  order: 0,
  active: true,
};

export default function HeroSlideForm({ initialValues, onSubmit, onCancel, isSubmitting }) {
  const [form, setForm] = useState({ ...emptySlide, ...initialValues });

  const update = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      order: Number(form.order) || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <div className="space-y-1.5">
        <Label htmlFor="slide-image">Image URL (Cloudinary link)</Label>
        <Input
          id="slide-image"
          value={form.imageUrl}
          onChange={update("imageUrl")}
          placeholder="https://res.cloudinary.com/..."
          required
        />
        {form.imageUrl && (
          <img
            src={form.imageUrl}
            alt="Preview"
            className="mt-2 h-28 w-28 rounded-lg border border-border/60 object-contain bg-neutral-950"
            onError={(event) => {
              event.currentTarget.style.visibility = "hidden";
            }}
            onLoad={(event) => {
              event.currentTarget.style.visibility = "visible";
            }}
          />
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="slide-order">Order</Label>
        <Input id="slide-order" type="number" value={form.order} onChange={update("order")} />
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
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save slide"}
        </Button>
      </div>
    </form>
  );
}
