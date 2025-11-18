import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const remotePatterns =
  supabaseUrl && supabaseUrl.startsWith("http")
    ? [
        {
          protocol: "https",
          hostname: new URL(supabaseUrl).hostname,
          pathname: "/storage/v1/object/public/**",
        },
      ]
    : [];

remotePatterns.push({
  protocol: "https",
  hostname: "images.unsplash.com",
});

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns,
  },
};

export default nextConfig;
