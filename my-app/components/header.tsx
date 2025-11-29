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
import { ThemeSwitcher } from "./theme-switcher";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/#solutions", label: "Solutions" },
    { href: "/blog", label: "Blog" },
    { href: "/#contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/60 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 max-w-screen-2xl items-center justify-between px-4 md:px-8">
        {/* Logo - Always visible */}
        <Link href="/" className="flex items-center space-x-2 mr-4">
          <Image
            src="/logo-light.png"
            alt="CreativeDev.Lab"
            width={360}
            height={70}
            className="h-10 w-auto md:h-16 dark:hidden"
          />
          <Image
            src="/logo-dark.png"
            alt="CreativeDev.Lab"
            width={360}
            height={70}
            className="h-10 w-auto md:h-16 hidden dark:block"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
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

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeSwitcher />
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeSwitcher />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="h-9 w-9 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="pr-0 border-l border-white/10 bg-background/80 backdrop-blur-xl w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-8 py-12 px-2">
                  <div className="flex flex-col space-y-6">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="text-2xl font-bold font-heading text-foreground/80 transition-colors hover:text-primary"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
