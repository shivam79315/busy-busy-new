import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { getErrorMessage } from "../lib/error-message";
import { listLocalOrders } from "../lib/store-service";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const data = await listLocalOrders();
        setOrders(data || []);
      } catch (error) {
        toast.error(getErrorMessage(error, "Unable to load orders."));
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card/70 p-8 text-center" data-testid="orders-loading-state">
        <p className="text-sm text-muted-foreground" data-testid="orders-loading-text">Loading orders...</p>
      </div>
    );
  }

  return (
    <section className="space-y-8" data-testid="orders-page">
      <header className="space-y-2" data-testid="orders-header">
        <h1 className="text-4xl font-bold sm:text-5xl" data-testid="orders-title">Orders</h1>
        <p className="text-sm text-muted-foreground md:text-base" data-testid="orders-subtitle">Track placed orders and item details.</p>
      </header>

      {orders.length === 0 ? (
        <Card className="border-border/60 bg-card/70" data-testid="orders-empty-state">
          <CardContent className="p-8 text-center">
            <p className="text-sm text-muted-foreground" data-testid="orders-empty-text">No orders yet. Place one from your cart.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-5" data-testid="orders-list">
          {orders.map((order) => (
            <Card key={order.id} className="border-border/60 bg-card/70" data-testid={`order-card-${order.id}`}>
              <CardHeader className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2" data-testid={`order-header-${order.id}`}>
                  <CardTitle className="text-3xl" data-testid={`order-number-${order.id}`}>{order.order_number}</CardTitle>
                  <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary" data-testid={`order-status-${order.id}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground" data-testid={`order-created-at-${order.id}`}>
                  Placed on {new Date(order.created_at).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground" data-testid={`order-address-${order.id}`}>Shipping: {order.shipping_address}</p>
              </CardHeader>

              <CardContent className="space-y-3">
                {order.items.map((item) => (
                  <div key={`${order.id}-${item.product_id}`} className="flex items-center justify-between rounded-xl border border-border/60 bg-background/50 p-3" data-testid={`order-item-${order.id}-${item.product_id}`}>
                    <div>
                      <p className="text-sm font-medium" data-testid={`order-item-name-${order.id}-${item.product_id}`}>{item.name}</p>
                      <p className="text-xs text-muted-foreground" data-testid={`order-item-qty-${order.id}-${item.product_id}`}>Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold" data-testid={`order-item-total-${order.id}-${item.product_id}`}>${item.line_total.toFixed(2)}</p>
                  </div>
                ))}
                <div className="flex items-center justify-end border-t border-border/60 pt-3">
                  <p className="text-sm font-semibold" data-testid={`order-total-${order.id}`}>Total: ${order.total_amount.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
