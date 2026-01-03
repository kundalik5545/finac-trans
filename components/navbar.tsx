import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

export function Navbar() {
  const navItems = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Transactions",
      href: "/transactions",
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Upload",
      href: "/upload",
    },
  ]
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">Finac</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden items-center space-x-6 md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button variant="ghost" size="sm">
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex items-center space-x-4">
            <Button asChild size="sm" className="hidden sm:flex">
              <Link href="/transactions">Get Started</Link>
            </Button>
            {/* Mobile menu button - can be enhanced later */}
            <Button asChild size="sm" variant="ghost" className="md:hidden">
              <Link href="/transactions">Menu</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
