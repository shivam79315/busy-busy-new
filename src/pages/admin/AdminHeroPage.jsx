import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import HeroSlideForm from "@/components/admin/HeroSlideForm";
import {
  useAdminHeroSlides,
  useCreateHeroSlide,
  useDeleteHeroSlide,
  useUpdateHeroSlide,
} from "@/hooks/useAdminHeroSlides";
import { getErrorMessage } from "@/lib/error-message";

export default function AdminHeroPage() {
  const { data: slides, isLoading } = useAdminHeroSlides();
  const createSlide = useCreateHeroSlide();
  const updateSlide = useUpdateHeroSlide();
  const deleteSlide = useDeleteHeroSlide();

  const [editingSlide, setEditingSlide] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openCreateDialog = () => {
    setEditingSlide(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (slide) => {
    setEditingSlide(slide);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingSlide) {
        await updateSlide.mutateAsync({ id: editingSlide.id, data: values });
        toast.success("Slide updated.");
      } else {
        await createSlide.mutateAsync(values);
        toast.success("Slide created.");
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to save slide."));
    }
  };

  const handleDelete = async (slide) => {
    if (!window.confirm(`Delete "${slide.title}"?`)) return;

    try {
      await deleteSlide.mutateAsync(slide.id);
      toast.success("Slide deleted.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to delete slide."));
    }
  };

  return (
    <section className="space-y-6" data-testid="admin-hero-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Hero slides</h1>
          <p className="text-sm text-muted-foreground">Control what shows in the homepage carousel.</p>
        </div>
        <Button onClick={openCreateDialog}>Add slide</Button>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/70">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Visible</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            )}

            {!isLoading && slides?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No slides yet. Add one to populate the homepage carousel.
                </TableCell>
              </TableRow>
            )}

            {slides?.map((slide) => (
              <TableRow key={slide.id}>
                <TableCell>
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="h-12 w-12 rounded-md border border-border/60 object-contain bg-neutral-950"
                  />
                </TableCell>
                <TableCell>{slide.title}</TableCell>
                <TableCell>{slide.order}</TableCell>
                <TableCell>{slide.active ? "Yes" : "No"}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(slide)}>
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(slide)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSlide ? "Edit slide" : "Add slide"}</DialogTitle>
          </DialogHeader>
          <HeroSlideForm
            initialValues={editingSlide}
            onSubmit={handleSubmit}
            onCancel={() => setIsDialogOpen(false)}
            isSubmitting={createSlide.isPending || updateSlide.isPending}
          />
        </DialogContent>
      </Dialog>
    </section>
  );
}
