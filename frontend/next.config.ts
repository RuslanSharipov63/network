import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  
    turbopack: {
    root: path.join(__dirname), // ← абсолютный путь к папке с next.config.ts
  },
};

export default nextConfig;
