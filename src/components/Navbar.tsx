
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/store';
import { User, LogIn, UserPlus, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const {
    user,
    isAuthenticated,
    logout,
    initAuth
  } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Initialize auth state when component mounts
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  
  return (
    <header className="sticky top-0 z-50 w-full glass-card backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-300">CodeHuddle &lt;&gt;</span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User size={16} />
                <span>{user?.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                <LogIn size={16} className="mr-2" />
                Login
              </Button>
              <Button variant="default" size="sm" onClick={() => navigate('/signup')}>
                <UserPlus size={16} className="mr-2" />
                Sign Up
              </Button>
            </>
          )}
        </nav>

        {/* Mobile menu button */}
        <button className="md:hidden p-2 focus:outline-none" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden p-4 glass animate-fade-in">
          <nav className="flex flex-col space-y-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground p-2">
                  <User size={16} />
                  <span>{user?.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => {
                  navigate('/dashboard');
                  setMobileMenuOpen(false);
                }}>
                  Dashboard
                </Button>
                <Button variant="ghost" size="sm" onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}>
                  <LogOut size={16} className="mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => {
                  navigate('/login');
                  setMobileMenuOpen(false);
                }}>
                  <LogIn size={16} className="mr-2" />
                  Login
                </Button>
                <Button variant="default" size="sm" onClick={() => {
                  navigate('/signup');
                  setMobileMenuOpen(false);
                }}>
                  <UserPlus size={16} className="mr-2" />
                  Sign Up
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
