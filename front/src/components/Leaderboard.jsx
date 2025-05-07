import React, { useEffect, useState } from 'react';
import { Trophy, Star } from 'lucide-react';
import serviceRequestService from '@/services/serviceRequestService';

const Leaderboard = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTopVolunteers = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, replace with the actual API call
        // const data = await serviceRequestService.getTopVolunteers();
        const data = await serviceRequestService.getTopVolunteersDemo();
        setVolunteers(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching top volunteers:', err);
        setError('Failed to load leaderboard data');
        setIsLoading(false);
      }
    };

    fetchTopVolunteers();
  }, []);

  if (isLoading) {
    return (
      <div className="cc-card h-64 flex items-center justify-center">
        <div className="animate-pulse text-cc-primary">Loading leaderboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cc-card h-64 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="cc-card animate-enter">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-xl flex items-center">
          <Trophy className="h-6 w-6 text-cc-accent mr-2" />
          Top Volunteers
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-left border-b border-gray-200">
              <th className="py-3 px-4">Rank</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-cc-accent mr-1" />
                  <span>Credibility</span>
                </div>
              </th>
              <th className="py-3 px-4">Services</th>
            </tr>
          </thead>
          <tbody>
            {volunteers.map((volunteer, index) => (
              <tr key={volunteer.id} className={`border-b border-gray-100 ${index === 0 ? 'bg-amber-50' : ''}`}>
                <td className="py-3 px-4 font-medium">#{index + 1}</td>
                <td className="py-3 px-4">{volunteer.name}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <span className={`font-medium ${index === 0 ? 'text-cc-accent' : 'text-cc-secondary'}`}>
                      {volunteer.credibilityScore}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">{volunteer.completedServices}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard; 