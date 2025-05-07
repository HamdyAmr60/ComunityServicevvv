import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServiceRequestForm from '@/components/ServiceRequestForm';
import ServiceCategories from '@/components/ServiceCategories';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Services = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-cc-primary to-blue-600 text-white py-16">
        <div className="container-cc text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-enter">Community Services</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            Request assistance or offer your skills to help others in your community.
          </p>
        </div>
      </section>
      
      {/* Services Content */}
      <section className="py-12 bg-cc-background flex-grow">
        <div className="container-cc">
          <Tabs defaultValue="request" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto mb-8 grid-cols-2">
              <TabsTrigger value="request">Request Service</TabsTrigger>
              <TabsTrigger value="categories">Service Categories</TabsTrigger>
            </TabsList>
            <TabsContent value="request" className="animate-enter">
              <ServiceRequestForm />
            </TabsContent>
            <TabsContent value="categories" className="animate-enter">
              <ServiceCategories />
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Services; 