
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wallet, User } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { LogoutButton, LogoutButtonIcon } from "@/components/logout-button";


export async function Navbar() {
  // Get session to check authentication status
  const session = await auth.api.getSession({
    headers: await headers(),
  });



  const publicNavItems = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "About",
      href: "/about",
    },
  ];

  const protectedNavItems = [
    {
      label: "Transactions",
      href: "/transactions",
    },
    {
      label: "Categories",
      href: "/categories",
    },
    {
      label: "Upload",
      href: "/upload",
    },
  ];

  // If user is authenticated, show protected nav items, otherwise show public nav items
  const navItems = session?.user ? protectedNavItems : publicNavItems;


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

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {session?.user ? (
              <>
                <div className="hidden items-center gap-2 sm:flex">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {session?.user?.name || session?.user?.email}
                  </span>
                </div>
                <LogoutButton className="hidden sm:flex" />
                <LogoutButtonIcon className="sm:hidden" />
              </>
            ) : (
              <>
                <Button asChild size="sm" variant="ghost" className="hidden sm:flex">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild size="sm" className="hidden sm:flex">
                  <Link href="/register">Sign Up</Link>
                </Button>
                <Button asChild size="sm" variant="ghost" className="sm:hidden">
                  <Link href="/login">Login</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}