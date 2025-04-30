import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["api.dental-data.live", "picsum.photos", "img.clerk.com", "api.dentaauto.com", "fra.cloud.appwrite.io"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb"
    }
  }
};

export default nextConfig;
