import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import authService from '@/services/authService';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = authService.isLoggedIn();
  const currentUser = authService.getCurrentUser();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container-cc flex justify-between items-center py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-cc-primary text-white flex items-center justify-center font-bold text-xl">CC</div>
          <span className="text-xl font-bold">Community Catalyst</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="font-medium hover:text-cc-primary transition-colors">Home</Link>
          <Link to="/services" className="font-medium hover:text-cc-primary transition-colors">Services</Link>
          <Link to="/volunteers" className="font-medium hover:text-cc-primary transition-colors">Volunteers</Link>
          <Link to="/donations" className="font-medium hover:text-cc-primary transition-colors">Donations</Link>
          <Link to="/feedback" className="font-medium hover:text-cc-primary transition-colors">Feedback</Link>
          
          {/* User Authentication */}
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-cc-primary" />
                <span className="text-sm font-medium">{currentUser?.fullName || 'User'}</span>
              </div>
              <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:bg-rose-50 hover:text-rose-600" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm" className="flex items-center gap-1">
                <Link to="/login">
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
              </Button>
              <Button asChild size="sm" className="flex items-center gap-1">
                <Link to="/register">
                  <UserPlus className="h-4 w-4" />
                  <span>Register</span>
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container-cc py-4 flex flex-col gap-4">
            <Link to="/" className="font-medium hover:text-cc-primary transition-colors">Home</Link>
            <Link to="/services" className="font-medium hover:text-cc-primary transition-colors">Services</Link>
            <Link to="/volunteers" className="font-medium hover:text-cc-primary transition-colors">Volunteers</Link>
            <Link to="/donations" className="font-medium hover:text-cc-primary transition-colors">Donations</Link>
            <Link to="/feedback" className="font-medium hover:text-cc-primary transition-colors">Feedback</Link>
            
            {/* Mobile User Authentication */}
            {isLoggedIn ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-cc-primary" />
                  <span className="text-sm font-medium">{currentUser?.fullName || 'User'}</span>
                </div>
                <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:bg-rose-50 hover:text-rose-600" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Button asChild variant="ghost" size="sm" className="flex items-center gap-1">
                  <Link to="/login">
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </Link>
                </Button>
                <Button asChild size="sm" className="flex items-center gap-1">
                  <Link to="/register">
                    <UserPlus className="h-4 w-4" />
                    <span>Register</span>
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 