import { AuthShell } from '@/components/auth/AuthShell';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TCI - Portal',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthShell>{children}</AuthShell>;
}
