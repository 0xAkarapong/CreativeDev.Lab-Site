"use client";

import Image from "next/image";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { AuthButton } from "./auth-button";
import { hasEnvVars } from "@/lib/utils";
import { EnvVarWarning } from "./env-var-warning";
import { Suspense } from "react";
import { ThemeSwitcher } from "./theme-switcher";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/#solutions", label: "Solutions" },
    { href: "/blog", label: "Blog" },
    { href: "/#contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 max-w-screen-2xl items-center px-4 md:px-8">
        <div className="mr-8 hidden md:flex">
          <Link href="/" className="mr-8 flex items-center space-x-2">
            <Image
              src="/logo-light.png"
              alt="CreativeDev.Lab"
              width={360}
              height={70}
              className="h-16 w-auto dark:hidden"
            />
            <Image
              src="/logo-dark.png"
              alt="CreativeDev.Lab"
              width={360}
              height={70}
              className="h-16 w-auto hidden dark:block"
            />
          </Link>
          <NavigationMenu>
            <NavigationMenuList className="gap-2">
              {navItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink asChild>
                    <Link href={item.href} className={navigationMenuTriggerStyle()}>
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-4 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Add search or other items here if needed */}
          </div>
          <nav className="flex items-center gap-4">
            {!hasEnvVars ? (
              <EnvVarWarning />
            ) : (
              <Suspense>
                <AuthButton />
              </Suspense>
            )}
            <ThemeSwitcher />
          </nav>
        </div>
        <div className="md:hidden flex items-center gap-4 ml-auto">
             <ThemeSwitcher />
             <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="h-9 w-9 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="pr-0">
                <div className="flex flex-col gap-6 py-6">
                  <Link
                    href="/"
                    className="flex items-center space-x-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <Image
                      src="/logo-light.png"
                      alt="CreativeDev.Lab"
                      width={125}
                      height={48}
                      className="h-12 w-auto dark:hidden"
                    />
                    <Image
                      src="/logo-dark.png"
                      alt="CreativeDev.Lab"
                      width={125}
                      height={48}
                      className="h-12 w-auto hidden dark:block"
                    />
                  </Link>
                  <div className="flex flex-col space-y-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="text-base font-medium text-foreground/70 transition-colors hover:text-foreground"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  <div className="mt-6">
                     {!hasEnvVars ? (
                        <EnvVarWarning />
                      ) : (
                        <Suspense>
                          <AuthButton />
                        </Suspense>
                      )}
                  </div>
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
