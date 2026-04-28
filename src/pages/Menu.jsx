import { useState, useEffect } from "react";
import { Plus, RefreshCw, Trash2, Save, Pencil, X } from "lucide-react";
import { menuApi } from "@/lib/api";
import { toast } from "sonner";

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editMap, setEditMap] = useState({});
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");

  const fetchItems = async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      setItems(await menuApi.getAll());
    } catch {
      toast.error("Failed to fetch menu");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleAdd = async () => {
    if (!newName.trim() || !newPrice) return toast.error("Fill in all fields");
    if (items.some((i) => i.name.toLowerCase() === newName.trim().toLowerCase()))
      return toast.error(`"${newName.trim()}" already exists`);
    try {
      await menuApi.create({ name: newName.trim(), price: parseFloat(newPrice) });
      toast.success("Item added");
      setNewName("");
      setNewPrice("");
      setAddOpen(false);
      fetchItems(true);
    } catch {
      toast.error("Failed to add item");
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditMap((m) => ({ ...m, [item._id]: { name: item.name, price: String(item.price) } }));
  };

  const handleSave = async (id) => {
    const v = editMap[id];
    if (!v?.name.trim() || !v.price) return toast.error("Fill in all fields");
    try {
      await menuApi.update(id, { name: v.name.trim(), price: parseFloat(v.price) });
      toast.success("Item updated");
      setEditingId(null);
      fetchItems(true);
    } catch {
      toast.error("Failed to update item");
    }
  };

  const handleDelete = async (id) => {
    try {
      await menuApi.remove(id);
      toast.success("Item deleted");
      setDeleteId(null);
      fetchItems(true);
    } catch {
      toast.error("Failed to delete item");
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Menu</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage canteen menu items</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => fetchItems(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700"
          >
            <Plus size={14} />
            Add Item
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No menu items yet</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b bg-gray-50">
            <span className="text-sm font-medium text-gray-600">Items ({items.length})</span>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b text-xs text-gray-500 uppercase tracking-wide">
                <th className="text-left px-4 py-2">Name</th>
                <th className="text-left px-4 py-2">Price</th>
                <th className="text-right px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const isEditing = editingId === item._id;
                const ev = editMap[item._id];
                return (
                  <tr key={item._id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-2.5">
                      {isEditing ? (
                        <input
                          value={ev?.name ?? ""}
                          onChange={(e) => setEditMap((m) => ({ ...m, [item._id]: { ...ev, name: e.target.value } }))}
                          className="border border-gray-300 rounded px-2 py-1 text-sm w-48 focus:outline-none focus:ring-1 focus:ring-gray-400"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-800">{item.name}</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      {isEditing ? (
                        <input
                          type="number"
                          value={ev?.price ?? ""}
                          onChange={(e) => setEditMap((m) => ({ ...m, [item._id]: { ...ev, price: e.target.value } }))}
                          className="border border-gray-300 rounded px-2 py-1 text-sm w-20 focus:outline-none focus:ring-1 focus:ring-gray-400"
                        />
                      ) : (
                        <span className="text-sm text-gray-600">₹{item.price}</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex gap-1.5 justify-end">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleSave(item._id)}
                              className="p-1.5 bg-gray-900 text-white rounded hover:bg-gray-700"
                            >
                              <Save size={14} />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1.5 border border-gray-300 rounded hover:bg-gray-100"
                            >
                              <X size={14} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => startEdit(item)}
                            className="p-1.5 border border-gray-300 rounded hover:bg-gray-100"
                          >
                            <Pencil size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteId(item._id)}
                          className="p-1.5 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add dialog */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Add Menu Item</h2>
              <button onClick={() => setAddOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Name</label>
                <input
                  placeholder="e.g. Masala Dosa"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Price (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 40"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>
              <button
                onClick={handleAdd}
                className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-700"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xs p-6 text-center">
            <h2 className="font-semibold text-gray-900 mb-2">Delete item?</h2>
            <p className="text-sm text-gray-500 mb-5">This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
