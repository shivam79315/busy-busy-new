import { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

import heroBg from "@/assets/products/hero-bg.png";
import whiteShoe from "@/assets/products/verdant-w-g.png";
import blackShoe from "@/assets/products/black.png";
import cremeShoe from "@/assets/products/creme-45-deg.png";
import greenShoe from "@/assets/products/green-white-diagonal.png";

const slides = [
  {
    id: "white",
    badge: "New Arrivals",
    title: "Clean Slate",
    description: "A minimal white colorway built for everyday wear, from desk to street.",
    image: whiteShoe,
  },
  {
    id: "black",
    badge: "Best Seller",
    title: "Midnight Edition",
    description: "Understated black tones with a low-key finish that goes with everything.",
    image: blackShoe,
  },
  {
    id: "creme",
    badge: "Staff Pick",
    title: "Desert Creme",
    description: "Warm neutral tones and a soft, premium finish for a calmer look.",
    image: cremeShoe,
  },
  {
    id: "green",
    badge: "Limited Drop",
    title: "Forest Line",
    description: "Bold green detailing that matches the VerdantCart palette, made to stand out.",
    image: greenShoe,
  },
];

export default function HeroCarousel() {
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <section className="hero-fade-up relative isolate min-h-[520px] overflow-hidden rounded-[2.2rem] border border-border/70 px-6 py-12 shadow-2xl shadow-primary/10 md:min-h-[600px] md:px-14 md:py-16" data-testid="home-hero-section">
      <img src={heroBg} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />

      <Carousel setApi={setApi} opts={{ loop: true }} className="relative z-10 flex h-full flex-col justify-center" data-testid="home-hero-carousel">
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id} data-testid={`home-hero-slide-${slide.id}`}>
              <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
                <div className="space-y-6 text-center lg:text-left">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-neutral-200">
                    <Sparkles className="h-4 w-4 text-primary" />
                    {slide.badge}
                  </span>
                  <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                    {slide.title}
                  </h1>
                  <p className="mx-auto max-w-md text-sm text-neutral-300 md:text-lg lg:mx-0">
                    {slide.description}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                    <Button asChild className="h-11 rounded-full px-6">
                      <Link to="/products">
                        Shop now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-11 rounded-full border-white/20 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white">
                      <Link to="/products">Explore collection</Link>
                    </Button>
                  </div>
                </div>

                <div className="pointer-events-none relative h-64 w-full sm:h-80 lg:h-[26rem]">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="absolute bottom-[20%] left-[4%] w-[100%] max-w-xs object-contain mix-blend-screen drop-shadow-2xl sm:right-[0%] sm:max-w-md lg:left-[-5%]"
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 border-white/20 bg-white/5 text-white hover:bg-white/15 hover:text-white md:left-4" />
        <CarouselNext className="right-2 border-white/20 bg-white/5 text-white hover:bg-white/15 hover:text-white md:right-4" />
      </Carousel>

      <div className="relative z-10 mt-8 flex items-center justify-center gap-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            data-testid={`home-hero-dot-${index}`}
            className={cn(
              "h-1.5 rounded-full transition-all",
              index === current ? "w-6 bg-primary" : "w-1.5 bg-white/25"
            )}
          />
        ))}
      </div>
    </section>
  );
}
