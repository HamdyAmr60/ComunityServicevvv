import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import volunteerApplicationService from '../services/volunteerApplicationService';
import serviceRequestService from '@/services/serviceRequestService';
import { Loader2, Check, X } from 'lucide-react';

const VolunteerApplications = ({ serviceRequestId, isRequester }) => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (serviceRequestId) {
      fetchApplications();
    } else {
      fetchMyApplications();
    }
  }, [serviceRequestId]);

  const fetchApplications = async () => {
    try {
      const data = await volunteerApplicationService.getApplicationsByServiceRequest(serviceRequestId);
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to load volunteer applications. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    try {
      const data = await volunteerApplicationService.getMyApplications();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching my applications:', error);
      toast({
        title: "Error",
        description: "Failed to load your applications. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      await volunteerApplicationService.updateApplicationStatus(applicationId, status);
      toast({
        title: "Success",
        description: `Application ${status.toLowerCase()} successfully`,
      });
      fetchApplications();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update application status",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-cc-primary" />
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-cc-primary mb-2">
          {serviceRequestId ? 'No Applications Yet' : 'No Applications Found'}
        </h3>
        <p className="text-cc-muted">
          {serviceRequestId 
            ? 'No volunteers have applied to this service request yet.' 
            : 'You have not applied to any service requests yet.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <Card key={application.id} className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-cc-primary">
              {serviceRequestId 
                ? application.volunteer?.fullName || 'Anonymous Volunteer'
                : application.serviceRequest?.title}
            </CardTitle>
            <CardDescription>
              {serviceRequestId 
                ? `Applied on ${new Date(application.createdAt).toLocaleDateString()}`
                : `Applied on ${new Date(application.createdAt).toLocaleDateString()}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className={`px-2 py-1 rounded-full text-xs ${
                application.status === 'Approved' 
                  ? 'bg-green-100 text-green-600'
                  : application.status === 'Rejected'
                  ? 'bg-red-100 text-red-600'
                  : 'bg-cc-accent/20 text-cc-accent'
              }`}>
                {application.status}
              </span>
              {isRequester && application.status === 'Pending' && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusUpdate(application.id, 'Rejected')}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleStatusUpdate(application.id, 'Approved')}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VolunteerApplications; 