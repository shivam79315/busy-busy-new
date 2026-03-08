import { Link } from "react-router-dom";

const footerLinks = [
  { id: "home", label: "Home", to: "/" },
  { id: "products", label: "Products", to: "/products" },
  { id: "wishlist", label: "Wishlist", to: "/wishlist" },
  { id: "orders", label: "Orders", to: "/orders" },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-8 border-t border-border/60 bg-background/70 backdrop-blur-md" data-testid="app-footer">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 md:px-10" data-testid="footer-content-grid">
        <div className="space-y-2" data-testid="footer-brand-section">
          <p className="text-2xl font-semibold text-foreground" data-testid="footer-brand-name">VerdantCart</p>
          <p className="max-w-sm text-sm text-muted-foreground" data-testid="footer-brand-description">
            Modern essentials curated with a calm shopping flow, across every screen size.
          </p>
        </div>

        <div className="space-y-3" data-testid="footer-links-section">
          <p className="text-sm font-medium text-foreground" data-testid="footer-links-title">Quick links</p>
          <ul className="grid grid-cols-2 gap-2" data-testid="footer-links-list">
            {footerLinks.map((item) => (
              <li key={item.id} data-testid={`footer-link-item-${item.id}`}>
                <Link to={item.to} className="text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground" data-testid={`footer-link-${item.id}`}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2" data-testid="footer-contact-section">
          <p className="text-sm font-medium text-foreground" data-testid="footer-contact-title">Shopping support</p>
          <p className="text-sm text-muted-foreground" data-testid="footer-contact-email">support@verdantcart.com</p>
          <p className="text-sm text-muted-foreground" data-testid="footer-contact-hours">Mon-Sun · 9:00 AM - 9:00 PM</p>
        </div>
      </div>

      <div className="border-t border-border/60 px-4 py-4 text-center text-xs text-muted-foreground sm:px-6 md:px-10" data-testid="footer-copyright">
        © {currentYear} VerdantCart. All rights reserved.
      </div>
    </footer>
  );
};
