import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Marketing from "./pages/Marketing";
import Cases from "./pages/Cases";
import Sobre from "./pages/Sobre";
import Contato from "./pages/Contato";
import Produtora from "./pages/Produtora";
import Restaurantes from "./pages/Restaurantes";
import Proposta from "./pages/Proposta";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import TermosUso from "./pages/TermosUso";
import SegmentImobiliario from "./pages/SegmentImobiliario";
import SegmentEmpresas from "./pages/SegmentEmpresas";
import SegmentEventos from "./pages/SegmentEventos";
import SegmentMarcas from "./pages/SegmentMarcas";
import SegmentPolitica from "./pages/SegmentPolitica";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminMedia from "./pages/admin/AdminMedia";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminProdutora from "./pages/admin/AdminProdutora";
import AdminRestaurantes from "./pages/admin/AdminRestaurantes";
import AdminSobre from "./pages/admin/AdminSobre";
import AdminMarketing from "./pages/admin/AdminMarketing";
import AdminHome from "./pages/admin/AdminHome";
import AdminProposals from "./pages/admin/AdminProposals";
import AdminLgpd from "./pages/admin/AdminLgpd";
import AdminSegments from "./pages/admin/AdminSegments";
import AdminCases from "./pages/admin/AdminCases";
import AdminCategories from "./pages/admin/AdminCategories";
import CaseDetail from "./pages/CaseDetail";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import CookieBanner from "./components/CookieBanner";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CookieBanner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/marketing" element={<Marketing />} />
            <Route path="/cases" element={<Cases />} />
            <Route path="/cases/:slug" element={<CaseDetail />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/produtora" element={<Produtora />} />
            <Route path="/restaurantes" element={<Restaurantes />} />
            <Route path="/proposta" element={<Proposta />} />
            <Route path="/proposta/:slug" element={<Proposta />} />
            <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
            <Route path="/termos-de-uso" element={<TermosUso />} />

            {/* Segment landing pages */}
            <Route path="/imobiliario" element={<SegmentImobiliario />} />
            <Route path="/empresas" element={<SegmentEmpresas />} />
            <Route path="/eventos" element={<SegmentEventos />} />
            <Route path="/marcas" element={<SegmentMarcas />} />
            <Route path="/politica" element={<SegmentPolitica />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/projects" element={<ProtectedRoute><AdminProjects /></ProtectedRoute>} />
            <Route path="/admin/messages" element={<ProtectedRoute><AdminMessages /></ProtectedRoute>} />
            <Route path="/admin/media" element={<ProtectedRoute><AdminMedia /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
            <Route path="/admin/testimonials" element={<ProtectedRoute><AdminTestimonials /></ProtectedRoute>} />
            <Route path="/admin/produtora" element={<ProtectedRoute><AdminProdutora /></ProtectedRoute>} />
            <Route path="/admin/restaurantes" element={<ProtectedRoute><AdminRestaurantes /></ProtectedRoute>} />
            <Route path="/admin/sobre" element={<ProtectedRoute><AdminSobre /></ProtectedRoute>} />
            <Route path="/admin/marketing" element={<ProtectedRoute><AdminMarketing /></ProtectedRoute>} />
            <Route path="/admin/home" element={<ProtectedRoute><AdminHome /></ProtectedRoute>} />
            <Route path="/admin/proposals" element={<ProtectedRoute><AdminProposals /></ProtectedRoute>} />
            <Route path="/admin/lgpd" element={<ProtectedRoute><AdminLgpd /></ProtectedRoute>} />
            <Route path="/admin/segments" element={<ProtectedRoute><AdminSegments /></ProtectedRoute>} />
            <Route path="/admin/cases" element={<ProtectedRoute><AdminCases /></ProtectedRoute>} />
            <Route path="/admin/categories" element={<ProtectedRoute><AdminCategories /></ProtectedRoute>} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
