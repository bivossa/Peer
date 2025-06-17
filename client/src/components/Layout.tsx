import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Bell } from "lucide-react";

interface NavTabProps {
  to: string;
  icon: string;
  label: string;
  isActive: boolean;
}

const NavTab = ({ to, icon, label, isActive }: NavTabProps) => {
  return (
    <Link 
      href={to}
      className={cn(
        "py-4 px-1 font-medium flex items-center space-x-2 transition-colors font-sans",
        isActive 
          ? "text-primary border-b-2 border-primary" 
          : "text-muted-foreground hover:text-primary"
      )}
    >
      <i className={`fas ${icon}`}></i>
      <span>{label}</span>
    </Link>
  );
};

const MobileNavButton = ({ to, icon, label, isActive }: NavTabProps) => {
  return (
    <Link 
      href={to}
      className={cn(
        "nav-item flex flex-col items-center py-2 px-4 transition-colors",
        isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
      )}
    >
      <i className={`fas ${icon} text-xl`}></i>
      <span className="text-xs mt-1 font-medium">{label}</span>
    </Link>
  );
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getIsActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className={cn(
        "bg-background fixed top-0 left-0 right-0 z-30 transition-shadow",
        scrolled ? "shadow-md" : "shadow-sm"
      )}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-12 bg-gradient-to-b from-primary to-primary/80 rounded-full transform rotate-45 shadow-sm"></div>
            <Link href="/">
              <a className="text-3xl brand-logo text-primary">Peer</a>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors">
              <Bell className="text-muted-foreground h-5 w-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary text-sm font-medium">VR</span>
            </div>
          </div>
        </div>
        
        {/* Section Tabs - Desktop */}
        <div className="hidden md:flex border-b border-border">
          <div className="container mx-auto px-4 flex space-x-8">
            <NavTab 
              to="/" 
              icon="fa-users" 
              label="Connessioni" 
              isActive={getIsActive("/")} 
            />
            <NavTab 
              to="/forum" 
              icon="fa-comments" 
              label="Forum" 
              isActive={getIsActive("/forum")} 
            />
            <NavTab 
              to="/courses" 
              icon="fa-graduation-cap" 
              label="Corsi" 
              isActive={getIsActive("/courses")} 
            />
            <NavTab 
              to="/professionals" 
              icon="fa-stethoscope" 
              label="Professionisti" 
              isActive={getIsActive("/professionals")} 
            />
            <NavTab 
              to="/clinical" 
              icon="fa-image" 
              label="Condizioni Cliniche" 
              isActive={getIsActive("/clinical")} 
            />
          </div>
        </div>
      </header>

      {/* Main content area with bottom padding for mobile nav */}
      <main className="flex-grow pt-24 pb-20 md:pb-6">
        {children}
      </main>

      {/* Mobile Navigation Bar - Fixed at Bottom */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-30">
          <div className="flex justify-around">
            <MobileNavButton 
              to="/" 
              icon="fa-users" 
              label="Connetti" 
              isActive={getIsActive("/")} 
            />
            <MobileNavButton 
              to="/forum" 
              icon="fa-comments" 
              label="Forum" 
              isActive={getIsActive("/forum")} 
            />
            <MobileNavButton 
              to="/courses" 
              icon="fa-graduation-cap" 
              label="Corsi" 
              isActive={getIsActive("/courses")} 
            />
            <MobileNavButton 
              to="/professionals" 
              icon="fa-stethoscope" 
              label="Esperti" 
              isActive={getIsActive("/professionals")} 
            />
            <MobileNavButton 
              to="/clinical" 
              icon="fa-image" 
              label="Cliniche" 
              isActive={getIsActive("/clinical")} 
            />
          </div>
        </nav>
      )}
    </div>
  );
}
