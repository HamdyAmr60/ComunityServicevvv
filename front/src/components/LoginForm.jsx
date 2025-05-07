import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .required('Password is required')
});

const LoginForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-auto">
      <div className="flex justify-center mb-6">
        <div className="h-16 w-16 rounded-full bg-cc-primary flex items-center justify-center">
          <LogIn className="h-8 w-8 text-white" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-center mb-6 text-cc-primary">Welcome Back</h2>
      
      <Formik
        initialValues={{
          email: '',
          password: ''
        }}
        validationSchema={loginSchema}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          try {
            const result = await authService.login(values);
            
            if (result.success) {
              toast({
                title: 'Login successful',
                description: 'Welcome back!',
              });
              navigate('/dashboard');
            } else {
              setStatus({ error: result.errors[0] || 'Login failed. Please try again.' });
            }
          } catch (error) {
            setStatus({ error: 'An unexpected error occurred. Please try again.' });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, errors, touched, status }) => (
          <Form className="space-y-4">
            {status?.error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{status.error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-cc-muted">Email</Label>
              <Field name="email">
                {({ field }) => (
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className={`${errors.email && touched.email ? 'border-red-500' : 'border-cc-border'} focus:ring-cc-primary px-4 py-3`}
                    disabled={isSubmitting}
                  />
                )}
              </Field>
              {errors.email && touched.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-cc-muted">Password</Label>
                <a href="/forgot-password" className="text-sm text-cc-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <Field name="password">
                {({ field }) => (
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    placeholder="********"
                    className={`${errors.password && touched.password ? 'border-red-500' : 'border-cc-border'} focus:ring-cc-primary px-4 py-3`}
                    disabled={isSubmitting}
                  />
                )}
              </Field>
              {errors.password && touched.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full py-4 bg-cc-primary hover:bg-cc-primary/90 text-white" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : 'Sign In'}
            </Button>
          </Form>
        )}
      </Formik>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-cc-muted">
          Don't have an account? {' '}
          <a href="/register" className="text-cc-primary hover:underline">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
