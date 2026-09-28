import os from "node:os";
import type { NextConfig } from "next";

/**
 * Hosts that may load the dev server's own scripts.
 *
 * Next 16 blocks those resources for any other host. The block is silent in the
 * browser: `/_next` 403s, the client runtime never boots, and the page sits there
 * with no console error. Only the server log says why.
 *
 * Loopback covers `localhost`, `127.0.0.1`, and `[::1]`, because some systems
 * resolve `localhost` to IPv6 first. The LAN addresses are whatever this machine has
 * right now, because `next dev` prints that URL and opening it is otherwise the
 * same silent failure. Dev only; production ignores this list.
 */
function devOrigins(): string[] {
  const hosts = new Set<string>(["localhost", "127.0.0.1", "::1", "[::1]"]);
  for (const list of Object.values(os.networkInterfaces())) {
    for (const net of list ?? []) {
      if (net.internal || net.family !== "IPv4") continue;
      hosts.add(net.address);
    }
  }
  return [...hosts];
}

const nextConfig: NextConfig = {
  images: {
    // Default stays 75. 90 is for the court-data portrait, so the optimizer does not
    // soften the only pixels that portrait has.
    qualities: [75, 90],
  },
  allowedDevOrigins: devOrigins(),

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
