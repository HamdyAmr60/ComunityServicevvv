import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Star, Check } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const StarRating = ({ rating, setRating }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating && setRating(star)}
          className={`text-${star <= rating ? 'cc-accent' : 'gray-300'} focus:outline-none`}
        >
          <Star className="w-5 h-5" fill={star <= rating ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
  );
};

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Service Recipient",
    content: "The volunteers who helped me move into my new apartment were absolutely incredible. They were efficient, careful with my belongings, and made a stressful day so much easier. I'm truly grateful for their help!",
    rating: 5,
    date: "March 15, 2025"
  },
  {
    name: "Michael Chen",
    role: "Volunteer",
    content: "Being a volunteer with Community Catalyst has been one of the most rewarding experiences of my life. The platform makes it easy to find opportunities that match my skills and availability.",
    rating: 5,
    date: "February 28, 2025"
  },
  {
    name: "Emily Rodriguez",
    role: "Donor",
    content: "I appreciate how transparent Community Catalyst is about where donations go. I can see exactly which projects my contributions are supporting and the impact they're making in our community.",
    rating: 4,
    date: "April 2, 2025"
  },
  {
    name: "David Kim",
    role: "Service Recipient",
    content: "The tutoring services provided through this platform have made a huge difference for my son. His grades have improved dramatically, and he's much more confident in his academic abilities.",
    rating: 5,
    date: "March 22, 2025"
  }
];

const TestimonialCard = ({ testimonial }) => (
  <Card>
    <CardHeader className="pb-2">
      <div className="flex justify-between items-center">
        <div>
          <CardTitle className="text-lg">{testimonial.name}</CardTitle>
          <CardDescription>{testimonial.role}</CardDescription>
        </div>
        <StarRating rating={testimonial.rating} />
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-gray-700 mb-2">{testimonial.content}</p>
      <p className="text-sm text-gray-500">{testimonial.date}</p>
    </CardContent>
  </Card>
);

const ImpactStats = () => (
  <div className="max-w-4xl mx-auto">
    <div className="text-center mb-8">
      <h3 className="text-2xl font-semibold mb-4">Community Impact</h3>
      <p className="text-gray-700">
        Your feedback helps us improve our services and measure our impact in the community.
      </p>
    </div>
    
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      <Card className="text-center">
        <CardHeader className="pb-2">
          <CardTitle className="text-3xl text-cc-primary">98%</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700">User Satisfaction</p>
        </CardContent>
      </Card>
      
      <Card className="text-center">
        <CardHeader className="pb-2">
          <CardTitle className="text-3xl text-cc-secondary">1,200+</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700">Services Provided</p>
        </CardContent>
      </Card>
      
      <Card className="text-center">
        <CardHeader className="pb-2">
          <CardTitle className="text-3xl text-cc-accent">500+</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700">Active Volunteers</p>
        </CardContent>
      </Card>
      
      <Card className="text-center">
        <CardHeader className="pb-2">
          <CardTitle className="text-3xl text-purple-500">4.8/5</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700">Average Rating</p>
        </CardContent>
      </Card>
    </div>
  </div>
);

const FeedbackForm = () => {
  const [rating, setRating] = useState(0);
  const [feedbackType, setFeedbackType] = useState("general");
  const [feedbackText, setFeedbackText] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Please provide a rating",
        description: "Your rating helps us improve our services",
        variant: "destructive"
      });
      return;
    }
    
    if (!feedbackText.trim()) {
      toast({
        title: "Please provide feedback details",
        description: "We value your input to make our community better",
        variant: "destructive"
      });
      return;
    }
    
    // Here you would normally send the data to your backend
    console.log({ name, email, rating, feedbackType, feedbackText });
    
    // Show success message
    toast({
      title: "Feedback submitted successfully!",
      description: "Thank you for helping us improve",
      action: (
        <div className="h-8 w-8 bg-green-500/20 rounded-full flex items-center justify-center">
          <Check className="h-4 w-4 text-green-700" />
        </div>
      ),
    });
    
    // Reset form
    setRating(0);
    setFeedbackText("");
    setName("");
    setEmail("");
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-cc-primary" />
          Share Your Feedback
        </CardTitle>
        <CardDescription>
          Your insights help us improve our community services
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name (Optional)</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="John Doe"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Your Email (Optional)</Label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="john.doe@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Your Rating</Label>
            <div className="flex items-center gap-2">
              <StarRating rating={rating} setRating={setRating} />
              <span className="text-sm text-gray-500">
                {rating > 0 ? `${rating} out of 5 stars` : "Select a rating"}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="feedbackType">Feedback Type</Label>
            <select 
              id="feedbackType" 
              value={feedbackType}
              onChange={(e) => setFeedbackType(e.target.value)}
              className="w-full p-2 border border-input rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="general">General Feedback</option>
              <option value="volunteer">Volunteer Experience</option>
              <option value="service">Service Quality</option>
              <option value="website">Website Usability</option>
              <option value="suggestion">Suggestion</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="feedback">Your Feedback</Label>
            <textarea
              id="feedback"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Please share your experience or suggestions..."
              className="w-full min-h-[120px] p-3 border border-input rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
            />
          </div>
          
          <Button type="submit" className="w-full">Submit Feedback</Button>
        </form>
      </CardContent>
    </Card>
  );
};

const Feedback = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
        <div className="container-cc text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-enter">Community Feedback</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            Your voice helps us build a stronger community. Share your thoughts and experiences.
          </p>
        </div>
      </section>
      
      {/* Feedback Content */}
      <section className="py-12 bg-cc-background flex-grow">
        <div className="container-cc">
          <Tabs defaultValue="testimonials" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto mb-8 grid-cols-3">
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
              <TabsTrigger value="submit">Submit Feedback</TabsTrigger>
              <TabsTrigger value="impact">Impact</TabsTrigger>
            </TabsList>
            
            <TabsContent value="testimonials" className="animate-enter">
              <div className="grid md:grid-cols-2 gap-6">
                {testimonials.map((testimonial, index) => (
                  <TestimonialCard key={index} testimonial={testimonial} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="submit" className="animate-enter">
              <FeedbackForm />
            </TabsContent>
            
            <TabsContent value="impact" className="animate-enter">
              <ImpactStats />
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Feedback;