import { Card, CardContent } from "@/components/ui/card";
import { type LucideIcon } from 'lucide-react';

interface StatsCardProps {
  Icon: LucideIcon;
  value: string;
  label: string;
}

export function StatsCard({ Icon, value, label }: StatsCardProps) {
  return (
    <Card className="text-center bg-background/50 border-0 shadow-sm">
      <CardContent className="pt-6">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-3xl font-bold mb-2">{value}</h3>
        <p className="text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}