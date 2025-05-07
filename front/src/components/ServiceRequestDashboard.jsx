import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, XCircle, Info } from 'lucide-react';
import serviceRequestService from '@/services/serviceRequestService';

const ServiceRequestDashboard = () => {
  const [activeTab, setActiveTab] = useState('inProgress');
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, replace with the actual API call
        // const data = await serviceRequestService.getRequestsByStatus(activeTab);
        const data = await serviceRequestService.getServiceRequestsDemo(activeTab);
        setRequests(data);
        setIsLoading(false);
      } catch (err) {
        console.error(`Error fetching ${activeTab} requests:`, err);
        setError('Failed to load service requests');
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [activeTab]);

  return (
    <div className="cc-card animate-enter">
      <h3 className="font-bold text-xl mb-4">Service Request Dashboard</h3>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          className={`cc-tab ${activeTab === 'inProgress' ? 'cc-tab-active' : 'cc-tab-inactive'}`}
          onClick={() => setActiveTab('inProgress')}
        >
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>In Progress</span>
          </div>
        </button>
        <button
          className={`cc-tab ${activeTab === 'completed' ? 'cc-tab-active' : 'cc-tab-inactive'}`}
          onClick={() => setActiveTab('completed')}
        >
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span>Completed</span>
          </div>
        </button>
        <button
          className={`cc-tab ${activeTab === 'cancelled' ? 'cc-tab-active' : 'cc-tab-inactive'}`}
          onClick={() => setActiveTab('cancelled')}
        >
          <div className="flex items-center">
            <XCircle className="h-4 w-4 mr-1" />
            <span>Cancelled</span>
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-pulse text-cc-primary">Loading requests...</div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No {activeTab} service requests found</div>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Requester</th>
                <th className="py-3 px-4">Volunteer</th>
                <th className="py-3 px-4">Date</th>
                {activeTab === 'cancelled' && <th className="py-3 px-4">Reason</th>}
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{request.title}</td>
                  <td className="py-3 px-4">{request.requesterName}</td>
                  <td className="py-3 px-4">{request.assignedVolunteerName || "-"}</td>
                  <td className="py-3 px-4">{new Date(request.createdAt).toLocaleDateString()}</td>
                  {activeTab === 'cancelled' && (
                    <td className="py-3 px-4 text-red-500">{request.cancelReason || "Unknown"}</td>
                  )}
                  <td className="py-3 px-4">
                    <button className="text-cc-primary hover:text-blue-700 flex items-center">
                      <Info className="h-4 w-4 mr-1" /> Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ServiceRequestDashboard; 