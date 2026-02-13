import { Badge } from "@/components/ui/badge";

const statusStyles: Record<string, string> = {
  New: "bg-info/10 text-info border-info/20",
  "In Progress": "bg-warning/10 text-warning border-warning/20",
  Approved: "bg-success/10 text-success border-success/20",
  Rejected: "bg-destructive/10 text-destructive border-destructive/20",
  Disbursed: "bg-accent/10 text-accent border-accent/20",
  Completed: "bg-success/10 text-success border-success/20",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={`font-medium ${statusStyles[status] || ""}`}>
      {status}
    </Badge>
  );
}
