# CampusCanteen — Frontend

Admin dashboard for managing canteen orders and menu items. Built with React and Tailwind CSS, backed by an Express + MongoDB service.

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React 18 (JavaScript/JSX) |
| Styling | Tailwind CSS |
| HTTP Client | Axios |
| Routing | React Router v6 |
| Notifications | Sonner |
| Icons | Lucide React |
| Build Tool | Vite |
| API Server | Express.js + Mongoose |

## Project Structure

```
CampusCanteen-FE/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── service.cjs          # Express API server (port 5000) — connects to MongoDB
└── src/
    ├── main.jsx         # App entry point
    ├── App.jsx          # Router setup
    ├── index.css        # Tailwind base + CSS variables
    ├── lib/
    │   ├── axios.js     # Axios instance (baseURL: localhost:5000/api)
    │   └── api.js       # ordersApi and menuApi
    ├── components/
    │   └── Layout.jsx   # Sidebar + mobile nav shell
    └── pages/
        ├── Orders.jsx   # Pending orders grid, auto-refreshes every 10s
        ├── Menu.jsx     # Menu CRUD — add, edit, delete items
        └── NotFound.jsx
```

## Pages

**Orders** (`/`)
- Displays all pending orders as cards
- Shows token number, phone, items, timestamp
- Mark as Served button removes the order from the list
- Auto-refreshes every 10 seconds

**Menu** (`/menu`)
- Table of all menu items with inline editing
- Add new items via modal dialog (duplicate name check)
- Delete with confirmation dialog

## API Endpoints (service.cjs)

| Method | Path | Action |
|---|---|---|
| GET | `/api/orders` | Fetch all orders |
| PATCH | `/api/orders/:id` | Update order status |
| GET | `/api/menu` | Fetch all menu items |
| POST | `/api/menu` | Create menu item |
| PUT | `/api/menu/:id` | Update menu item |
| DELETE | `/api/menu/:id` | Delete menu item |

## Setup & Run

```bash
# Install dependencies
npm install

# Terminal 1 — Express API server (MongoDB)
node service.cjs

# Terminal 2 — Vite dev server
npm run dev
# opens at http://localhost:8080
```

Make sure MongoDB is running before starting `service.cjs`:
```bash
sudo systemctl start mongod
```
