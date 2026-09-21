import "./app.css";

/**
 * Pass-through root. The document language is set in `[locale]/layout.tsx` because it
 * has to follow the URL, on the server.
 *
 * This file still has to exist: Next renders `/_not-found` and `/_global-error` outside
 * the locale tree, and those pages need a root layout. CSS is imported here so they
 * share the same sheet as every locale page.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
