
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-muted-foreground mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/">
        <Button>Return Home</Button>
      </Link>
    </div>
  );
}
