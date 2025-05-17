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
        "py-4 px-1 font-medium flex items-center space-x-2 transition-colors",
        isActive 
          ? "text-primary border-b-2 border-primary" 
          : "text-neutral-600 hover:text-primary"
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
        isActive ? "text-primary" : "text-neutral-400 hover:text-primary"
      )}
    >
      <i className={`fas ${icon} text-xl`}></i>
      <span className="text-xs mt-1">{label}</span>
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
        "bg-white fixed top-0 left-0 right-0 z-30 transition-shadow",
        scrolled ? "shadow-md" : "shadow-sm"
      )}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/">
              <a className="text-2xl font-heading font-bold text-primary">Harmonia</a>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full bg-gray-100">
              <Bell className="text-neutral-500 h-5 w-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-accent-200 flex items-center justify-center">
              <span className="text-accent-700 text-sm font-medium">VR</span>
            </div>
          </div>
        </div>
        
        {/* Section Tabs - Desktop */}
        <div className="hidden md:flex border-b border-gray-200">
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
          </div>
        </div>
      </header>

      {/* Main content area with bottom padding for mobile nav */}
      <main className="flex-grow pt-24 pb-20 md:pb-6">
        {children}
      </main>

      {/* Mobile Navigation Bar - Fixed at Bottom */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
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
          </div>
        </nav>
      )}
    </div>
  );
}
