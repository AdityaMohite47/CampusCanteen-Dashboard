import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-6xl font-bold text-gray-200">404</h1>
      <p className="text-gray-500 mt-3 mb-6">Page not found</p>
      <Link to="/" className="text-sm text-gray-900 underline hover:text-gray-600">
        Back to Orders
      </Link>
    </div>
  );
}
