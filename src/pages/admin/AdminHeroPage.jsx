import { useState } from "react";
import { toast } from "sonner";
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
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
  useReorderHeroSlides,
  useUpdateHeroSlide,
} from "@/hooks/useAdminHeroSlides";
import { getErrorMessage } from "@/lib/error-message";

const MAX_SLIDES = 6;

function SortableSlideRow({ slide, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: slide.id,
  });

  return (
    <TableRow
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? "opacity-50" : undefined}
    >
      <TableCell>
        <button
          type="button"
          className="cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </TableCell>
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
        <Button variant="outline" size="sm" onClick={() => onEdit(slide)}>
          Edit
        </Button>
        <Button variant="outline" size="sm" onClick={() => onDelete(slide)}>
          Delete
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default function AdminHeroPage() {
  const { data: slides, isLoading } = useAdminHeroSlides();
  const createSlide = useCreateHeroSlide();
  const updateSlide = useUpdateHeroSlide();
  const deleteSlide = useDeleteHeroSlide();
  const reorderSlides = useReorderHeroSlides();

  const [editingSlide, setEditingSlide] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const atLimit = (slides?.length ?? 0) >= MAX_SLIDES;

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
        await createSlide.mutateAsync({ ...values, order: slides?.length ?? 0 });
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

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !slides) return;

    const oldIndex = slides.findIndex((slide) => slide.id === active.id);
    const newIndex = slides.findIndex((slide) => slide.id === over.id);
    const reordered = arrayMove(slides, oldIndex, newIndex);

    try {
      await reorderSlides.mutateAsync(reordered.map((slide) => slide.id));
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to reorder slides."));
    }
  };

  return (
    <section className="space-y-6" data-testid="admin-hero-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Hero slides</h1>
          <p className="text-sm text-muted-foreground">Control what shows in the homepage carousel.</p>
        </div>
        <div className="text-right">
          <Button onClick={openCreateDialog} disabled={atLimit}>
            Add slide
          </Button>
          {atLimit && <p className="mt-1 text-xs text-muted-foreground">Maximum 6 slides reached.</p>}
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/70">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead />
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
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            )}

            {!isLoading && slides?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No slides yet. Add one to populate the homepage carousel.
                </TableCell>
              </TableRow>
            )}

            {!isLoading && slides?.length > 0 && (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={slides.map((slide) => slide.id)} strategy={verticalListSortingStrategy}>
                  {slides.map((slide) => (
                    <SortableSlideRow
                      key={slide.id}
                      slide={slide}
                      onEdit={openEditDialog}
                      onDelete={handleDelete}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
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
