/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        pathname: '/**', // Permite todas las rutas en drive.google.com
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/**', // Permite todas las rutas en ik.imagekit.io
      },
    ],
  },
};

export default nextConfig;
