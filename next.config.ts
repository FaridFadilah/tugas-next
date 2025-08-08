import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  trailingSlash: false,
  redirects: async () => {
    return [];
  },
};

export default nextConfig;
