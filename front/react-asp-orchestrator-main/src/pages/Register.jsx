import React from 'react';
import RegistrationForm from '@/components/RegistrationForm';

const Register = () => {
  return (
    <div className="min-h-screen bg-cc-background flex flex-col">
      <div className="container-cc flex flex-grow items-center justify-center py-12">
        <RegistrationForm />
      </div>
    </div>
  );
};

export default Register; 