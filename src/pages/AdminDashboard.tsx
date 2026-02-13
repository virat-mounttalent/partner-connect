import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { FileText, CheckCircle, XCircle, Users } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, approved: 0, rejected: 0, partners: 0 });

  useEffect(() => {
    Promise.all([
      supabase.from("leads").select("status"),
      supabase.from("profiles").select("id"),
    ]).then(([leadsRes, partnersRes]) => {
      const leads = leadsRes.data || [];
      setStats({
        total: leads.length,
        approved: leads.filter((l) => ["Approved", "Disbursed", "Completed"].includes(l.status)).length,
        rejected: leads.filter((l) => l.status === "Rejected").length,
        partners: partnersRes.data?.length || 0,
      });
    });
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <p className="text-muted-foreground">Overview of all platform activity.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Leads" value={stats.total} icon={<FileText className="h-8 w-8" />} />
          <StatCard title="Approved" value={stats.approved} icon={<CheckCircle className="h-8 w-8" />} variant="success" />
          <StatCard title="Rejected" value={stats.rejected} icon={<XCircle className="h-8 w-8" />} variant="destructive" />
          <StatCard title="Total Partners" value={stats.partners} icon={<Users className="h-8 w-8" />} />
        </div>
      </div>
    </DashboardLayout>
  );
}
