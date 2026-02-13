import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function SubmitLead() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    lead_type: "",
    customer_name: "",
    customer_mobile: "",
    customer_city: "",
    remarks: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.lead_type || !form.customer_name.trim() || !form.customer_mobile.trim() || !form.customer_city.trim()) {
      toast({ title: "Validation Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("leads").insert({
      partner_id: user!.id,
      lead_type: form.lead_type,
      customer_name: form.customer_name.trim(),
      customer_mobile: form.customer_mobile.trim(),
      customer_city: form.customer_city.trim(),
      remarks: form.remarks.trim(),
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Lead Submitted!", description: "Your lead has been submitted successfully." });
      navigate("/my-leads");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Submit New Lead</h2>
          <p className="text-muted-foreground">Enter customer details below.</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-card rounded-xl border p-6 space-y-4">
          <div>
            <Label>Lead Type *</Label>
            <Select value={form.lead_type} onValueChange={(v) => setForm({ ...form, lead_type: v })}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Loan">Loan</SelectItem>
                <SelectItem value="Insurance">Insurance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Customer Name *</Label>
            <Input value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} placeholder="Customer full name" required />
          </div>
          <div>
            <Label>Customer Mobile *</Label>
            <Input value={form.customer_mobile} onChange={(e) => setForm({ ...form, customer_mobile: e.target.value })} placeholder="+91 9876543210" required />
          </div>
          <div>
            <Label>Customer City *</Label>
            <Input value={form.customer_city} onChange={(e) => setForm({ ...form, customer_city: e.target.value })} placeholder="Mumbai" required />
          </div>
          <div>
            <Label>Remarks</Label>
            <Textarea value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} placeholder="Any additional notes..." rows={3} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Lead"}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
