import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Next 16 blocks its own dev resources when the page is reached from a host it does
   * not consider the dev origin — including `127.0.0.1`. The block is silent in the
   * browser: `/_next/webpack-hmr` 403s, the client runtime never boots, and the page
   * sits there with no console error to explain it. Only the server log says why.
   *
   * Both loopback names, so either URL works and the trap is closed.
   */
  allowedDevOrigins: ["127.0.0.1", "localhost"],

  /**
   * There is deliberately no `output: "export"` here.
   *
   * The portal this repo replaces was a static export. Its entire server response was
   * 2,856 bytes whose only body content was a spinner and the words "Loading, please
   * wait...". Every cause list, notice and case record was invisible to a text browser,
   * to a search engine, and to anyone whose JavaScript had not finished booting.
   *
   * Server rendering is the product requirement, not a preference. `scripts/check-ssr.mjs`
   * enforces it. Adding a static export here would pass that gate by removing the server,
   * so do not add one.
   */
};

export default nextConfig;
