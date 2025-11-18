import { Button } from "./ui/button";

export function Hero() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-gray-50">
        Creative Development Lab
      </h1>
      <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
        The fastest way to build modern web applications.
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Button asChild>
          <a href="/login">Get Started</a>
        </Button>
      </div>
    </div>
  );
}
