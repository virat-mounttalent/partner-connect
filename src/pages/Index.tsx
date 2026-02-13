import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Shield, Users } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container flex items-center justify-between h-16">
          <h1 className="text-xl font-bold">🤝 RefPartner</h1>
          <div className="flex gap-2">
            <Button variant="ghost" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container py-20 md:py-32 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight">
          Manage Your Referral Leads
          <span className="text-accent"> Effortlessly</span>
        </h2>
        <p className="text-lg text-muted-foreground mt-4 max-w-xl mx-auto">
          Submit loan and insurance leads, track their status in real-time, and grow your referral business — all from one dashboard.
        </p>
        <div className="flex gap-3 justify-center mt-8">
          <Button size="lg" asChild>
            <Link to="/register">
              Start as Partner <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/admin/login">Admin Login</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container pb-20">
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: FileText, title: "Submit Leads", desc: "Quickly submit loan and insurance referral leads with customer details." },
            { icon: Shield, title: "Track Status", desc: "Monitor your leads from submission to approval in real-time." },
            { icon: Users, title: "Admin Management", desc: "Admins can review, filter, and update lead statuses instantly." },
          ].map((f) => (
            <div key={f.title} className="bg-card rounded-xl border p-6 text-center animate-fade-in">
              <f.icon className="h-10 w-10 mx-auto text-accent mb-3" />
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} RefPartner. All rights reserved.
      </footer>
    </div>
  );
}
