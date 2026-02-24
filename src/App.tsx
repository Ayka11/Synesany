import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/lib/i18n";
import { AppProvider } from "@/contexts/AppContext";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Help from "./pages/Help";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="dark">
    <I18nProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/help" element={<Help />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </I18nProvider>
  </ThemeProvider>
);

export default App;
