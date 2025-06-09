/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "res.cloudinary.com" },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "laughing-bassoon-6vwgppwx94phg54-3000.app.github.dev",
      ],
      // optional:
      // allowedForwardedHosts: ["localhost:3000", "laughing-bassoon-6vwgppwx94phg54-3000.app.github.dev"],
    },
  },
};

export default nextConfig;
