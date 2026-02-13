import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  variant?: "default" | "success" | "warning" | "destructive";
}

export function StatCard({ title, value, icon, variant = "default" }: StatCardProps) {
  const variantClasses = {
    default: "border-border",
    success: "border-success/30 bg-success/5",
    warning: "border-warning/30 bg-warning/5",
    destructive: "border-destructive/30 bg-destructive/5",
  };

  return (
    <div className={`rounded-xl border p-5 bg-card animate-fade-in ${variantClasses[variant]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className="text-muted-foreground/50">{icon}</div>
      </div>
    </div>
  );
}
