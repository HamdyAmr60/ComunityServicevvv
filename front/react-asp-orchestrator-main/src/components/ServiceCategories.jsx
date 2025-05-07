import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Heart, Home, Users, Calendar, Star } from 'lucide-react';

const CategoryCard = ({ title, description, icon, color }) => (
  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
    <CardHeader>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${color}`}>
        {icon}
      </div>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription className="text-base">{description}</CardDescription>
    </CardContent>
    <CardFooter>
      <Button variant="outline" className="w-full">Learn More</Button>
    </CardFooter>
  </Card>
);

const ServiceCategories = () => {
  const categories = [
    {
      title: 'Home Assistance',
      description: 'Help with household tasks, cleaning, small repairs, and maintenance for those who need support.',
      icon: <Home className="h-6 w-6 text-white" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Companionship',
      description: 'Friendly visits, conversation, and companionship for elderly or isolated community members.',
      icon: <Heart className="h-6 w-6 text-white" />,
      color: 'bg-red-500'
    },
    {
      title: 'Transportation',
      description: 'Rides to medical appointments, grocery stores, or other essential services for those without transport.',
      icon: <Clock className="h-6 w-6 text-white" />,
      color: 'bg-green-500'
    },
    {
      title: 'Mentoring',
      description: 'Guidance, tutoring, and support for youth, students, or adults seeking personal development.',
      icon: <Users className="h-6 w-6 text-white" />,
      color: 'bg-purple-500'
    },
    {
      title: 'Event Support',
      description: 'Volunteers for community events, fundraisers, clean-ups, and other local initiatives.',
      icon: <Calendar className="h-6 w-6 text-white" />,
      color: 'bg-amber-500'
    },
    {
      title: 'Specialized Skills',
      description: 'Professional services like legal advice, healthcare consultations, or technical assistance.',
      icon: <Star className="h-6 w-6 text-white" />,
      color: 'bg-indigo-500'
    },
  ];

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Our Service Categories</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Community Catalyst offers various categories of services where volunteers can help community members in need.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <CategoryCard
            key={index}
            title={category.title}
            description={category.description}
            icon={category.icon}
            color={category.color}
          />
        ))}
      </div>
    </div>
  );
};

export default ServiceCategories; 