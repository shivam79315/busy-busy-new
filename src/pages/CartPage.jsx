import { Minus, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { getErrorMessage } from "../lib/error-message";
import {
  getLocalCart,
  placeLocalOrder,
  removeLocalCartItem,
  updateLocalCartItemQuantity,
} from "../lib/store-service";

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], subtotal: 0 });
  const [shippingAddress, setShippingAddress] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const data = await getLocalCart();
      setCart(data);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to load cart."));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, quantity) => {
    try {
      const data = await updateLocalCartItemQuantity(productId, quantity);
      setCart(data);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to update quantity."));
    }
  };

  const removeItem = async (productId) => {
    try {
      const data = await removeLocalCartItem(productId);
      setCart(data);
      toast.success("Item removed from cart.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to remove item."));
    }
  };

  const placeOrder = async () => {
    if (shippingAddress.trim().length < 8) {
      toast.error("Please enter a valid shipping address.");
      return;
    }

    setIsPlacingOrder(true);
    try {
      await placeLocalOrder({ shipping_address: shippingAddress.trim() });
      toast.success("Order placed successfully.");
      navigate("/orders");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to place order."));
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card/70 p-8 text-center" data-testid="cart-loading-state">
        <p className="text-sm text-muted-foreground" data-testid="cart-loading-text">Loading cart...</p>
      </div>
    );
  }

  return (
    <section className="space-y-8" data-testid="cart-page">
      <header className="space-y-2" data-testid="cart-header">
        <h1 className="text-4xl font-bold sm:text-5xl" data-testid="cart-title">Cart</h1>
        <p className="text-sm text-muted-foreground md:text-base" data-testid="cart-subtitle">Review items and place your order.</p>
      </header>

      {cart.items.length === 0 ? (
        <Card className="border-border/60 bg-card/70" data-testid="cart-empty-state">
          <CardContent className="p-8 text-center">
            <p className="text-sm text-muted-foreground" data-testid="cart-empty-text">Your cart is empty. Add products to continue.</p>
            <Button className="mt-4 rounded-full" onClick={() => navigate("/products")} data-testid="cart-browse-products-button">
              Browse products
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3" data-testid="cart-content-grid">
          <div className="space-y-4 lg:col-span-2" data-testid="cart-items-list">
            {cart.items.map((item) => (
              <Card key={item.product_id} className="border-border/60 bg-card/70" data-testid={`cart-item-${item.product_id}`}>
                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                  <img src={item.image_url} alt={item.name} className="h-24 w-full rounded-xl object-cover object-center sm:w-24" data-testid={`cart-item-image-${item.product_id}`} />
                  <div className="flex-1 space-y-1">
                    <h3 className="text-2xl font-semibold" data-testid={`cart-item-name-${item.product_id}`}>{item.name}</h3>
                    <p className="text-sm text-muted-foreground" data-testid={`cart-item-price-${item.product_id}`}>${item.price.toFixed(2)}</p>
                    <p className="text-sm font-medium" data-testid={`cart-item-total-${item.product_id}`}>Line total: ${item.line_total.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2" data-testid={`cart-item-actions-${item.product_id}`}>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                      disabled={item.quantity <= 1}
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      data-testid={`cart-item-decrease-${item.product_id}`}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium" data-testid={`cart-item-quantity-${item.product_id}`}>{item.quantity}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      data-testid={`cart-item-increase-${item.product_id}`}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                      onClick={() => removeItem(item.product_id)}
                      data-testid={`cart-item-remove-${item.product_id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="h-fit border-border/60 bg-card/70" data-testid="cart-summary-card">
            <CardHeader>
              <CardTitle className="text-3xl" data-testid="cart-summary-title">Order summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm" data-testid="cart-subtotal-row">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium" data-testid="cart-subtotal-value">${cart.subtotal.toFixed(2)}</span>
              </div>

              <div className="space-y-2" data-testid="cart-address-field">
                <label className="text-sm font-medium" htmlFor="shipping-address" data-testid="cart-address-label">Shipping address</label>
                <Textarea
                  id="shipping-address"
                  value={shippingAddress}
                  onChange={(event) => setShippingAddress(event.target.value)}
                  placeholder="Street, city, postal code, country"
                  className="min-h-24"
                  data-testid="cart-address-input"
                />
              </div>

              <Button className="w-full rounded-full" onClick={placeOrder} disabled={isPlacingOrder} data-testid="cart-place-order-button">
                {isPlacingOrder ? "Placing order..." : "Place order"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
}
