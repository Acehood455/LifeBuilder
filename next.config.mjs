/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {hostname: "res.cloudinary.com"}
        ]
    },
    experimental: {
     serverActions: {
      allowedHosts: [
        "localhost:3000",
        "https://laughing-bassoon-6vwgppwx94phg54-3000.app.github.dev/",
      ],
    },
  },
};

export default nextConfig;
