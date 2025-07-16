import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Mic, Globe } from "lucide-react";

export function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="flex items-center space-x-2">
      <Link href="/">
        <Button 
          variant={location === "/" ? "default" : "ghost"}
          size="sm"
          className="flex items-center space-x-2"
        >
          <Globe className="w-4 h-4" />
          <span>Voice Agent</span>
        </Button>
      </Link>
      <Link href="/speech-to-text">
        <Button 
          variant={location === "/speech-to-text" ? "default" : "ghost"}
          size="sm"
          className="flex items-center space-x-2"
        >
          <Mic className="w-4 h-4" />
          <span>Speech to Text</span>
        </Button>
      </Link>
    </nav>
  );
}