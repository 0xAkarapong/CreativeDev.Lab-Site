"use client";

import { Button } from "@/components/ui/button";
import { Twitter, Linkedin, Link2, Facebook } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const url = typeof window !== "undefined" ? `${window.location.origin}/blog/${slug}` : "";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  const shareLinks = [
    {
      label: "Twitter",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      label: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    },
    {
      label: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground mr-2">Share:</span>
      {shareLinks.map((link) => (
        <Button
          key={link.label}
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={() => window.open(link.href, "_blank", "noopener,noreferrer")}
        >
          <link.icon className="h-4 w-4" />
          <span className="sr-only">Share on {link.label}</span>
        </Button>
      ))}
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={copyToClipboard}
      >
        <Link2 className="h-4 w-4" />
        <span className="sr-only">Copy link</span>
      </Button>
    </div>
  );
}
