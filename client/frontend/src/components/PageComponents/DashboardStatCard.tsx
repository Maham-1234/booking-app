import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface DashboardStatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export default function DashboardStatCard({
  label,
  value,
  icon: Icon,
  color,
  bgColor,
}: DashboardStatCardProps) {
  return (
    <Card className="glass-card border-0">
      <CardContent className="p-6 flex items-center space-x-4">
        <div
          className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center ${bgColor}`}
        >
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
