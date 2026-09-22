/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Only trusted image hosts (previously '**' allowed any site).
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'online-market-smoky.vercel.app' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

export default nextConfig;
