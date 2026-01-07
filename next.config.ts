/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3002",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "54.87.239.229",
        port: "3001",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "jubileegeneral.com.pk",
        port: "",
        pathname: "/jgi-motor/public/**",
      },
      {
        protocol: "https",
        hostname: "motor.jubileegeneral.com.pk",
        port: "",
        pathname: "/motor-backend/**",
      },
    ],
  },
};

export default nextConfig;
