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
    <footer className="w-full border-t py-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-5 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-foreground">CreativeDev.Lab</p>
          <p>&copy; {currentYear} All rights reserved.</p>
        </div>
        <nav className="flex flex-wrap gap-4">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <a
            href="https://x.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
          >
            Twitter
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
          >
            GitHub
          </a>
          <ThemeSwitcher />
        </div>
      </div>
    </footer>
  );
}
