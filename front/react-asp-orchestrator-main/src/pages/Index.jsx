import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Leaderboard from '@/components/Leaderboard';
import ServiceRequestDashboard from '@/components/ServiceRequestDashboard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-cc-primary to-blue-600 text-white py-20">
        <div className="container-cc text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-enter">Community Catalyst</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90 mb-8">
            Connecting community members to build stronger neighborhoods through service, volunteerism, and donations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="cc-btn-secondary gap-2">
              <Link to="/register">
                <Users className="h-5 w-5" />
                <span>Volunteer Now</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-white text-cc-primary hover:bg-gray-100 gap-2">
              <Link to="/services">
                <Heart className="h-5 w-5" />
                <span>Request Service</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container-cc">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="cc-card">
              <div className="text-4xl font-bold text-cc-primary mb-2">5,000+</div>
              <div className="text-lg text-gray-600">Community Members</div>
            </div>
            <div className="cc-card">
              <div className="text-4xl font-bold text-cc-secondary mb-2">10,000+</div>
              <div className="text-lg text-gray-600">Services Completed</div>
            </div>
            <div className="cc-card">
              <div className="text-4xl font-bold text-cc-accent mb-2">$500,000+</div>
              <div className="text-lg text-gray-600">Donations Received</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Dashboard Section */}
      <section className="py-12 bg-cc-background">
        <div className="container-cc">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ServiceRequestDashboard />
            </div>
            <div>
              <Leaderboard />
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container-cc">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-cc-primary mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Register</h3>
              <p className="text-gray-600">
                Create an account as a service seeker, volunteer, or donor to get started.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center text-cc-secondary mb-4">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p className="text-gray-600">
                Service seekers post requests, volunteers find opportunities, donors support causes.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center text-cc-accent mb-4">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Make Impact</h3>
              <p className="text-gray-600">
                Help strengthen your community through cooperation and support.
              </p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="cc-btn-primary gap-2">
              <Link to="/about">
                <span>Learn More</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index; 