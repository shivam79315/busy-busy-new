import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import useEmblaCarousel from "embla-carousel-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../lib/error-message";
import {
  addLocalWishlistItem
} from "../lib/store-service";
import { useProduct, useRelatedProducts } from "@/hooks/useProducts";
import { handleAddToCart } from "@/lib/cart.service.js";

export default function ProductDetailPage() {
  const { productId } = useParams();

  const { data: product, isLoading, error } = useProduct(productId);
  const { data: relatedProducts } = useRelatedProducts(product?.category);
  const filteredRelated =
  relatedProducts?.filter(p => p.productId !== product.productId).slice(0,4) || [];

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [hiddenImages, setHiddenImages] = useState(new Set());

  useEffect(() => {
    if (!product) return;

    setActiveImageIndex(0);

    setSelectedVariants(
      (product.variantGroups || []).reduce((acc, group) => {
        acc[group.name] = group.options[0];
        return acc;
      }, {})
    );
  }, [product]);

  const detailTags = useMemo(() => {
    if (!product) return [];
    return [
      product.category,
      product.brand,
      `${product.discount}% off`,
      `Rating ${product.rating}`,
    ];
  }, [product]);

  const visibleImages = useMemo(() => {
    if (!product?.galleryImages) return [];
    return product.galleryImages.filter(
      (img) => img && !hiddenImages.has(img)
    );
  }, [product, hiddenImages]);

  const guardedAction = async (handler, fallbackError) => {
    if (!isAuthenticated) {
      toast.error("Please login to continue.");
      navigate("/login", { state: { from: `/products/${productId}` } });
      return;
    }

    try {
      await handler();
    } catch (error) {
      if (error) {
        toast.error(getErrorMessage(error, "Unable to load product."));
        navigate("/products");
      }
    }
  };

  const addToCart = () =>
    handleAddToCart({
      productId: product.productId,
      isAuthenticated,
      navigate,
      redirectTo: `/products/${product.productId}`
    });

  const addToWishlist = async () => {
    await guardedAction(async () => {
      await addLocalWishlistItem({ product_id: product.id, quantity: 1 });
      toast.success("Added to wishlist.");
    }, "Unable to add product to wishlist.");
  };

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    dragFree: false,
    align: "center"
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const selectVariantOption = (variantName, option) => {
    setSelectedVariants((previousVariants) => ({
      ...previousVariants,
      [variantName]: option,
    }));
  };

  if (isLoading) {
    return (
      <section className="rounded-3xl border border-border/60 bg-card/70 p-8 text-center" data-testid="product-detail-loading-state">
        <p className="text-sm text-muted-foreground" data-testid="product-detail-loading-text">Loading product details...</p>
      </section>
    );
  }

  if (!product || !product) {
    return (
      <section className="rounded-3xl border border-border/60 bg-card/70 p-8 text-center" data-testid="product-detail-not-found-state">
        <p className="text-sm text-muted-foreground" data-testid="product-detail-not-found-text">Product not found.</p>
      </section>
    );
  }

  return (
    <div className="space-y-10" data-testid="product-detail-page">
      <div className="flex flex-wrap items-center gap-3" data-testid="product-detail-breadcrumb">
        <Button asChild variant="outline" className="cursor-pointer rounded-full" data-testid="product-detail-back-button">
          <Link to="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to products
          </Link>
        </Button>
      </div>

      <section className="detail-page-enter overflow-hidden rounded-[2rem] border border-border/60 bg-card/75 p-4 shadow-xl shadow-primary/10 backdrop-blur-md md:p-7" data-testid="product-detail-main-card">
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-2" data-testid="product-detail-main-grid">
          <div
            className="detail-image-enter relative overflow-hidden rounded-[1.5rem] bg-secondary/40"
            data-testid="product-detail-image-wrapper"
          >
            {/* Embla viewport */}
            <div className="overflow-hidden h-[540px]" ref={emblaRef}>
              <div className="flex h-full">
                {visibleImages.map((img, index) => (
                  <div key={img} className="min-w-0 flex-[0_0_100%] h-full">
                    <img
                      src={img}
                      alt={`${product.title} ${index + 1}`}
                      className="h-full w-full object-cover object-center"
                      onError={() => {
                        setHiddenImages((prev) => new Set(prev).add(img));
                        emblaApi?.scrollNext();
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* LEFT BUTTON */}
            <Button
              variant="outline"
              size="icon"
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-background/80"
              onClick={scrollPrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* RIGHT BUTTON */}
            <Button
              variant="outline"
              size="icon"
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-background/80"
              onClick={scrollNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Badge */}
            <span className="absolute left-4 top-4 rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-medium capitalize">
              {product.badge}
            </span>

            {/* Thumbnails */}
            <div className="absolute bottom-3 left-3 right-3 flex gap-2 overflow-x-auto">
              {visibleImages.map((img, index) => (
                <button
                  key={img}
                  className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border/60"
                  onClick={() => emblaApi?.scrollTo(index)}
                >
                  <img
                    src={img}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.parentElement.style.display = "none";
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="detail-content-enter flex flex-col justify-between gap-6" data-testid="product-detail-content">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2" data-testid="product-detail-tags">
                {detailTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border/60 bg-background/50 px-3 py-1 text-xs capitalize text-muted-foreground"
                    data-testid={`product-detail-tag-${tag.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-4xl font-bold text-foreground sm:text-5xl" data-testid="product-detail-name">{product.title}</h1>
              <p className="text-sm text-muted-foreground md:text-base" data-testid="product-detail-description">{product.detailedDescription}</p>

              <div className="flex flex-wrap items-center gap-5" data-testid="product-detail-price-rating-row">
                <p className="text-3xl font-semibold" data-testid="product-detail-price">${product.price.toFixed(2)}</p>
                <p className="inline-flex items-center gap-1 text-sm text-muted-foreground" data-testid="product-detail-rating">
                  <Star className="h-4 w-4 fill-current text-primary" />
                  {product.rating} / 5
                </p>
                <p className="text-sm text-muted-foreground" data-testid="product-detail-review-count">({product.reviewSummary.totalCount} reviews)</p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-background/50 p-4" data-testid="product-detail-variants-box">
                <p className="text-sm font-medium" data-testid="product-detail-variants-title">Variants</p>
                <div className="mt-3 space-y-3" data-testid="product-detail-variants-groups">
                  {product.variants.map((group) => (
                    <div key={group.name} className="space-y-2" data-testid={`product-detail-variant-group-${group.name.toLowerCase().replace(/\s+/g, "-")}`}>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground" data-testid={`product-detail-variant-group-label-${group.name.toLowerCase().replace(/\s+/g, "-")}`}>
                        {group.name}
                      </p>
                      <div className="flex flex-wrap gap-2" data-testid={`product-detail-variant-options-${group.name.toLowerCase().replace(/\s+/g, "-")}`}>
                        {group.options.map((option) => {
                          const isSelected = selectedVariants[group.name] === option;
                          const optionId = option.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
                          return (
                            <Button
                              key={option}
                              type="button"
                              variant={isSelected ? "default" : "outline"}
                              className="h-8 rounded-full px-3 text-xs"
                              onClick={() => selectVariantOption(group.name, option)}
                              data-testid={`product-detail-variant-${group.name.toLowerCase().replace(/\s+/g, "-")}-${optionId}`}
                            >
                              {option}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 bg-background/50 p-4" data-testid="product-detail-shipping-box">
                <p className="inline-flex items-center gap-2 text-sm font-medium" data-testid="product-detail-shipping-title">
                  <Truck className="h-4 w-4 text-primary" />
                  Fast shipping & easy returns
                </p>
                <p className="mt-2 text-xs text-muted-foreground" data-testid="product-detail-shipping-text">
                  Usually dispatched in 24 hours. Free replacement window available for eligible products.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]" data-testid="product-detail-action-group">
              <Button className="h-11 rounded-full" onClick={addToCart} data-testid="product-detail-add-cart-button">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              <Button variant="outline" className="h-11 rounded-full" onClick={addToWishlist} data-testid="product-detail-add-wishlist-button">
                <Heart className="mr-2 h-4 w-4" />
                Wishlist
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="detail-section-enter space-y-4" data-testid="product-detail-reviews-section">
        <h2 className="text-base font-medium text-primary md:text-lg" data-testid="product-detail-reviews-title">Ratings & Reviews</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]" data-testid="product-detail-reviews-grid">
          <Card className="border-border/60 bg-card/70" data-testid="product-detail-reviews-summary-card">
            <CardContent className="space-y-4 p-5">
              <p className="text-sm text-muted-foreground" data-testid="product-detail-reviews-summary-label">Average rating</p>
              <p className="text-4xl font-semibold" data-testid="product-detail-reviews-average-value">{product.reviewSummary.average.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground" data-testid="product-detail-reviews-recommendation">
                {product.reviewSummary.recommendationPercent}% recommend this product
              </p>
              <div className="space-y-2" data-testid="product-detail-reviews-breakdown">
                {product.reviewSummary.breakdown.map((item) => (
                  <div key={item.stars} className="flex items-center gap-2" data-testid={`product-detail-review-breakdown-${item.stars}`}>
                    <span className="w-4 text-xs text-muted-foreground">{item.stars}</span>
                    <div className="h-2 flex-1 rounded-full bg-secondary/70" data-testid={`product-detail-review-breakdown-bar-${item.stars}`}>
                      <div className="h-2 rounded-full bg-primary" style={{ width: `${item.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-3" data-testid="product-detail-review-cards">
            {product.reviews.map((review, index) => (
              <Card key={`${review.author}-${index}`} className="border-border/60 bg-card/70" data-testid={`product-detail-review-card-${index}`}>
                <CardContent className="space-y-2 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2" data-testid={`product-detail-review-header-${index}`}>
                    <p className="text-sm font-medium" data-testid={`product-detail-review-author-${index}`}>{review.author}</p>
                    <p className="text-xs text-muted-foreground" data-testid={`product-detail-review-date-${index}`}>{review.date}</p>
                  </div>
                  <p className="inline-flex items-center gap-1 text-sm" data-testid={`product-detail-review-rating-${index}`}>
                    <Star className="h-4 w-4 fill-current text-primary" />
                    {review.rating}.0 · {review.title}
                  </p>
                  <p className="text-sm text-muted-foreground" data-testid={`product-detail-review-body-${index}`}>{review.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="detail-section-enter space-y-4" data-testid="product-detail-specs-section">
        <h2 className="text-base font-medium text-primary md:text-lg" data-testid="product-detail-specs-title">Specifications / Technical Details</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2" data-testid="product-detail-specs-grid">
          <Card className="border-border/60 bg-card/70" data-testid="product-detail-specifications-card">
            <CardContent className="space-y-3 p-5">
              <p className="text-sm font-medium" data-testid="product-detail-specifications-heading">Specifications</p>
              {product.specifications.map((item) => (
                <div key={item.label} className="flex items-start justify-between gap-4 border-b border-border/50 pb-2 last:border-0" data-testid={`product-detail-spec-row-${item.label.toLowerCase().replace(/\s+/g, "-")}`}>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-xs font-medium text-right">{item.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/70" data-testid="product-detail-technical-card">
            <CardContent className="space-y-3 p-5">
              <p className="text-sm font-medium" data-testid="product-detail-technical-heading">Technical Details</p>
              {product.technicalDetails.map((item) => (
                <div key={item.label} className="flex items-start justify-between gap-4 border-b border-border/50 pb-2 last:border-0" data-testid={`product-detail-technical-row-${item.label.toLowerCase().replace(/\s+/g, "-")}`}>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-xs font-medium text-right">{item.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="detail-section-enter space-y-4" data-testid="product-detail-faq-section">
        <h2 className="text-base font-medium text-primary md:text-lg" data-testid="product-detail-faq-title">FAQs</h2>
        <Card className="border-border/60 bg-card/70" data-testid="product-detail-faq-card">
          <CardContent className="p-5">
            <Accordion type="single" collapsible data-testid="product-detail-faq-accordion">
              {product.faqs.map((faq, index) => (
                <AccordionItem key={faq.question} value={`faq-${index}`} data-testid={`product-detail-faq-item-${index}`}>
                  <AccordionTrigger className="text-sm" data-testid={`product-detail-faq-question-${index}`}>
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent data-testid={`product-detail-faq-answer-${index}`}>
                    <p className="inline-flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {faq.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </section>

      <section className="detail-section-enter space-y-4" data-testid="product-detail-related-section">
        <h2 className="text-base font-medium text-primary md:text-lg" data-testid="product-detail-related-title">Related products</h2>
        {!filteredRelated || filteredRelated.length === 0 ? (
          <Card className="border-border/60 bg-card/70" data-testid="product-detail-related-empty">
            <CardContent className="p-5 text-sm text-muted-foreground" data-testid="product-detail-related-empty-text">
              More items in this category are coming soon.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" data-testid="product-detail-related-grid">
            {filteredRelated.map((item, index) => (
              <Link key={item.id} to={`/products/${item.id}`} className="card-rise group overflow-hidden rounded-2xl border border-border/60 bg-card/70" style={{ animationDelay: `${index * 0.08}s` }} data-testid={`product-detail-related-link-${item.id}`}>
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105" data-testid={`product-detail-related-image-${item.id}`} />
                </div>
                <div className="space-y-2 p-4" data-testid={`product-detail-related-content-${item.id}`}>
                  <p className="line-clamp-1 text-xl font-semibold" data-testid={`product-detail-related-name-${item.id}`}>{item.name}</p>
                  <p className="text-sm text-muted-foreground" data-testid={`product-detail-related-price-${item.id}`}>${item.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
