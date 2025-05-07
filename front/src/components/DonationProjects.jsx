import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import serviceRequestService from '@/services/serviceRequestService';
import { Loader2 } from 'lucide-react';

const DonationProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const requests = await serviceRequestService.getAllServiceRequests();
      // Filter only active (InProgress) service requests
      const activeProjects = requests.filter(request => request.status === 'InProgress');
      setProjects(activeProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to load donation projects. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-cc-primary" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-cc-primary mb-2">No Active Projects</h3>
        <p className="text-cc-muted">There are currently no active service requests to donate to.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card key={project.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-cc-primary">{project.title}</CardTitle>
            <CardDescription>By {project.requester?.fullName || 'Anonymous'}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-cc-muted mb-4">{project.description}</p>
            <div className="flex justify-between items-center">
              <span className="px-2 py-1 rounded-full text-xs bg-cc-accent/20 text-cc-accent">
                {project.status}
              </span>
              <Button 
                variant="default"
                onClick={() => navigate(`/donations?requestId=${project.id}`)}
              >
                Donate Now
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DonationProjects; 