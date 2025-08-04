import type { ReactNode } from 'react';

interface InfoItemProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}

export default function InfoItem({ icon, title, children }: InfoItemProps) {
  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-muted-foreground">{title}</p>
        <p className="text-lg font-medium">{children}</p>
      </div>
    </div>
  );
}