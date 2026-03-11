import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, Sparkles, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getAuth } from "firebase/auth";
import { ProductCard } from "../components/products/ProductCard";
import { Button } from "../components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../lib/error-message";
import { useProducts } from "../hooks/useProducts";
import { addLocalWishlistItem } from "../lib/store-service";
import { handleAddToCart } from "@/lib/cart.service";

export default function ProductsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { data, isLoading, error } = useProducts();
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeBrand, setActiveBrand] = useState("all");
  const [activeDiscount, setActiveDiscount] = useState("all");
  const [activeTags, setActiveTags] = useState([]);
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);

  const searchTerm = useMemo(() => new URLSearchParams(location.search).get("search") || "", [location.search]);

  useEffect(() => {
    if (error) {
      toast.error(getErrorMessage(error, "Unable to load products."));
      return;
    }

    if (data) {
      if (!searchTerm) {
        setProducts(data);
        return;
      }

      const filtered = data.filter((product) =>
        product.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setProducts(filtered);
    }
  }, [data, error, searchTerm]);

  const categoryOptions = useMemo(() => {
    const categories = new Set(products.map((p) => p.category));
    return ["all", ...categories];
  }, [products]);

  const discountOptions = useMemo(() => {
    if (!products.length) {
      return [{ id: "all", label: "All discounts", min: 0, max: 100 }];
    }

    const discounts = products
      .map((p) => p.discount || 0)
      .filter((d) => d > 0);

    const maxDiscount = Math.max(...discounts);

    return [
      { id: "all", label: "All discounts", min: 0, max: maxDiscount },
      { id: "under-15", label: "Under 15%", min: 0, max: 14 },
      { id: "15-25", label: "15% - 25%", min: 15, max: 25 },
      { id: "26-35", label: "26% - 35%", min: 26, max: 35 },
      { id: "36-plus", label: "36%+", min: 36, max: 100 },
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const selectedDiscount = discountOptions.find((option) => option.id === activeDiscount) || discountOptions[0];

    return products.filter((product) => {
      if (activeCategory !== "all" && product.category !== activeCategory) {
        return false;
      }

      if (activeBrand !== "all" && product.brand !== activeBrand) {
        return false;
      }

      if (selectedDiscount.id !== "all") {
        const discount = product.discount || 0;
        if (discount < selectedDiscount.min || discount > selectedDiscount.max) {
          return false;
        }
      }

      if (activeTags.length > 0) {
        const hasAnyTag = activeTags.some((tag) => (product.tags || []).includes(tag));
        if (!hasAnyTag) {
          return false;
        }
      }

      return true;
    });
  }, [products, activeBrand, activeCategory, activeDiscount, activeTags]);

  const brandOptions = useMemo(() => {
    const brands = new Set();

    products.forEach((product) => {
      if (product.brand) {
        brands.add(product.brand);
      }
    });

    return ["all", ...Array.from(brands)];
  }, [products]);

  const tagOptions = useMemo(() => {
    const tags = new Set(
      products.flatMap((product) => product.tags || [])
    );

    return ["all", ...tags];
  }, [products]);

  const hiddenFiltersCount =
    (activeBrand !== "all" ? 1 : 0) +
    (activeDiscount !== "all" ? 1 : 0) +
    (activeTags.length > 0 ? 1 : 0);

  const toggleTagFilter = (tag) => {
    setActiveTags((previousTags) =>
      previousTags.includes(tag) ? previousTags.filter((existingTag) => existingTag !== tag) : [...previousTags, tag],
    );
  };

  const clearHiddenFilters = () => {
    setActiveBrand("all");
    setActiveDiscount("all");
    setActiveTags([]);
  };

  const withAuthGuard = async (callback, fallbackErrorMessage) => {
    if (!isAuthenticated) {
      toast.error("Please login to continue.");
      navigate("/login", { state: { from: "/products" } });
      return;
    }

    try {
      await callback();
    } catch (error) {
      toast.error(getErrorMessage(error, fallbackErrorMessage));
    }
  };

  const addToCart = (productId) =>
    handleAddToCart({
      productId,
      isAuthenticated,
      navigate,
      redirectTo: "/products"
  });

  const addToWishlist = async (productId) => {
    await withAuthGuard(async () => {
      await addLocalWishlistItem({ product_id: productId, quantity: 1 });
      toast.success("Saved to wishlist.");
    }, "Unable to save item to wishlist.");
  };

  return (
    <section className="space-y-8" data-testid="products-page">
      <header className="space-y-4" data-testid="products-header">
        <h1 className="text-4xl font-bold text-foreground sm:text-5xl" data-testid="products-title">Products</h1>
        <p className="text-sm text-muted-foreground md:text-base" data-testid="products-subtitle">
          {searchTerm ? `Showing results for "${searchTerm}"` : "Explore our elegant and practical collection."}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-3" data-testid="products-filter-row">
          <div className="flex flex-wrap items-center gap-2" data-testid="products-category-filter">
            {categoryOptions.map((category) => (
              <Button
                key={category}
                type="button"
                variant={activeCategory === category ? "default" : "outline"}
                className="rounded-full cursor-pointer capitalize cursor-pointer"
                onClick={() => setActiveCategory(category)}
                data-testid={`products-category-${category}`}
              >
                {category}
              </Button>
            ))}
          </div>

          <Popover open={filterPopoverOpen} onOpenChange={setFilterPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="rounded-full cursor-pointer border-primary/40 bg-card/70 backdrop-blur-md"
                data-testid="products-show-hidden-filters-button"
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Show hidden filters
                {hiddenFiltersCount > 0 ? (
                  <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground" data-testid="products-active-hidden-filter-count">
                    {hiddenFiltersCount}
                  </span>
                ) : null}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={12}
              className="w-[min(92vw,420px)] max-h-[78vh] overflow-hidden rounded-2xl border border-border/70 bg-card/95 p-0 shadow-2xl shadow-primary/10 backdrop-blur-xl"
              data-testid="products-hidden-filters-popover"
            >
              <div className="flex max-h-[78vh] flex-col" data-testid="products-hidden-filters-content">
                <div className="flex items-center justify-between border-b border-border/60 px-5 py-3" data-testid="products-hidden-filters-header">
                  <p className="inline-flex items-center gap-2 text-sm font-medium" data-testid="products-hidden-filters-title">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Advanced filters
                  </p>
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8 cursor-pointer rounded-full" onClick={() => setFilterPopoverOpen(false)} data-testid="products-hidden-filters-close-button">
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2 border-b border-border/60 bg-card/95 px-5 py-3" data-testid="products-hidden-filters-actions">
                  <Button type="button" variant="outline" className="rounded-full cursor-pointer" onClick={clearHiddenFilters} data-testid="products-clear-hidden-filters-button">
                    Clear all
                  </Button>
                  <Button type="button" className="rounded-full cursor-pointer" onClick={() => setFilterPopoverOpen(false)} data-testid="products-apply-hidden-filters-button">
                    Apply
                  </Button>
                </div>

                <div className="space-y-5 overflow-y-auto px-5 py-4" data-testid="products-hidden-filters-scroll-area">
                  <div className="space-y-2" data-testid="products-brand-filter-section">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground" data-testid="products-brand-filter-title">Brand</p>
                    <div className="flex flex-wrap gap-2" data-testid="products-brand-filter-options">
                      {brandOptions.map((brand) => (
                        <Button
                          key={brand}
                          type="button"
                          variant={activeBrand === brand ? "default" : "outline"}
                          className="h-8 rounded-full cursor-pointer px-3 text-xs"
                          onClick={() => setActiveBrand(brand)}
                          data-testid={`products-brand-filter-${brand.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          {brand}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2" data-testid="products-discount-filter-section">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground" data-testid="products-discount-filter-title">Discount</p>
                    <div className="flex flex-wrap gap-2" data-testid="products-discount-filter-options">
                      {discountOptions.map((discountOption) => (
                        <Button
                          key={discountOption.id}
                          type="button"
                          variant={activeDiscount === discountOption.id ? "default" : "outline"}
                          className="h-8 rounded-full cursor-pointer px-3 text-xs"
                          onClick={() => setActiveDiscount(discountOption.id)}
                          data-testid={`products-discount-filter-${discountOption.id}`}
                        >
                          {discountOption.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pb-1" data-testid="products-tags-filter-section">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground" data-testid="products-tags-filter-title">Tags</p>
                    <div className="flex flex-wrap gap-2" data-testid="products-tags-filter-options">
                      {tagOptions.map((tag) => {
                        const tagId = tag.toLowerCase().replace(/\s+/g, "-");
                        const isSelected = activeTags.includes(tag);
                        return (
                          <Button
                            key={tag}
                            type="button"
                            variant={isSelected ? "default" : "outline"}
                            className="h-8 rounded-full cursor-pointer px-3 text-xs capitalize"
                            onClick={() => toggleTagFilter(tag)}
                            data-testid={`products-tag-filter-${tagId}`}
                          >
                            {tag}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/*
          Requested by user: keep advanced panel code commented out and use floating popover modal instead.
          <section className="rounded-2xl border border-border/60 bg-card/70 p-4" data-testid="products-advanced-panel-below-filter">
            <p>Legacy slide-down advanced filter panel (commented).</p>
          </section>
        */}

        <div className="flex flex-wrap items-center gap-2" data-testid="products-active-hidden-filters-chip-row">
          {activeBrand !== "all" ? (
            <span className="rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs" data-testid="products-active-brand-chip">Brand: {activeBrand}</span>
          ) : null}
          {activeDiscount !== "all" ? (
            <span className="rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs" data-testid="products-active-discount-chip">
              Discount: {(discountOptions.find((item) => item.id === activeDiscount) || discountOptions[0]).label}
            </span>
          ) : null}
          {activeTags.map((tag) => (
            <span key={tag} className="rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs capitalize" data-testid={`products-active-tag-chip-${tag.toLowerCase().replace(/\s+/g, "-")}`}>
              {tag}
            </span>
          ))}
        </div>
      </header>

      {isLoading  ? (
        <div className="rounded-2xl border border-border/60 bg-card/70 p-8 text-center" data-testid="products-loading-state">
          <p className="text-sm text-muted-foreground" data-testid="products-loading-text">Loading products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card/70 p-8 text-center" data-testid="products-empty-state">
          <p className="text-sm text-muted-foreground" data-testid="products-empty-text">No products match your search. Try another keyword.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3" data-testid="products-grid">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.productId}
              product={product}
              index={index}
              onAddToCart={addToCart}
              onAddToWishlist={addToWishlist}
            />
          ))}
        </div>
      )}
    </section>
  );
}
