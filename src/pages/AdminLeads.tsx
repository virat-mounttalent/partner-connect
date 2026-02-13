import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

const STATUSES = ["New", "In Progress", "Approved", "Rejected", "Disbursed", "Completed"];

export default function AdminLeads() {
  const { toast } = useToast();
  const [leads, setLeads] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    let query = supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (filterType !== "all") query = query.eq("lead_type", filterType);
    if (filterStatus !== "all") query = query.eq("status", filterStatus);
    const { data: leadsData } = await query;

    const { data: profilesData } = await supabase.from("profiles").select("*");
    const profileMap: Record<string, any> = {};
    profilesData?.forEach((p) => { profileMap[p.user_id] = p; });

    setLeads(leadsData || []);
    setProfiles(profileMap);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [filterType, filterStatus]);

  const updateStatus = async (leadId: string, newStatus: string) => {
    const { error } = await supabase.from("leads").update({ status: newStatus }).eq("id", leadId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Status Updated" });
      fetchData();
    }
  };

  const filtered = leads.filter((l) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return l.customer_name.toLowerCase().includes(s) ||
      profiles[l.partner_id]?.name?.toLowerCase().includes(s);
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">All Leads</h2>
          <p className="text-muted-foreground">Manage and update lead statuses.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Input
            placeholder="Search by customer or partner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Loan">Loan</SelectItem>
              <SelectItem value="Insurance">Insurance</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="bg-card rounded-xl border overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No leads found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Update Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((lead) => {
                  const partner = profiles[lead.partner_id];
                  return (
                    <TableRow key={lead.id}>
                      <TableCell className="text-sm">
                        <div className="font-medium">{partner?.name || "—"}</div>
                        <div className="text-muted-foreground text-xs">{partner?.email}</div>
                      </TableCell>
                      <TableCell className="font-medium">{lead.customer_name}</TableCell>
                      <TableCell>{lead.customer_mobile}</TableCell>
                      <TableCell>{lead.lead_type}</TableCell>
                      <TableCell>{lead.customer_city}</TableCell>
                      <TableCell><StatusBadge status={lead.status} /></TableCell>
                      <TableCell>
                        <Select value={lead.status} onValueChange={(v) => updateStatus(lead.id, v)}>
                          <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {STATUSES.map((s) => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
