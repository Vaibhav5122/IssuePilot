import { GuestGuard } from "@/components/auth/guestGuard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GuestGuard>{children}</GuestGuard>;
}
