/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // WebP only: AVIF smears fine textures (fur, fleece) into a waxy look
    formats: ['image/webp'],
    qualities: [75, 90],
    // When photography moves to remote storage, add its host here, e.g.:
    // remotePatterns: [{ protocol: 'https', hostname: 'YOUR-PROJECT.supabase.co' }],
  },
  // Nolla is now a one-product store: old shop and product links land on the purchase section
  async redirects() {
    return [
      { source: '/shop', destination: '/#shop', permanent: true },
      { source: '/products/:slug*', destination: '/#shop', permanent: true },
    ];
  },
};

export default nextConfig;
