"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/registry/new-york-v4/ui/button";
import { ModeSwitcher } from "@/components/mode-switcher";

// Admin navigation links
const ADMIN_NAV_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/profile", label: "Profile" },
];

export function AdminNavbar({
  user,
}: {
  user?: { name?: string } | null;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    function signOut(arg0: { callbackUrl: string; }): void {
        throw new Error("Function not implemented.");
    }

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/admin" className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <LayoutDashboard className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">Admin Dashboard</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {ADMIN_NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors ${
                  pathname === item.href
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <ModeSwitcher />
            <div className="flex items-center space-x-2">
              {user?.name && (
                <span className="text-sm text-muted-foreground">
                  {user.name}
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center space-x-1"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
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
              {ADMIN_NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-colors ${
                    pathname === item.href
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t">
                <ModeSwitcher />
                {user?.name && (
                  <span className="text-sm text-muted-foreground">
                    {user.name}
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center justify-start space-x-1"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
