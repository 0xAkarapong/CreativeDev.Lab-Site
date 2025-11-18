import { ThemeSwitcher } from "./theme-switcher";

export function Footer() {
  return (
    <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
      <p>&copy; {new Date().getFullYear()} CreativeDev.Lab</p>
      <div className="flex gap-4">
        <a
          href="https://x.com"
          target="_blank"
          rel="noreferrer"
          className="hover:underline"
        >
          Twitter
        </a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="hover:underline"
        >
          GitHub
        </a>
      </div>
      <ThemeSwitcher />
    </footer>
  );
}
