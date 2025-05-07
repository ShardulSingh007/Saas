import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
import { useLocation } from "wouter";

export function AdminProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: React.ComponentType<any>;
}) {
  const { user, isLoading, isAdmin } = useAuth();
  const [, navigate] = useLocation();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  if (!user?.isAdmin) {
    navigate('/admin-login');
    return null;
  }

  return (
    <Route path={path}>
      <Component />
    </Route>
  );
}