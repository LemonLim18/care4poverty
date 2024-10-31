"use client"; // Add this line at the top

import { useState } from 'react';
import { signIn } from '../../../lib/authFactory'; // Adjust the import path
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input' // Make sure you have an Input component
import { Card, CardContent, CardTitle } from '@/components/ui/card'; // Ensure you have a Card component
import { useRouter } from 'next/navigation'; // For redirection
import { toast, ToastContainer } from 'react-toastify'; // Optional: For notifications
import 'react-toastify/dist/ReactToastify.css'; // Make sure to include this import for the toast styles


const LoginPage =  () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // For redirection

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      toast.error(error.message); // Show error message
    } else {
      toast.success("Successfully logged in!", {
        autoClose: 2250, // Toast will disappear after 2500 ms
      });
      setTimeout(() => {
        router.push('/dashboard'); // Redirect to the dashboard after successful registration
      },2500)
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-96">
        <CardContent>
          <CardTitle className="text-center">Login</CardTitle>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'Sign In'}
            </Button>
          </form>
          <p className="mt-4 text-center">
            Don't have an account? 
            <button className="text-blue-500" onClick={() => router.push('/auth/signup')}>
              Sign Up
            </button>
          </p>
        </CardContent>
      </Card>
      {/* Toast container */}
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
