import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, GraduationCap, Calendar } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const quickLinks = [
    {
      icon: BookOpen,
      title: "Classes",
      description: "Manage class schedules and enrollment",
      href: "/classes",
      color: "from-blue-500/20 to-blue-500/5",
      iconColor: "text-blue-600"
    },
    {
      icon: Users,
      title: "Students",
      description: "View and manage student information",
      href: "/students",
      color: "from-purple-500/20 to-purple-500/5",
      iconColor: "text-purple-600"
    },
    {
      icon: GraduationCap,
      title: "Parents",
      description: "Manage parent and guardian information",
      href: "/parents",
      color: "from-green-500/20 to-green-500/5",
      iconColor: "text-green-600"
    },
    {
      icon: Calendar,
      title: "Subscriptions",
      description: "Manage student subscription packages",
      href: "/subscriptions",
      color: "from-orange-500/20 to-orange-500/5",
      iconColor: "text-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="px-6 py-16 text-center">
        <h1 className="text-5xl font-bold text-foreground mb-4">
          Welcome to TeenUp LMS
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Learning Management System for TeenUp
        </p>
        <Button 
          size="lg" 
          onClick={() => navigate("/dashboard")}
          className="gap-2 px-8"
        >
          Go to Dashboard
        </Button>
      </div>

      {/* Quick Links Grid */}
      <div className="px-6 pb-16 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-foreground">Quick Access</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.href}
                onClick={() => navigate(link.href)}
                className={`bg-gradient-to-br ${link.color} border-2 border-transparent hover:border-primary/50 p-6 rounded-lg text-left transition-all hover:shadow-lg cursor-pointer group`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-lg bg-white/50 group-hover:bg-white transition-colors`}>
                    <Icon className={`h-6 w-6 ${link.iconColor}`} />
                  </div>
                </div>
                <h3 className="font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                  {link.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {link.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Index;
