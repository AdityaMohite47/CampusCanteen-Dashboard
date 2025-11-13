// API utility functions for canteen admin dashboard

const API_BASE_URL = "http://localhost:5000/api";

export interface OrderItem {
  name: string;
  quantity: number;
}

export interface Order {
  order_id: string;
  customer_name: string;
  items: OrderItem[];
  status: 'Pending' | 'Completed';
  created_at: string;
}

export interface MenuItem {
  _id: string;
  name: string;
  price: number;
  availability?: boolean;
}

export interface NewMenuItem {
  name: string;
  price: number;
  availability?: boolean;
}

// Orders API
export const ordersApi = {
  getAll: async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/orders`);
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  updateStatus: async (orderId: string, status: 'Completed'): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update order status');
    return response.json();
  },
};

// Menu API
export const menuApi = {
  getAll: async (): Promise<MenuItem[]> => {
    const response = await fetch(`${API_BASE_URL}/menu`);
    if (!response.ok) throw new Error('Failed to fetch menu items');
    return response.json();
  },

  create: async (item: NewMenuItem): Promise<MenuItem> => {
    const response = await fetch(`${API_BASE_URL}/menu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error('Failed to create menu item');
    return response.json();
  },

  update: async (id: string, item: Partial<MenuItem>): Promise<MenuItem> => {
    const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error('Failed to update menu item');
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete menu item');
  },
};
