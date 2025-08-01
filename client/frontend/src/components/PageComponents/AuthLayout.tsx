import type { ReactNode } from 'react';

type AuthLayoutProps = {
  aside: ReactNode;
  children: ReactNode;
};

export const AuthLayout = ({ aside, children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex">
      {aside}
      <main className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-background to-muted/30">
        {children}
      </main>
    </div>
  );
};