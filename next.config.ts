/** @type {import('next').NextConfig} */

import { NextConfig } from "next";

const nextConfig:NextConfig = {
  output: "standalone",
  experimental: {
    dynamicIO: true,
  },
  images: {
    domains: ["3wdqlrl1gchrvttc.public.blob.vercel-storage.com"], // Ajout du domaine
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: "/api/:path*",
  //       // destination: "https://e-commerce-root.vercel.app/api/:path*",
  //       destination: "http://localhost:3000/api/:path*",
  //       // Ajoutez cette condition pour éviter la boucle
  //       has: [
  //         {
  //           type: 'header',
  //           key: 'x-skip-rewrite',
  //           value: '(?!true)',
  //         },
  //       ],
  //     },
  //   ];
  // },
};

export default nextConfig;
