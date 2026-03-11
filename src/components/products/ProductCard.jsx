import { Heart, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export const ProductCard = ({ product, index, onAddToCart, onAddToWishlist }) => {
  const cardDelayStyle = { animationDelay: `${Math.min(index, 6) * 0.08}s` };

  return (
    <Card className="card-rise group overflow-hidden border-border/60 bg-card/70 shadow-lg shadow-black/5 backdrop-blur-sm" style={cardDelayStyle} data-testid={`product-card-${product.productId}`}>
      <Link to={`/products/${product.productId}`} className="relative block aspect-[4/3] overflow-hidden" data-testid={`product-image-link-${product.productId}`}>
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          data-testid={`product-image-${product.productId}`}
        />
        <span className="absolute left-3 top-3 rounded-full bg-background/85 px-3 py-1 text-xs font-medium text-foreground" data-testid={`product-badge-${product.productId}`}>
          {product.badge}
        </span>
      </Link>

      <CardContent className="space-y-4 p-5">
        <div className="space-y-2">
          <Link to={`/products/${product.productId}`} className="line-clamp-1 text-2xl font-semibold leading-tight text-foreground transition-colors duration-300 hover:text-primary" data-testid={`product-title-link-${product.productId}`}>
            <h3 data-testid={`product-title-${product.productId}`}>{product.title}</h3>
          </Link>
          <p className="line-clamp-2 text-sm text-muted-foreground" data-testid={`product-description-${product.productId}`}>
            {product.description}
          </p>
          <div className="flex flex-wrap items-center gap-2" data-testid={`product-meta-row-${product.productId}`}>
            <span className="rounded-full border border-border/60 bg-background/60 px-2.5 py-1 text-xs text-muted-foreground" data-testid={`product-brand-${product.productId}`}>
              {product.brand || "CoreLine"}
            </span>
            <span className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary" data-testid={`product-discount-${product.productId}`}>
              {product.discount || 0}% off
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-foreground" data-testid={`product-price-${product.productId}`}>${product.price.toFixed(2)}</p>
          <p className="inline-flex items-center gap-1 text-sm text-muted-foreground" data-testid={`product-rating-${product.productId}`}>
            <Star className="h-4 w-4 fill-current text-primary" />
            {product.rating}
          </p>
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-2">
          <Button className="h-10 rounded-full" onClick={() => onAddToCart(product.productId)} data-testid={`product-add-cart-${product.productId}`}>
            <ShoppingCart className="mr-1 h-4 w-4" />
            Add to Cart
          </Button>
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-full" onClick={() => onAddToWishlist(product.productId)} data-testid={`product-add-wishlist-${product.productId}`}>
            <Heart className="h-4 w-4" />
          </Button>

          <Button asChild variant="outline" className="h-10 rounded-full col-span-2" data-testid={`product-view-details-${product.productId}`}>
            <Link to={`/products/${product.productId}`}>View details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
