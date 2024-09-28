/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https", // Specify the protocol (http or https)
        hostname: "m.media-amazon.com", // Specify the domain
        port: "", // Leave this empty unless the images come from a non-standard port
        pathname: "/images/**", // Pattern to match image URLs from this domain
      },
    ],
  },
};

export default nextConfig;
