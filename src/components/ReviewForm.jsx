import { useState } from "react";
import { Star, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { getErrorMessage } from "../lib/error-message";
import { useSubmitReview } from "@/hooks/useReviews";

const EMPTY_FORM = { rating: 0, title: "", body: "" };

const formFromReview = (existingReview) =>
  existingReview
    ? { rating: existingReview.rating, title: existingReview.title, body: existingReview.body }
    : EMPTY_FORM;

export default function ReviewForm({ open, onOpenChange, productId, uid, authorName, existingReview }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [prevOpen, setPrevOpen] = useState(open);
  const { mutateAsync, isPending } = useSubmitReview();

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setForm(formFromReview(existingReview));
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.rating < 1) {
      toast.error("Please select a star rating.");
      return;
    }

    try {
      await mutateAsync({ productId, uid, authorName, ...form });
      toast.success(existingReview ? "Review updated." : "Review submitted.");
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to submit review."));
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={() => onOpenChange(false)}
    >
      <Card
        className="w-full max-w-lg border-border/60 bg-background"
        onClick={(e) => e.stopPropagation()}
        data-testid="review-form-dialog"
      >
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold leading-none tracking-tight">
              {existingReview ? "Edit your review" : "Write a review"}
            </h3>
            <button
              type="button"
              className="cursor-pointer text-muted-foreground hover:text-foreground"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rating</label>
              <div className="flex gap-1" data-testid="review-form-rating">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className="cursor-pointer"
                    onClick={() => setForm((prev) => ({ ...prev, rating: value }))}
                    data-testid={`review-form-star-${value}`}
                  >
                    <Star
                      className={`h-6 w-6 ${
                        value <= form.rating ? "fill-current text-primary" : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="review-title">
                Title
              </label>
              <Input
                id="review-title"
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Summarize your experience"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="review-body">
                Review
              </label>
              <Textarea
                id="review-body"
                value={form.body}
                onChange={(e) => setForm((prev) => ({ ...prev, body: e.target.value }))}
                placeholder="Share details about your experience with this product"
                required
                minLength={10}
              />
            </div>

            <Button type="submit" className="w-full rounded-full" disabled={isPending}>
              {isPending ? "Saving..." : existingReview ? "Update review" : "Submit review"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
