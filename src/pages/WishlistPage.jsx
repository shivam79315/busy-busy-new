import { ShoppingCart, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { getErrorMessage } from "../lib/error-message";
import { fetchProducts } from "@/api/products";
import { fetchWishlist, removeFromWishlist } from "@/lib/wishlist-service";
import { handleAddToCart } from "@/lib/cart.service";
import { useAuth } from "../context/AuthContext";

export default function WishlistPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWishlistItems = async () => {
    setIsLoading(true);

    try {
      const wishlist = await fetchWishlist();
      const products = await fetchProducts();

      const enriched = wishlist.map((item) => {
        const product = products.find(
          (p) => p.productId === item.productId
        );

        return {
          id: item.productId,
          name: product?.title,
          description: product?.description,
          image_url: product?.image,
          price: product?.price || 0
        };
      });

      setWishlistItems(enriched);

    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to load wishlist."));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const removeItem = async (productId) => {
    try {
      await removeFromWishlist(productId);

      setWishlistItems((prev) =>
        prev.filter((item) => item.id !== productId)
      );

      toast.success("Removed from wishlist.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to remove item."));
    }
  };

  const addToCart = (productId) =>
    handleAddToCart({
      productId,
      isAuthenticated,
      navigate,
      redirectTo: "/wishlist"
    });

  const moveToCart = async (productId) => {
    try {
      await addToCart(productId);
      await removeFromWishlist(productId);

      setWishlistItems((prev) =>
        prev.filter((item) => item.id !== productId)
      );

      toast.success("Moved to cart.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to move item."));
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card/70 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Loading wishlist...
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold sm:text-5xl">
          Wishlist
        </h1>
        <p className="text-sm text-muted-foreground md:text-base">
          Products you want to buy later.
        </p>
      </header>

      {wishlistItems.length === 0 ? (
        <Card className="border-border/60 bg-card/70">
          <CardContent className="p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No saved items yet.
            </p>

            <Button
              className="mt-4 rounded-full"
              onClick={() => navigate("/products")}
            >
              Explore products
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {wishlistItems.map((item) => (
            <Card
              key={item.id}
              className="border-border/60 bg-card/70"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">
                  {item.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="h-52 w-full rounded-xl object-cover object-center"
                />

                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>

                <p className="text-base font-semibold">
                  ${item.price.toFixed(2)}
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    className="flex-1 rounded-full"
                    onClick={() => moveToCart(item.id)}
                  >
                    <ShoppingCart className="mr-1 h-4 w-4" />
                    Move to cart
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() => removeItem(item.id)}
                  >
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