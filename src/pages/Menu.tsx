import { useState, useEffect } from "react";
import { Plus, RefreshCw, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { menuApi, MenuItem } from "@/lib/api";

const Menu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);

  // Form states
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    availability: true,
  });

  const [editValues, setEditValues] = useState<{ [key: string]: { name: string; price: string } }>(
    {}
  );

  const fetchMenuItems = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const data = await menuApi.getAll();
      setMenuItems(data);
    } catch (error) {
      toast.error("Failed to fetch menu items");
      console.error("Error fetching menu:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleAddItem = async () => {
    if (!newItem.name.trim() || !newItem.price) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await menuApi.create({
        name: newItem.name.trim(),
        price: parseFloat(newItem.price),
        availability: newItem.availability,
      });
      toast.success("Menu item added successfully");
      setNewItem({ name: "", price: "", availability: true });
      setIsAddDialogOpen(false);
      fetchMenuItems(true);
    } catch (error) {
      toast.error("Failed to add menu item");
      console.error("Error adding menu item:", error);
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      await menuApi.update(item._id, { availability: !item.availability });
      toast.success(`${item.name} is now ${!item.availability ? "available" : "unavailable"}`);
      fetchMenuItems(true);
    } catch (error) {
      toast.error("Failed to update availability");
      console.error("Error updating availability:", error);
    }
  };

  const handleStartEdit = (item: MenuItem) => {
    setEditingItem(item._id);
    setEditValues({
      ...editValues,
      [item._id]: { name: item.name, price: item.price.toString() },
    });
  };

  const handleSaveEdit = async (item: MenuItem) => {
    const values = editValues[item._id];
    if (!values || !values.name.trim() || !values.price) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await menuApi.update(item._id, {
        name: values.name.trim(),
        price: parseFloat(values.price),
      });
      toast.success("Menu item updated successfully");
      setEditingItem(null);
      fetchMenuItems(true);
    } catch (error) {
      toast.error("Failed to update menu item");
      console.error("Error updating menu item:", error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await menuApi.delete(id);
      toast.success("Menu item deleted successfully");
      setDeleteItemId(null);
      fetchMenuItems(true);
    } catch (error) {
      toast.error("Failed to delete menu item");
      console.error("Error deleting menu item:", error);
    }
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
          <h1 className="text-3xl font-bold text-foreground">Menu Management</h1>
          <p className="text-muted-foreground mt-1">Add, edit, and manage menu items</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => fetchMenuItems(true)}
            disabled={refreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Menu Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Name</label>
                  <Input
                    placeholder="e.g., Masala Dosa"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Price (₹)</label>
                  <Input
                    type="number"
                    placeholder="e.g., 40"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Available</label>
                  <Switch
                    checked={newItem.availability}
                    onCheckedChange={(checked) =>
                      setNewItem({ ...newItem, availability: checked })
                    }
                  />
                </div>
                <Button onClick={handleAddItem} className="w-full">
                  Add Item
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {menuItems.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">No menu items found</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Menu Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Price
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                      Available
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map((item) => (
                    <tr key={item._id} className="border-b border-border last:border-0">
                      <td className="py-3 px-4">
                        {editingItem === item._id ? (
                          <Input
                            value={editValues[item._id]?.name || ""}
                            onChange={(e) =>
                              setEditValues({
                                ...editValues,
                                [item._id]: {
                                  ...editValues[item._id],
                                  name: e.target.value,
                                },
                              })
                            }
                            className="max-w-xs"
                          />
                        ) : (
                          <span className="text-foreground font-medium">{item.name}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {editingItem === item._id ? (
                          <Input
                            type="number"
                            value={editValues[item._id]?.price || ""}
                            onChange={(e) =>
                              setEditValues({
                                ...editValues,
                                [item._id]: {
                                  ...editValues[item._id],
                                  price: e.target.value,
                                },
                              })
                            }
                            className="max-w-[100px]"
                          />
                        ) : (
                          <span className="text-foreground">₹{item.price}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Switch
                          checked={item.availability}
                          onCheckedChange={() => handleToggleAvailability(item)}
                          disabled={editingItem === item._id}
                        />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex gap-2 justify-end">
                          {editingItem === item._id ? (
                            <Button
                              onClick={() => handleSaveEdit(item)}
                              size="sm"
                              variant="default"
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleStartEdit(item)}
                              size="sm"
                              variant="outline"
                            >
                              Edit
                            </Button>
                          )}
                          <Button
                            onClick={() => setDeleteItemId(item._id)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={deleteItemId !== null} onOpenChange={() => setDeleteItemId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the menu item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteItemId && handleDeleteItem(deleteItemId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Menu;
