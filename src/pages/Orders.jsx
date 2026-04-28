import { useState, useEffect } from "react";
import { RefreshCw, Check } from "lucide-react";
import { ordersApi } from "@/lib/api";
import { toast } from "sonner";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      const data = await ordersApi.getAll();
      const pending = data
        .filter((o) => o.status === "Pending")
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setOrders(pending);
    } catch {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => fetchOrders(true), 10000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkServed = async (id) => {
    try {
      await ordersApi.markServed(id);
      toast.success("Order marked as served");
      fetchOrders(true);
    } catch {
      toast.error("Failed to update order");
    }
  };

  const formatDate = (str) =>
    new Date(str).toLocaleString("en-IN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">Pending canteen orders · auto-refreshes every 10s</p>
        </div>
        <button
          onClick={() => fetchOrders(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No pending orders</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-gray-900 text-white text-lg font-bold px-3 py-0.5 rounded-lg">
                    #{order.token}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{order.phone_number}</p>
                    <p className="text-xs text-gray-400">{formatDate(order.created_at)}</p>
                  </div>
                </div>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                  {order.status}
                </span>
              </div>

              <ul className="space-y-1 mb-4">
                {order.ordered_items.map((item, i) => (
                  <li key={i} className="flex justify-between text-sm text-gray-600">
                    <span>{item.name}</span>
                    <span className="font-medium">×{item.quantity}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleMarkServed(order._id)}
                className="w-full flex items-center justify-center gap-2 py-1.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Check size={14} />
                Mark as Served
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
