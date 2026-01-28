import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "**.algeriavirtualtravel.com",
      },
      {
        protocol: "https",
        hostname: "algeriavirtualtravel.s3.eu-west-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "146771867.fs1.hubspotusercontent-eu1.net",
        pathname: "/**",
      },
    ],
  },
};
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
