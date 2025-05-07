import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Handshake, Heart, Users, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import authService from '@/services/authService';
import serviceRequestService from '@/services/serviceRequestService';
import volunteerService from '@/services/volunteerService';

const VolunteerOpportunity = ({ title, description, category, location, commitment, spots, id, onApply }) => {
  return (
    <Card className="mb-4 hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Handshake className="text-cc-secondary" />
          {title}
        </CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span className="bg-cc-secondary/10 text-cc-secondary px-2 py-1 rounded-md text-xs">
            {category}
          </span>
          <span className="text-sm text-gray-500">{location}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">{description}</p>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{spots} spots available</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Commitment: {commitment}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-cc-secondary hover:bg-cc-secondary/90"
          onClick={() => onApply(id)}
        >
          Apply to Volunteer
        </Button>
      </CardFooter>
    </Card>
  );
};

const VolunteerBenefits = () => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
    <Card className="bg-gradient-to-br from-cc-secondary/10 to-transparent border-cc-secondary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cc-secondary">
          <Heart className="h-5 w-5" />
          Personal Growth
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">
          Develop new skills, gain experience, and build confidence while making a difference in your community.
        </p>
      </CardContent>
    </Card>
    <Card className="bg-gradient-to-br from-cc-primary/10 to-transparent border-cc-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cc-primary">
          <Users className="h-5 w-5" />
          Social Connection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">
          Meet like-minded individuals, form meaningful relationships, and expand your social and professional network.
        </p>
      </CardContent>
    </Card>
    <Card className="bg-gradient-to-br from-cc-accent/10 to-transparent border-cc-accent/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cc-accent">
          <Handshake className="h-5 w-5" />
          Community Impact
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">
          Create tangible positive changes in your community by contributing your time and skills to meaningful projects.
        </p>
      </CardContent>
    </Card>
  </div>
);

const Volunteers = () => {
  const [activeTab, setActiveTab] = useState('opportunities');
  const [serviceRequests, setServiceRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Component mounted');
    fetchServiceRequests();
  }, []);

  const fetchServiceRequests = async () => {
    try {
      console.log('Fetching service requests...');
      const requests = await serviceRequestService.getAllRequests();
      console.log('Service requests received:', requests);
      // Filter only active (InProgress) service requests
      const activeRequests = requests.filter(request => request.status === 'InProgress');
      console.log('Active requests:', activeRequests);
      setServiceRequests(activeRequests);
    } catch (error) {
      console.error('Error fetching service requests:', error);
      toast({
        title: "Error",
        description: "Failed to load service requests. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async (serviceRequestId) => {
    // Check if user is logged in
    if (!authService.isLoggedIn()) {
      toast({
        title: "Login Required",
        description: "Please login to apply for volunteer opportunities.",
        variant: "default"
      });
      navigate('/login');
      return;
    }

    // Check if user has volunteer role
    if (!authService.hasRole('Volunteer')) {
      toast({
        title: "Volunteer Role Required",
        description: "You need to be registered as a volunteer to apply for opportunities.",
        variant: "default"
      });
      navigate('/register');
      return;
    }

    try {
      console.log('Applying to service request:', serviceRequestId);
      await volunteerService.applyToServiceRequest(serviceRequestId);
      toast({
        title: "Success",
        description: "Application submitted successfully",
      });
      fetchServiceRequests();
    } catch (error) {
      console.error('Error applying to service request:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit application",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    console.log('Loading state active');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cc-primary" />
      </div>
    );
  }

  console.log('Rendering main content, serviceRequests:', serviceRequests);
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-cc-secondary to-green-600 text-white py-16">
        <div className="container-cc text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-enter">Volunteer Opportunities</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            Make a difference in your community by sharing your time and skills with those in need.
          </p>
        </div>
      </section>
      
      {/* Volunteer Content */}
      <section className="py-12 bg-cc-background flex-grow">
        <div className="container-cc">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto mb-8 grid-cols-2">
              <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
              <TabsTrigger value="benefits">Why Volunteer</TabsTrigger>
            </TabsList>
            <TabsContent value="opportunities" className="animate-enter">
              <div className="grid md:grid-cols-2 gap-6">
                {serviceRequests.length > 0 ? (
                  serviceRequests.map((request) => (
                    <VolunteerOpportunity
                      key={request.id}
                      id={request.id}
                      title={request.title}
                      description={request.description}
                      category={request.category || 'General'}
                      location={request.location || 'Various Locations'}
                      commitment={request.commitment || 'Flexible'}
                      spots={request.spots || 5}
                      onApply={handleApply}
                    />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8">
                    <p className="text-cc-muted">No volunteer opportunities available at the moment.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="benefits" className="animate-enter">
              <div className="max-w-3xl mx-auto">
                <p className="text-lg text-center mb-6">
                  Volunteering is not just about giving — it's also about growing, connecting, and making a meaningful impact in your community.
                </p>
                <VolunteerBenefits />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Volunteers; 