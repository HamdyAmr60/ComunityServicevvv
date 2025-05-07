import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import serviceRequestService from '@/services/serviceRequestService';

const ServiceRequestSelector = ({ onSelect, selectedRequest }) => {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchServiceRequests = async () => {
      try {
        setIsLoading(true);
        const requests = await serviceRequestService.getAllRequests();
        setServiceRequests(requests);
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

    fetchServiceRequests();
  }, []);

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Loading Service Requests...</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-cc-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-cc-primary">Select a Service Request</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {serviceRequests.length > 0 ? (
          serviceRequests.map((request) => (
            <Button
              key={request.id}
              variant={selectedRequest?.id === request.id ? "default" : "outline"}
              className={`w-full justify-start ${
                selectedRequest?.id === request.id
                  ? 'bg-cc-accent hover:bg-cc-accent/90 text-white'
                  : 'hover:bg-cc-primary/5 text-cc-primary'
              }`}
              onClick={() => onSelect(request)}
            >
              <div className="text-left">
                <p className="font-medium">{request.title}</p>
                <p className="text-sm opacity-75">{request.description}</p>
              </div>
            </Button>
          ))
        ) : (
          <p className="text-center text-cc-muted">No service requests available</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceRequestSelector; 