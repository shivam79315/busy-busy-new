import { ShoppingCart, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { getErrorMessage } from "../lib/error-message";
import {
  addLocalCartItem,
  getLocalWishlist,
  removeLocalWishlistItem,
} from "../lib/store-service";

export default function WishlistPage() {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWishlist = async () => {
    setIsLoading(true);
    try {
      const data = await getLocalWishlist();
      setWishlistItems(data.items || []);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to load wishlist."));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeItem = async (productId) => {
    try {
      const data = await removeLocalWishlistItem(productId);
      setWishlistItems(data.items || []);
      toast.success("Removed from wishlist.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to remove item."));
    }
  };

  const moveToCart = async (productId) => {
    try {
      await addLocalCartItem({ product_id: productId, quantity: 1 });
      const data = await removeLocalWishlistItem(productId);
      setWishlistItems(data.items || []);
      toast.success("Moved to cart.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to move item."));
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card/70 p-8 text-center" data-testid="wishlist-loading-state">
        <p className="text-sm text-muted-foreground" data-testid="wishlist-loading-text">Loading wishlist...</p>
      </div>
    );
  }

  return (
    <section className="space-y-8" data-testid="wishlist-page">
      <header className="space-y-2" data-testid="wishlist-header">
        <h1 className="text-4xl font-bold sm:text-5xl" data-testid="wishlist-title">Wishlist</h1>
        <p className="text-sm text-muted-foreground md:text-base" data-testid="wishlist-subtitle">Products you want to buy later.</p>
      </header>

      {wishlistItems.length === 0 ? (
        <Card className="border-border/60 bg-card/70" data-testid="wishlist-empty-state">
          <CardContent className="p-8 text-center">
            <p className="text-sm text-muted-foreground" data-testid="wishlist-empty-text">No saved items yet.</p>
            <Button className="mt-4 rounded-full" onClick={() => navigate("/products")} data-testid="wishlist-browse-products-button">
              Explore products
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2" data-testid="wishlist-grid">
          {wishlistItems.map((item) => (
            <Card key={item.id} className="border-border/60 bg-card/70" data-testid={`wishlist-item-${item.id}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl" data-testid={`wishlist-item-title-${item.id}`}>{item.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <img src={item.image_url} alt={item.name} className="h-52 w-full rounded-xl object-cover object-center" data-testid={`wishlist-item-image-${item.id}`} />
                <p className="text-sm text-muted-foreground" data-testid={`wishlist-item-description-${item.id}`}>{item.description}</p>
                <p className="text-base font-semibold" data-testid={`wishlist-item-price-${item.id}`}>${item.price.toFixed(2)}</p>
                <div className="flex items-center gap-2" data-testid={`wishlist-item-actions-${item.id}`}>
                  <Button className="flex-1 rounded-full" onClick={() => moveToCart(item.id)} data-testid={`wishlist-add-cart-${item.id}`}>
                    <ShoppingCart className="mr-1 h-4 w-4" />
                    Move to cart
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full" onClick={() => removeItem(item.id)} data-testid={`wishlist-remove-${item.id}`}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
