const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// connect DB
mongoose.connect("mongodb://root:root@localhost:27017/CampusCanteen?authSource=admin")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// MODELS
const Order = mongoose.model(
  "Order",
  new mongoose.Schema({}, { strict: false }),
  "Orders"   
);

const Menu = mongoose.model(
  "Menu",
  new mongoose.Schema({}, { strict: false }),
  "Menu"       
);

// ---------------- ORDERS ----------------


app.get("/api/orders", async (req, res) => {
  const orders = await Order.find({});
  res.json(orders);
});

// Update order status
app.patch("/api/orders/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Order not found" });

    res.json(updated);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update order" });
  }
});

// ---------------- MENU ----------------

app.get("/api/menu", async (req, res) => {
  const menu = await Menu.find({});
  res.json(menu);
});

// Create menu item
app.post("/api/menu", async (req, res) => {
  try {
    const item = await Menu.create(req.body);
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create menu item" });
  }
});

// Update menu item
app.put("/api/menu/:id", async (req, res) => {
  try {
    const item = await Menu.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ error: "Menu item not found" });

    res.json(item);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update menu item" });
  }
});

// Delete menu item
app.delete("/api/menu/:id", async (req, res) => {
  try {
    const deleted = await Menu.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Menu item not found" });

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete menu item" });
  }
});

// start server
app.listen(5000, () =>
  console.log("API running at http://localhost:5000")
);