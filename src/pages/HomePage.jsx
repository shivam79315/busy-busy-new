import { ArrowRight, ShieldCheck, Sparkles, Truck, WandSparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useAuth } from "@/context/AuthContext";

const categoryHighlights = [
  {
    id: "audio",
    title: "Immersive Audio",
    description: "Headphones and earbuds crafted for focus and travel.",
    image: "https://images.unsplash.com/photo-1605170876472-db58e15c430e?q=85&w=800&auto=format&fit=crop",
  },
  {
    id: "skincare",
    title: "Balanced Skincare",
    description: "Gentle essentials with clean ingredients.",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=85&w=800&auto=format&fit=crop",
  },
];

const trustPoints = [
  {
    id: "shipping",
    title: "Fast dispatch",
    text: "Orders ship within 24 hours with transparent tracking.",
    icon: Truck,
  },
  {
    id: "quality",
    title: "Quality checked",
    text: "Every product is hand-reviewed before listing.",
    icon: ShieldCheck,
  },
  {
    id: "curation",
    title: "Curated drops",
    text: "Fresh products are added weekly across each category.",
    icon: WandSparkles,
  },
];

const quickStats = [
  { id: "products", value: "120+", label: "Products available" },
  { id: "satisfaction", value: "98%", label: "Customer satisfaction" },
  { id: "shipping", value: "24h", label: "Average dispatch time" },
  { id: "support", value: "7/7", label: "Support coverage" },
];

const editorialPicks = [
  {
    id: "pick-audio",
    title: "Studio-ready audio",
    text: "Noise-control devices designed for remote work and travel.",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=85&w=800&auto=format&fit=crop",
  },
  {
    id: "pick-watch",
    title: "Modern watch line",
    text: "Precision timepieces that blend minimal design and durability.",
    image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=85&w=800&auto=format&fit=crop",
  },
  {
    id: "pick-footwear",
    title: "Everyday footwear",
    text: "Comfort-first silhouettes made for city movement.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=85&w=800&auto=format&fit=crop",
  },
  {
    id: "pick-skincare",
    title: "Skincare ritual",
    text: "Hydration-focused formulas for cleaner, brighter skin.",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=85&w=800&auto=format&fit=crop",
  },
];

export default function HomePage() {

  const {user} = useAuth();

  return (
    <div className="space-y-20 pb-6" data-testid="home-page">
      <section className="hero-fade-up relative overflow-hidden rounded-[2.2rem] border border-border/70 bg-card/70 px-6 py-16 shadow-2xl shadow-primary/10 backdrop-blur-xl md:px-14 md:py-24" data-testid="home-hero-section">
        <div className="float-gentle absolute -right-16 top-0 h-48 w-48 rounded-full bg-primary/15 blur-3xl" />
        <div className="pulse-soft absolute -bottom-14 left-0 h-44 w-44 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative z-10 max-w-3xl space-y-8">
          <span className="hero-fade-up delay-1 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-4 py-2 text-xs font-medium text-muted-foreground" data-testid="home-hero-badge">
            <Sparkles className="h-4 w-4 text-primary" />
            Neo-Natural shopping experience
          </span>
          <h1 className="hero-fade-up delay-2 text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl" data-testid="home-hero-title">
            Shop modern essentials with a refined and calm visual flow.
          </h1>
          <p className="hero-fade-up delay-3 max-w-2xl text-sm text-muted-foreground md:text-lg" data-testid="home-hero-description">
            Discover curated products in audio, footwear, watches, and skincare—built for users who want elegant design and frictionless checkout.
          </p>

          <div className="hero-fade-up delay-3 flex flex-wrap items-center gap-3" data-testid="home-hero-actions">
            <Button asChild className="h-11 rounded-full px-6" data-testid="home-shop-now-button">
              <Link to="/products">
                Shop now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            {!user && (
            <Button asChild variant="outline" className="h-11 rounded-full px-6" data-testid="home-create-account-button">
              <Link to="/register">Create account</Link>
            </Button>
            )}
          </div>
        </div>
      </section>

      <section className="home-section-reveal grid grid-cols-2 gap-4 rounded-3xl border border-border/60 bg-card/70 p-6 md:grid-cols-4" style={{ animationDelay: "0.1s" }} data-testid="home-stats-section">
        {quickStats.map((stat, index) => (
          <div key={stat.id} className="home-stat-pop home-glow-hover space-y-1 rounded-2xl border border-border/50 bg-background/50 p-4" style={{ animationDelay: `${0.08 * index}s` }} data-testid={`home-stat-card-${stat.id}`}>
            <p className="text-2xl font-semibold text-foreground" data-testid={`home-stat-value-${stat.id}`}>{stat.value}</p>
            <p className="text-xs text-muted-foreground md:text-sm" data-testid={`home-stat-label-${stat.id}`}>{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="home-section-reveal space-y-8" style={{ animationDelay: "0.16s" }} data-testid="home-categories-section">
        <div className="space-y-2" data-testid="home-categories-header">
          <h2 className="text-base md:text-lg font-medium text-primary" data-testid="home-categories-eyebrow">Curated categories</h2>
          <p className="text-sm text-muted-foreground md:text-base" data-testid="home-categories-description">Every category is hand-picked to preserve product quality and visual balance.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4" data-testid="home-categories-grid">
          {categoryHighlights.map((category, index) => (
            <Card key={category.id} className="card-rise home-glow-hover overflow-hidden border-border/60 bg-card/70" style={{ animationDelay: `${index * 0.12}s` }} data-testid={`home-category-card-${category.id}`}>
              <div className="aspect-[4/3] overflow-hidden">
                <img src={category.image} alt={category.title} className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105" data-testid={`home-category-image-${category.id}`} />
              </div>
              <CardContent className="space-y-2 p-5">
                <h3 className="text-2xl font-semibold text-foreground" data-testid={`home-category-title-${category.id}`}>{category.title}</h3>
                <p className="text-sm text-muted-foreground" data-testid={`home-category-text-${category.id}`}>{category.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="home-section-reveal space-y-6" style={{ animationDelay: "0.22s" }} data-testid="home-trust-section">
        <div className="space-y-2" data-testid="home-trust-header">
          <h2 className="text-base md:text-lg font-medium text-primary" data-testid="home-trust-eyebrow">Why shoppers stay</h2>
          <p className="text-sm text-muted-foreground md:text-base" data-testid="home-trust-description">Built to make browsing, saving and ordering genuinely effortless.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3" data-testid="home-trust-grid">
          {trustPoints.map((point) => {
            const Icon = point.icon;
            return (
              <Card key={point.id} className="home-glow-hover border-border/60 bg-card/70" data-testid={`home-trust-card-${point.id}`}>
                <CardContent className="space-y-3 p-5">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary" data-testid={`home-trust-icon-${point.id}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-2xl font-semibold text-foreground" data-testid={`home-trust-title-${point.id}`}>{point.title}</h3>
                  <p className="text-sm text-muted-foreground" data-testid={`home-trust-text-${point.id}`}>{point.text}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="home-section-reveal space-y-6" style={{ animationDelay: "0.28s" }} data-testid="home-editorial-section">
        <div className="flex flex-wrap items-end justify-between gap-3" data-testid="home-editorial-header">
          <div className="space-y-2">
            <h2 className="text-base md:text-lg font-medium text-primary" data-testid="home-editorial-eyebrow">Editorial picks</h2>
            <p className="text-sm text-muted-foreground md:text-base" data-testid="home-editorial-description">A hand-selected set of products getting attention this week.</p>
          </div>
          <Button asChild variant="outline" className="rounded-full" data-testid="home-editorial-view-all-button">
            <Link to="/products">View all products</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2" data-testid="home-editorial-grid">
          {editorialPicks.map((pick) => (
            <Card key={pick.id} className="home-glow-hover overflow-hidden border-border/60 bg-card/70" data-testid={`home-editorial-card-${pick.id}`}>
              <div className="aspect-[16/9] overflow-hidden">
                <img src={pick.image} alt={pick.title} className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105" data-testid={`home-editorial-image-${pick.id}`} />
              </div>
              <CardContent className="space-y-2 p-5">
                <h3 className="text-2xl font-semibold text-foreground" data-testid={`home-editorial-title-${pick.id}`}>{pick.title}</h3>
                <p className="text-sm text-muted-foreground" data-testid={`home-editorial-text-${pick.id}`}>{pick.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
