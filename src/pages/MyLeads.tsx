import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function MyLeads() {
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
      .then(({ data }) => {
        setLeads(data || []);
        setLoading(false);
      });
  }, [user]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">My Leads</h2>
          <p className="text-muted-foreground">All leads you have submitted.</p>
        </div>
        <div className="bg-card rounded-xl border">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : leads.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No leads submitted yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Remarks</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.customer_name}</TableCell>
                    <TableCell>{lead.customer_mobile}</TableCell>
                    <TableCell>{lead.lead_type}</TableCell>
                    <TableCell>{lead.customer_city}</TableCell>
                    <TableCell><StatusBadge status={lead.status} /></TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">{lead.remarks}</TableCell>
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
