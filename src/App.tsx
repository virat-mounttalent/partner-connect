import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import SubmitLead from "./pages/SubmitLead";
import MyLeads from "./pages/MyLeads";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLeads from "./pages/AdminLeads";
import AdminPartners from "./pages/AdminPartners";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/dashboard"
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            />
            <Route
              path="/submit-lead"
              element={<ProtectedRoute><SubmitLead /></ProtectedRoute>}
            />
            <Route
              path="/my-leads"
              element={<ProtectedRoute><MyLeads /></ProtectedRoute>}
            />
            <Route
              path="/admin/dashboard"
              element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>}
            />
            <Route
              path="/admin/leads"
              element={<ProtectedRoute requireAdmin><AdminLeads /></ProtectedRoute>}
            />
            <Route
              path="/admin/partners"
              element={<ProtectedRoute requireAdmin><AdminPartners /></ProtectedRoute>}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
