"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/registry/new-york-v4/ui/button";
import { AuthNav } from "@/components/auth/auth-nav";
import { ModeSwitcher } from "@/components/mode-switcher";
import { useCallback } from "react";

// Navigation links for demonstration; adjust as needed
const NAV_LINKS = [
  { href: "#services", label: "Services", id: "services" },
  { href: "#how-it-works", label: "How it Works", id: "how-it-works" },
  { href: "#testimonials", label: "Reviews", id: "testimonials" },
  { href: "#contact", label: "Contact", id: "contact" },
];

export function TopNavbar({
  user,
  isAuthenticated = false,
}: {
  user?: { name: string };
  isAuthenticated?: boolean;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Smooth scroll handler
  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    const offset = 80; // px, adjust as needed for your navbar height
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Search className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">Timeio</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={item.id ? (e) => handleNavClick(e, item.id) : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <ModeSwitcher />
            <AuthNav user={isAuthenticated ? user : undefined} />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              {NAV_LINKS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  onClick={item.id ? (e) => handleNavClick(e, item.id) : undefined}
                >
                  {item.label}
                </a>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t">
                <ModeSwitcher />
                <AuthNav user={isAuthenticated ? user : undefined} />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
