import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Placeholder from "./pages/Placeholder";
import AuthCallback from "./pages/AuthCallback";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/auth/callback" element={<Layout><AuthCallback /></Layout>} />

          {/* Feature routes (placeholders for now) */}
          <Route
            path="/chat"
            element={
              <Layout>
                <Placeholder
                  title="AI Mental Health Chatbot"
                  description="Empathetic, private conversations powered by AI to reflect, reframe, and guide you through tough moments."
                />
              </Layout>
            }
          />
          <Route
            path="/assessments"
            element={
              <Layout>
                <Placeholder
                  title="Assessments: PHQ‑9 • GAD‑7 • GHQ‑12"
                  description="Clinically‑validated screeners to understand mood, anxiety, and general mental health with supportive insights."
                />
              </Layout>
            }
          />
          <Route
            path="/resources"
            element={
              <Layout>
                <Placeholder
                  title="Resources Hub"
                  description="CBT guides, exercises, and evidence‑based tools to build daily resilience and mindful habits."
                />
              </Layout>
            }
          />
          <Route
            path="/vr"
            element={
              <Layout>
                <Placeholder
                  title="VR Agent: Soothing Spaces"
                  description="Immerse yourself in calming nature scenes for focus, meditation, and breathing exercises."
                />
              </Layout>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
