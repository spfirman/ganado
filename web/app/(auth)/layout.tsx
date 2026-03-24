import { AuthProvider } from "../lib/auth-context";

export const dynamic = "force-dynamic";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
