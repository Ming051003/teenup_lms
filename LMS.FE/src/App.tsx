import { ApiProvider } from "@/components/ApiProvider";
import { MainLayout } from "@/components/layout/MainLayout";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ClassDetailPage from "./pages/ClassDetailPage";
import ClassesPage from "./pages/ClassesPage";
import ClassRegisterPage from "./pages/ClassRegisterPage";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ParentDetailPage from "./pages/ParentDetailPage";
import ParentsPage from "./pages/ParentsPage";
import StudentDetailPage from "./pages/StudentDetailPage";
import StudentsPage from "./pages/StudentsPage";
import SubscriptionDetailPage from "./pages/SubscriptionDetailPage";
import SubscriptionsPage from "./pages/SubscriptionsPage";

const App = () => (
  <ApiProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/students/:id" element={<StudentDetailPage />} />
            <Route path="/parents" element={<ParentsPage />} />
            <Route path="/parents/:id" element={<ParentDetailPage />} />
            <Route path="/classes" element={<ClassesPage />} />
            <Route path="/classes/:id" element={<ClassDetailPage />} />
            <Route path="/classes/:classId/register" element={<ClassRegisterPage />} />
            <Route path="/subscriptions" element={<SubscriptionsPage />} />
            <Route path="/subscriptions/:id" element={<SubscriptionDetailPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </TooltipProvider>
  </ApiProvider>
);

export default App;
