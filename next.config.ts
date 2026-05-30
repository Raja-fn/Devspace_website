import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "hybvsgxqstnxamdkijsk.supabase.co",
            },
        ],
    },
};

export default nextConfig;