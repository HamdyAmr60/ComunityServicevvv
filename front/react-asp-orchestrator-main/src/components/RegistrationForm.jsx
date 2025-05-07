import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertCircle, UserPlus, Loader2 } from 'lucide-react';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

const registrationSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(3, 'Full name must be at least 3 characters')
    .required('Full name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('Password is required'),
  nationalId: Yup.string()
    .min(5, 'National ID is required')
    .required('National ID is required'),
  city: Yup.string()
    .min(2, 'City is required')
    .required('City is required'),
  phoneNumber: Yup.string()
    .min(5, 'Phone number is required')
    .required('Phone number is required'),
  role: Yup.string()
    .oneOf(['serviceSeeker', 'volunteer', 'donor'], 'Please select a valid role')
    .required('Please select a role')
});

const RegistrationForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full mx-auto">
      <div className="flex justify-center mb-6">
        <div className="h-16 w-16 rounded-full bg-cc-secondary flex items-center justify-center">
          <UserPlus className="h-8 w-8 text-white" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-center mb-6 text-cc-secondary">Create an Account</h2>
      
      <Formik
        initialValues={{
          fullName: '',
          email: '',
          password: '',
          nationalId: '',
          city: '',
          phoneNumber: '',
          role: undefined
        }}
        validationSchema={registrationSchema}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          try {
            const result = await authService.register(values);
            
            if (result.success) {
              toast({
                title: 'Registration successful',
                description: 'Your account has been created! Please check your email for verification.',
              });
              navigate('/login');
            } else {
              setStatus({ error: result.errors[0] || 'Registration failed. Please try again.' });
            }
          } catch (error) {
            setStatus({ error: 'An unexpected error occurred. Please try again.' });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, errors, touched, status, values, setFieldValue }) => (
          <Form className="space-y-4">
            {status?.error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{status.error}</AlertDescription>
              </Alert>
            )}
            
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-cc-muted">Full Name</Label>
              <Field name="fullName">
                {({ field }) => (
                  <Input
                    {...field}
                    id="fullName"
                    placeholder="John Doe"
                    className={`${errors.fullName && touched.fullName ? 'border-red-500' : 'border-cc-border'} focus:ring-cc-secondary`}
                    disabled={isSubmitting}
                  />
                )}
              </Field>
              {errors.fullName && touched.fullName && (
                <p className="text-red-500 text-sm">{errors.fullName}</p>
              )}
            </div>
            
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-cc-muted">Email</Label>
              <Field name="email">
                {({ field }) => (
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className={`${errors.email && touched.email ? 'border-red-500' : 'border-cc-border'} focus:ring-cc-secondary`}
                    disabled={isSubmitting}
                  />
                )}
              </Field>
              {errors.email && touched.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
            
            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-cc-muted">Password</Label>
              <Field name="password">
                {({ field }) => (
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    placeholder="********"
                    className={`${errors.password && touched.password ? 'border-red-500' : 'border-cc-border'} focus:ring-cc-secondary`}
                    disabled={isSubmitting}
                  />
                )}
              </Field>
              {errors.password && touched.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>
            
            {/* National ID */}
            <div className="space-y-2">
              <Label htmlFor="nationalId" className="text-cc-muted">National ID</Label>
              <Field name="nationalId">
                {({ field }) => (
                  <Input
                    {...field}
                    id="nationalId"
                    placeholder="123456789"
                    className={`${errors.nationalId && touched.nationalId ? 'border-red-500' : 'border-cc-border'} focus:ring-cc-secondary`}
                    disabled={isSubmitting}
                  />
                )}
              </Field>
              {errors.nationalId && touched.nationalId && (
                <p className="text-red-500 text-sm">{errors.nationalId}</p>
              )}
            </div>
            
            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city" className="text-cc-muted">City</Label>
              <Field name="city">
                {({ field }) => (
                  <Input
                    {...field}
                    id="city"
                    placeholder="New York"
                    className={`${errors.city && touched.city ? 'border-red-500' : 'border-cc-border'} focus:ring-cc-secondary`}
                    disabled={isSubmitting}
                  />
                )}
              </Field>
              {errors.city && touched.city && (
                <p className="text-red-500 text-sm">{errors.city}</p>
              )}
            </div>
            
            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-cc-muted">Phone Number</Label>
              <Field name="phoneNumber">
                {({ field }) => (
                  <Input
                    {...field}
                    id="phoneNumber"
                    placeholder="+1 123-456-7890"
                    className={`${errors.phoneNumber && touched.phoneNumber ? 'border-red-500' : 'border-cc-border'} focus:ring-cc-secondary`}
                    disabled={isSubmitting}
                  />
                )}
              </Field>
              {errors.phoneNumber && touched.phoneNumber && (
                <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
              )}
            </div>
            
            {/* Role Selection */}
            <div className="space-y-2">
              <Label className="text-cc-muted">Role Selection</Label>
              <RadioGroup 
                className="grid grid-cols-3 gap-2" 
                onValueChange={(value) => setFieldValue('role', value)}
                value={values.role}
                disabled={isSubmitting}
              >
                <div className={`flex flex-col items-center p-4 border rounded-md cursor-pointer ${
                  values.role === 'serviceSeeker' ? 'bg-blue-50 border-cc-primary' : 'border-cc-border'
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <RadioGroupItem value="serviceSeeker" id="serviceSeeker" className="sr-only" />
                  <Label 
                    htmlFor="serviceSeeker" 
                    className={`cursor-pointer flex flex-col items-center`}
                  >
                    <span className="text-center font-medium text-cc-muted">Service Seeker</span>
                    <span className="text-xs text-cc-muted mt-1">Request help</span>
                  </Label>
                </div>
                
                <div className={`flex flex-col items-center p-4 border rounded-md cursor-pointer ${
                  values.role === 'volunteer' ? 'bg-green-50 border-cc-secondary' : 'border-cc-border'
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <RadioGroupItem value="volunteer" id="volunteer" className="sr-only" />
                  <Label 
                    htmlFor="volunteer" 
                    className={`cursor-pointer flex flex-col items-center`}
                  >
                    <span className="text-center font-medium text-cc-muted">Volunteer</span>
                    <span className="text-xs text-cc-muted mt-1">Help others</span>
                  </Label>
                </div>
                
                <div className={`flex flex-col items-center p-4 border rounded-md cursor-pointer ${
                  values.role === 'donor' ? 'bg-amber-50 border-cc-accent' : 'border-cc-border'
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <RadioGroupItem value="donor" id="donor" className="sr-only" />
                  <Label 
                    htmlFor="donor" 
                    className={`cursor-pointer flex flex-col items-center`}
                  >
                    <span className="text-center font-medium text-cc-muted">Donor</span>
                    <span className="text-xs text-cc-muted mt-1">Support causes</span>
                  </Label>
                </div>
              </RadioGroup>
              {errors.role && touched.role && (
                <p className="text-red-500 text-sm">{errors.role}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full py-6 bg-cc-secondary hover:bg-cc-secondary/90 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : 'Create Account'}
            </Button>
          </Form>
        )}
      </Formik>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-cc-muted">
          Already have an account? {' '}
          <a href="/login" className="text-cc-secondary hover:underline">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default RegistrationForm; 