import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Dashboard() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("leads")
      .select("*")
      .eq("partner_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => {
        setLeads(data || []);
        setLoading(false);
      });
  }, [user]);

  const totalLeads = leads.length;
  const approved = leads.filter((l) => l.status === "Approved" || l.status === "Disbursed" || l.status === "Completed").length;
  const rejected = leads.filter((l) => l.status === "Rejected").length;
  const pending = leads.filter((l) => l.status === "New" || l.status === "In Progress").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back! Here's your lead overview.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Leads" value={totalLeads} icon={<FileText className="h-8 w-8" />} />
          <StatCard title="Approved" value={approved} icon={<CheckCircle className="h-8 w-8" />} variant="success" />
          <StatCard title="Rejected" value={rejected} icon={<XCircle className="h-8 w-8" />} variant="destructive" />
          <StatCard title="Pending" value={pending} icon={<Clock className="h-8 w-8" />} variant="warning" />
        </div>

        <div className="bg-card rounded-xl border">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Recent Leads</h3>
          </div>
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : leads.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No leads yet. Submit your first lead!</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.customer_name}</TableCell>
                    <TableCell>{lead.lead_type}</TableCell>
                    <TableCell>{lead.customer_city}</TableCell>
                    <TableCell><StatusBadge status={lead.status} /></TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
