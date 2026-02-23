import type { NextConfig } from "next";
// eslint-disable-next-line @typescript-eslint/no-require-transforms
const withMDX = require("@next/mdx")();

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
    ],
  },
};

export default withMDX(nextConfig);
