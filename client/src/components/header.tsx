import { Link, useLocation } from "wouter";
import { Search, Moon, Sun, Play, Menu, X, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "./theme-provider";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigation = [
    { name: "Home", path: "/" },
    { name: "Web Series", path: "/series" },
    { name: "Movies", path: "/movies" },
    { name: "Trending", path: "/trending" },
  ];

  const categories = [
    { name: "Action & Thriller", path: "/category/action" },
    { name: "Drama & Romance", path: "/category/drama" },
    { name: "Comedy", path: "/category/comedy" },
    { name: "Horror & Mystery", path: "/category/horror" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        {/* Logo */}
        <Link href="/">
          <div
            className="flex items-center gap-2 text-xl font-bold tracking-tight hover-elevate active-elevate-2 rounded-md px-3 py-2 cursor-pointer"
            data-testid="link-home-logo"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded bg-primary">
              <Play className="w-4 h-4 text-primary-foreground fill-current" />
            </div>
            <span className="hidden sm:inline">StreamVault</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navigation.map((item) => (
            <Link key={item.path} href={item.path}>
              <div
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors hover-elevate active-elevate-2 cursor-pointer ${
                  location === item.path
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
                data-testid={`link-nav-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {item.name}
              </div>
            </Link>
          ))}

          {/* Categories Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="px-3"
                data-testid="button-categories-dropdown"
              >
                Categories
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {categories.map((category) => (
                <DropdownMenuItem key={category.path} asChild>
                  <Link href={category.path}>
                    <div
                      className="w-full cursor-pointer"
                      data-testid={`link-category-${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {category.name}
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Watchlist */}
          <Link href="/watchlist">
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex"
              data-testid="button-watchlist"
            >
              <Bookmark className="h-5 w-5" />
            </Button>
          </Link>

          {/* Search */}
          {searchOpen ? (
            <form
              onSubmit={handleSearch}
              className="hidden sm:flex items-center gap-2 animate-in fade-in slide-in-from-right-5 duration-200"
            >
              <Input
                type="search"
                placeholder="Search shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
                autoFocus
                data-testid="input-search"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(false)}
                data-testid="button-close-search"
              >
                <X className="h-5 w-5" />
              </Button>
            </form>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex"
              data-testid="button-open-search"
            >
              <Search className="h-5 w-5" />
            </Button>
          )}

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            data-testid="button-theme-toggle"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
            data-testid="button-mobile-menu-toggle"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <Input
                type="search"
                placeholder="Search shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-mobile-search"
              />
            </form>

            {navigation.map((item) => (
              <Link key={item.path} href={item.path}>
                <div
                  className={`block px-3 py-2 text-sm font-medium rounded-md hover-elevate active-elevate-2 cursor-pointer ${
                    location === item.path
                      ? "text-foreground bg-accent"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`link-mobile-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {item.name}
                </div>
              </Link>
            ))}

            {/* Watchlist Link */}
            <Link href="/watchlist">
              <div
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover-elevate active-elevate-2 cursor-pointer ${
                  location === "/watchlist"
                    ? "text-foreground bg-accent"
                    : "text-muted-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
                data-testid="link-mobile-watchlist"
              >
                <Bookmark className="h-4 w-4" />
                My Watchlist
              </div>
            </Link>

            <div className="pt-2 border-t border-border">
              <p className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                Categories
              </p>
              {categories.map((category) => (
                <Link key={category.path} href={category.path}>
                  <div
                    className="block px-3 py-2 text-sm text-muted-foreground rounded-md hover-elevate active-elevate-2 cursor-pointer"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid={`link-mobile-category-${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {category.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
