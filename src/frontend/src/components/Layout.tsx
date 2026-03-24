import { Button } from "@/components/ui/button";
import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { Heart, Menu, Plus, X } from "lucide-react";
import { useState } from "react";
import LoginButton from "./LoginButton";

export default function Layout() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => currentPath === path;

  const navItems = [
    { path: "/", label: "Browse" },
    { path: "/my-listings", label: "My Listings" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <img
                src="/assets/generated/tradition-logo-mark.dim_200x200.png"
                alt="tradition Logo"
                className="h-10 w-10 object-contain"
              />
              <div className="flex flex-col items-start">
                <span className="text-xl font-bold text-foreground">
                  tradition
                </span>
                <span className="text-xs text-muted-foreground hidden sm:block">
                  Buy &amp; Sell Locally
                </span>
              </div>
            </button>

            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate({ to: item.path })}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive(item.path)
                      ? "text-primary border-b-2 border-primary pb-1"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <LoginButton />
              <Button
                onClick={() => navigate({ to: "/post" })}
                className="ml-2"
              >
                <Plus className="mr-2 h-4 w-4" />
                Post Listing
              </Button>
            </nav>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-foreground"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t border-border/40">
              <div className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => {
                      navigate({ to: item.path });
                      setMobileMenuOpen(false);
                    }}
                    className={`text-left px-4 py-2 text-sm font-medium transition-colors hover:text-primary ${
                      isActive(item.path)
                        ? "text-primary bg-accent/10"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <div className="px-4">
                  <LoginButton />
                </div>
                <Button
                  onClick={() => {
                    navigate({ to: "/post" });
                    setMobileMenuOpen(false);
                  }}
                  className="mx-4"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Post Listing
                </Button>
              </div>
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>© 2026. Built with</span>
              <Heart className="h-4 w-4 text-destructive fill-destructive" />
              <span>using</span>
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </div>
            <div className="text-sm text-muted-foreground">
              tradition - Your Local Marketplace
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
