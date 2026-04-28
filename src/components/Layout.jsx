import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, UtensilsCrossed, Menu, X } from "lucide-react";

const navItems = [
  { path: "/", label: "Orders", Icon: ShoppingCart },
  { path: "/menu", label: "Menu", Icon: UtensilsCrossed },
];

export default function Layout({ children }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-50 bg-white border-b flex items-center justify-between px-4 h-14">
        <span className="font-bold text-lg">Canteen Admin</span>
        <button onClick={() => setOpen(!open)} className="p-1 text-gray-600">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {open && (
        <nav className="lg:hidden fixed top-14 inset-x-0 z-40 bg-white border-b">
          {navItems.map(({ path, label, Icon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium ${
                location.pathname === path
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-56 bg-white border-r">
        <div className="px-5 py-6">
          <span className="font-bold text-xl">Canteen Admin</span>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(({ path, label, Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === path
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="lg:ml-56 pt-14 lg:pt-0 p-6">
        {children}
      </main>
    </div>
  );
}
