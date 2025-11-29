 "use client";

import Link from "next/link";

import { ThemeSwitcher } from "./theme-switcher";

const footerLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/#solutions", label: "Solutions" },
  { href: "/#contact", label: "Contact" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-12">
      <div className="container mx-auto flex max-w-5xl flex-col gap-6 px-5 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="font-bold text-foreground text-lg font-heading">CreativeDev.Lab</p>
          <p>&copy; {currentYear} All rights reserved.</p>
        </div>
        <nav className="flex flex-wrap gap-6">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-primary transition-colors font-medium">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <a
            href="https://twitter.com/creativedevlab"
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary transition-colors font-medium"
          >
            Twitter
          </a>
          <a
            href="https://github.com/creativedevlab"
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary transition-colors font-medium"
          >
            GitHub
          </a>
          <ThemeSwitcher />
        </div>
      </div>
    </footer>
  );
}
