
import React from 'react';
import LoginForm from '@/components/LoginForm';

const Login = () => {
  return (
    <div className="min-h-screen bg-cc-background flex flex-col">
      <div className="container-cc flex flex-grow items-center justify-center py-12">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
