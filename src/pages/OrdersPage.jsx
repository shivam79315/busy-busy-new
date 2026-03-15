import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { getErrorMessage } from "../lib/error-message";
import { fetchOrders } from "@/api/orders";
import { getAuth } from "firebase/auth";
import { fetchProductsByIds } from "@/api/products";

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [productsMap, setProductsMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleOrders = async () => {
      setIsLoading(true);

      try {
        const uid = getAuth().currentUser.uid;
        const ordersData = await fetchOrders(uid);

        // collect product ids
        const productIds = [
          ...new Set(
            ordersData.flatMap((order) =>
              order.items.map((item) => item.productId)
            )
          )
        ];

        // fetch only required products
        const products = await fetchProductsByIds(productIds);

        // create lookup map
        const map = {};
        products.forEach((p) => {
          map[p.productId] = p;
        });

        setProductsMap(map);
        const data = await fetchOrders(uid);
        setOrders(data || []);
      } catch (error) {
        console.log(error)
        toast.error(getErrorMessage(error, "Unable to load orders."));
      } finally {
        setIsLoading(false);
      }
    };

    handleOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card/70 p-8 text-center">
        <p className="text-sm text-muted-foreground">Loading orders...</p>
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold sm:text-5xl">Orders</h1>
        <p className="text-sm text-muted-foreground md:text-base">
          Track placed orders and item details.
        </p>
      </header>

      {orders.length === 0 ? (
        <Card className="border-border/60 bg-card/70">
          <CardContent className="p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No orders yet. Place one from your cart.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <Card key={order.id} className="border-border/60 bg-card/70">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-3xl">
                    Order #{order.id.slice(0, 6)}
                  </CardTitle>

                  <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
                    {order.paymentStatus}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground">
                  Placed on{" "}
                  {order.createdAt?.toDate().toLocaleString()}
                </p>

                {order.shippingAddress && (
                  <p className="text-sm text-muted-foreground">
                    Shipping: {order.shippingAddress}
                  </p>
                )}
              </CardHeader>

              <CardContent className="space-y-3">
                {order.items?.map((item) => {
                  const product = productsMap[item.productId];

                  return (
                  <div
                    key={`${order.id}-${item.productId}`}
                    className="flex items-center justify-between rounded-xl border border-border/60 bg-background/50 p-3 cursor-pointer"
                    onClick={() => navigate(`/products/${item.productId}`)}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={product?.image}
                        alt={item.name}
                        className="h-12 w-12 rounded-md object-cover"
                      />

                      <div className="flex flex-col">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  )
                })}

                <div className="flex items-center justify-end border-t border-border/60 pt-3">
                  <p className="text-sm font-semibold">
                    Total: ${(order.amount / 100).toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}