import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ReactNode } from "react";

interface ProfileSectionCardProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function ProfileSectionCard({
  title,
  description,
  children,
  footer,
}: ProfileSectionCardProps) {
  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && <div className="border-t bg-muted/30 px-6 py-4">{footer}</div>}
    </Card>
  );
}
