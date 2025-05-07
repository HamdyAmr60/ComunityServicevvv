import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import { Heart, Check, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import authService from '@/services/authService';
import donationService from '@/services/donationService';
import serviceRequestService from '@/services/serviceRequestService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DonationProjects from '@/components/DonationProjects';

const DonationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [formData, setFormData] = useState({
    amount: '',
    serviceRequestId: ''
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const isLoggedIn = authService.isLoggedIn();
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    const fetchServiceRequests = async () => {
      try {
        const requests = await serviceRequestService.getAllServiceRequests();
        setServiceRequests(requests);
      } catch (error) {
        console.error('Error fetching service requests:', error);
        toast({
          title: "Error",
          description: "Failed to load service requests. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingRequests(false);
      }
    };

    if (isLoggedIn) {
      fetchServiceRequests();
    }
  }, [isLoggedIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      toast({
        title: "Authentication Required",
        description: "Please login to make a donation",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (!formData.amount || formData.amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount",
        variant: "destructive"
      });
      return;
    }

    if (!formData.serviceRequestId) {
      toast({
        title: "Service Request Required",
        description: "Please select a service request to donate to",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const donation = await donationService.donate(
        formData.serviceRequestId,
        parseFloat(formData.amount)
      );
      
      toast({
        title: "Donation Successful",
        description: "Thank you for your generous contribution!",
      });
      
      // Reset form
      setFormData({
        amount: '',
        serviceRequestId: ''
      });
    } catch (error) {
      console.error('Donation error:', error);
      toast({
        title: "Donation Failed",
        description: error.message || "There was an error processing your donation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto border-0 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-2xl text-cc-primary">Make a Donation</CardTitle>
        <CardDescription className="text-center text-cc-muted">Your contribution helps our community thrive</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {isLoggedIn && (
              <div className="flex items-center gap-3 p-4 bg-cc-primary/5 rounded-lg">
                <div className="h-12 w-12 rounded-full bg-cc-primary text-white flex items-center justify-center text-lg font-medium">
                  {currentUser?.fullName?.[0] || 'U'}
                </div>
                <div>
                  <p className="font-medium text-cc-primary">{currentUser?.fullName || 'User'}</p>
                  <p className="text-sm text-cc-muted">{currentUser?.email}</p>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label className="text-cc-primary">Select Service Request</Label>
              <Select
                value={formData.serviceRequestId}
                onValueChange={(value) => setFormData({ ...formData, serviceRequestId: value })}
                disabled={isLoadingRequests}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a service request" />
                </SelectTrigger>
                <SelectContent>
                  {serviceRequests.map((request) => (
                    <SelectItem key={request.id} value={request.id.toString()}>
                      {request.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-cc-primary">Donation Amount</Label>
              <div className="grid grid-cols-4 gap-2">
                {[25, 50, 100, 250].map(amount => (
                  <Button 
                    key={amount} 
                    type="button" 
                    variant={formData.amount === amount.toString() ? "default" : "outline"}
                    className={`${
                      formData.amount === amount.toString() 
                        ? 'bg-cc-accent hover:bg-cc-accent/90 text-white shadow-sm' 
                        : 'hover:bg-cc-accent/10 hover:text-cc-accent border-cc-primary/20 text-cc-primary'
                    } transition-all duration-200`}
                    onClick={() => setFormData({ ...formData, amount: amount.toString() })}
                  >
                    ${amount}
                  </Button>
                ))}
              </div>
              <div className="mt-2">
                <Input 
                  id="customAmount" 
                  type="number" 
                  placeholder="Other amount" 
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="border-cc-primary/20 focus:border-cc-accent focus:ring-cc-accent"
                />
              </div>
            </div>
          </div>
          
          <Button 
            className="w-full mt-6 bg-cc-accent hover:bg-cc-accent/90 text-white shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-cc-accent/50"
            type="submit"
            disabled={isSubmitting || !formData.serviceRequestId}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Heart className="mr-2" /> 
                {isLoggedIn ? 'Complete Donation' : 'Login to Donate'}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const DonationImpact = () => {
  const [impactStats, setImpactStats] = useState({
    totalDonations: 0,
    totalAmount: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImpactStats = async () => {
      try {
        const donations = await donationService.getMyDonations();
        const totalAmount = donations.reduce((sum, donation) => sum + donation.amount, 0);
        
        setImpactStats({
          totalDonations: donations.length,
          totalAmount
        });
      } catch (error) {
        console.error('Error fetching impact stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (authService.isLoggedIn()) {
      fetchImpactStats();
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="h-8 w-1/2 mx-auto bg-cc-primary/10 rounded animate-pulse" />
          <div className="h-4 w-3/4 mx-auto mt-2 bg-cc-primary/10 rounded animate-pulse" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <div className="h-12 w-12 rounded-full bg-cc-primary/10 mx-auto mb-2 animate-pulse" />
              <div className="h-8 w-24 mx-auto bg-cc-primary/10 rounded animate-pulse" />
            </CardHeader>
            <CardContent className="text-center">
              <div className="h-4 w-32 mx-auto bg-cc-primary/10 rounded animate-pulse" />
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <div className="h-12 w-12 rounded-full bg-cc-primary/10 mx-auto mb-2 animate-pulse" />
              <div className="h-8 w-24 mx-auto bg-cc-primary/10 rounded animate-pulse" />
            </CardHeader>
            <CardContent className="text-center">
              <div className="h-4 w-32 mx-auto bg-cc-primary/10 rounded animate-pulse" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-cc-primary">Your Donation Impact</h3>
        <p className="text-cc-muted">See how your contributions have made a difference</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="h-12 w-12 rounded-full bg-cc-accent/20 flex items-center justify-center mx-auto mb-2">
              <Check className="h-6 w-6 text-cc-accent" />
            </div>
            <CardTitle className="text-center text-xl text-cc-primary">{impactStats.totalDonations}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-cc-muted">Total Donations Made</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="h-12 w-12 rounded-full bg-cc-accent/20 flex items-center justify-center mx-auto mb-2">
              <Check className="h-6 w-6 text-cc-accent" />
            </div>
            <CardTitle className="text-center text-xl text-cc-primary">${impactStats.totalAmount.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-cc-muted">Total Amount Donated</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Donations = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const requestId = searchParams.get('requestId');
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'projects');

  // Update active tab when URL parameters change
  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    } else if (requestId) {
      setActiveTab('donate');
    }
  }, [tabParam, requestId]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-cc-accent to-amber-500 text-white py-16">
        <div className="container-cc text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-enter">Support Our Community</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            Your donations help fund vital community services and projects that make a real difference.
          </p>
        </div>
      </section>
      
      {/* Donation Content */}
      <section className="py-12 bg-cc-background flex-grow">
        <div className="container-cc">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto mb-8 grid-cols-2 bg-cc-primary/5 p-1 rounded-lg">
              <TabsTrigger 
                value="projects" 
                className="data-[state=active]:bg-white data-[state=active]:text-cc-primary data-[state=active]:shadow-sm rounded-md transition-all duration-200"
              >
                Projects
              </TabsTrigger>
              <TabsTrigger 
                value="donate" 
                className="data-[state=active]:bg-white data-[state=active]:text-cc-primary data-[state=active]:shadow-sm rounded-md transition-all duration-200"
              >
                Donate
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="projects" className="animate-enter">
              <DonationProjects />
            </TabsContent>
            
            <TabsContent value="donate" className="animate-enter">
              <DonationForm />
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Donations; 