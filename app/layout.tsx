/** Required when `app/not-found.tsx` exists. Locale routes use `app/[locale]/layout.tsx` for `<html>`. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
