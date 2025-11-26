import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center px-6 py-12 max-w-md">
        <div className="mb-6">
          <AlertCircle className="h-20 w-20 mx-auto text-destructive opacity-60" />
        </div>
        <h1 className="text-5xl font-bold text-foreground mb-2">404</h1>
        <p className="text-xl text-muted-foreground mb-2">Page Not Found</p>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <p className="text-sm text-muted-foreground mb-8 break-all bg-slate-100 p-3 rounded-lg">
          <span className="font-mono">{location.pathname}</span>
        </p>
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={() => navigate("/")}
            className="gap-2"
            size="lg"
          >
            <Home className="h-4 w-4" />
            Go to Home
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate(-1)}
            size="lg"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
