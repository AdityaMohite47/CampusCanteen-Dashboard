import { useState, useEffect } from "react";
import { RefreshCw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ordersApi, Order } from "@/lib/api";

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const data = await ordersApi.getAll();
      // Sort by created_at, latest first
      const sortedOrders = data.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setOrders(sortedOrders);
    } catch (error) {
      toast.error("Failed to fetch orders");
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      fetchOrders(true);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleMarkAsCompleted = async (orderId: string) => {
    try {
      await ordersApi.updateStatus(orderId, "Completed");
      toast.success("Order marked as completed");
      fetchOrders(true);
    } catch (error) {
      toast.error("Failed to update order status");
      console.error("Error updating order:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage incoming canteen orders</p>
        </div>
        <Button
          onClick={() => fetchOrders(true)}
          disabled={refreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">No orders found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <Card
              key={order.order_id}
              className={
                order.status === "Pending"
                  ? "border-warning shadow-sm hover:shadow-md transition-shadow"
                  : ""
              }
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{order.customer_name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <Badge
                    variant={order.status === "Pending" ? "secondary" : "default"}
                    className={
                      order.status === "Pending"
                        ? "bg-warning text-warning-foreground"
                        : "bg-success text-success-foreground"
                    }
                  >
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <p className="text-sm font-medium text-foreground">Items:</p>
                  <ul className="space-y-1">
                    {order.items.map((item, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex justify-between">
                        <span>{item.name}</span>
                        <span className="font-medium">x{item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {order.status === "Pending" && (
                  <Button
                    onClick={() => handleMarkAsCompleted(order.order_id)}
                    className="w-full"
                    size="sm"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Mark as Completed
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
