import api from "./axios";

export const ordersApi = {
  getAll:     () => api.get("/orders").then((r) => r.data),
  markServed: (id) => api.patch(`/orders/${id}`, { status: "Served" }).then((r) => r.data),
};

export const menuApi = {
  getAll:  ()         => api.get("/menu").then((r) => r.data),
  create:  (item)     => api.post("/menu", item).then((r) => r.data),
  update:  (id, item) => api.put(`/menu/${id}`, item).then((r) => r.data),
  remove:  (id)       => api.delete(`/menu/${id}`),
};
