import { NavLink, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/hero", label: "Hero slides" },
  { to: "/admin/products", label: "Products" },
];

export default function AdminLayout() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[200px_1fr]">
      <nav className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-card/70 hover:text-foreground"
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div>
        <Outlet />
      </div>
    </div>
  );
}
