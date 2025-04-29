import React, { useState } from "react";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { HelpCircle, Sun, Moon } from "lucide-react";

const TaxCalculator: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [showGuide, setShowGuide] = useState(false);
  
  const toggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3">Tax Calculator Pro</h1>
        <p className="text-xl text-muted-foreground mb-6">Comprehensive tax calculations for multiple countries</p>
        <div className="flex justify-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => setShowGuide(!showGuide)}
          >
            <HelpCircle className="mr-2 h-5 w-5" />
            {showGuide ? 'Hide Guide' : 'Show Guide'}
          </Button>
          <Button
            variant="outline"
            onClick={toggleDarkMode}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Main Layout */}
      <div className={`grid ${showGuide ? 'grid-cols-1 lg:grid-cols-4 gap-6' : 'grid-cols-1'}`}>
        {/* User Guide (Sidebar) */}
        {showGuide && (
          <div className="lg:col-span-1">
            <Sidebar toggleDarkMode={toggleDarkMode} isDarkMode={theme === "dark"} />
          </div>
        )}
        
        {/* Main Content Area */}
        <div className={showGuide ? 'lg:col-span-3' : 'col-span-1'}>
          <MainContent />
        </div>
      </div>
    </div>
  );
};

export default TaxCalculator;
