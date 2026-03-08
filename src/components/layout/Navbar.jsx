import { Heart, LogOut, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ThemeToggle } from "./ThemeToggle";

const navLinkClass = ({ isActive }) =>
  `rounded-full px-3 py-1 text-sm transition-colors duration-300 ${
    isActive
      ? "bg-primary/15 text-foreground"
      : "text-muted-foreground hover:text-foreground"
  }`;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hardcoded auth state
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState({ name: "John Doe" });

  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const search = new URLSearchParams(location.search).get("search") || "";
    if (location.pathname === "/products") {
      setSearchTerm(search);
    }
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  const submitSearch = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim());
    }
    navigate(`/products${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="fixed left-1/2 top-3 z-50 w-[96%] max-w-7xl -translate-x-1/2 rounded-3xl border border-border/60 bg-background/80 px-3 py-3 shadow-lg shadow-primary/10 backdrop-blur-xl md:top-4 md:rounded-full md:px-6">
      <div className="flex flex-wrap items-center gap-2 md:gap-4">
        <Link
          to="/"
          className="shrink-0 text-xl font-bold tracking-tight text-foreground transition-colors duration-300 hover:text-primary"
        >
          VerdantCart
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/products" className={navLinkClass}>
            Products
          </NavLink>
          <NavLink to="/orders" className={navLinkClass}>
            Orders
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-1 md:hidden">
          <Button asChild size="icon" variant="ghost" className="rounded-full">
            <Link to="/wishlist">
              <Heart className="h-4 w-4" />
            </Link>
          </Button>

          <Button asChild size="icon" variant="ghost" className="rounded-full">
            <Link to="/cart">
              <ShoppingBag className="h-4 w-4" />
            </Link>
          </Button>

          <ThemeToggle />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>

        <form
          onSubmit={submitSearch}
          className="relative order-3 mt-1 w-full md:order-none md:mt-0 md:ml-auto md:max-w-sm"
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search products"
            className="h-10 rounded-full border border-border/70 bg-secondary/55 pl-9"
          />
        </form>

        <div className="hidden items-center gap-1 md:flex md:gap-2">
          <Button asChild size="icon" variant="ghost" className="rounded-full">
            <Link to="/wishlist">
              <Heart className="h-4 w-4" />
            </Link>
          </Button>

          <Button asChild size="icon" variant="ghost" className="rounded-full">
            <Link to="/cart">
              <ShoppingBag className="h-4 w-4" />
            </Link>
          </Button>

          <ThemeToggle />

          {isAuthenticated ? (
            <>
              <span className="hidden rounded-full bg-secondary/70 px-3 py-2 text-xs text-muted-foreground md:inline-flex">
                {user?.name}
              </span>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" className="rounded-full">
                <Link to="/login">Login</Link>
              </Button>

              <Button asChild className="rounded-full">
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mt-3 space-y-3 rounded-2xl border border-border/60 bg-card/80 p-3 md:hidden">
          <div className="grid grid-cols-3 gap-2">
            <Button asChild variant="ghost" className="rounded-xl">
              <Link to="/">Home</Link>
            </Button>

            <Button asChild variant="ghost" className="rounded-xl">
              <Link to="/products">Products</Link>
            </Button>

            <Button asChild variant="ghost" className="rounded-xl">
              <Link to="/orders">Orders</Link>
            </Button>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary/70 px-3 py-2 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                {user?.name}
              </span>

              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/login">Login</Link>
              </Button>

              <Button asChild className="rounded-full">
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;