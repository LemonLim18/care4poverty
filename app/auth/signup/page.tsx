"use client";

import { useState, useEffect } from 'react';
import { signUp, checkEmailConfirmation } from '../../../lib/authFactory'; // Assume this function checks confirmation status
import { Button } from "@/components/ui/button"; 
import { Input } from '@/components/ui/input'; 
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdCheckCircle } from 'react-icons/md';
import ClipLoader from 'react-spinners/ClipLoader';
import { useUserContext } from "../../context/UserContext"; // Import the UserContext


const SignupPage = () => {
  const { setUserUid } = useUserContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState('Waiting for email confirmation...');
  const [modalLoading, setModalLoading] = useState(true);
  const router = useRouter();

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const { data, error } = await signUp(email, password);

    console.log("Data:", data)

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    // Check if user is not null before accessing id
    if (data.user) {
     const { id } = data.user; // Now it's safe to access id
     setUserUid(id); // Use the id as needed
     console.log("Id passed to userContext: ", id)
    } else {
        toast.error('User data is not available');
    }

  //   const data = {
  //     user: {
  //         app_metadata: {
  //             provider: "email",
  //             providers: ['email']
  //         },
  //         aud: "authenticated",
  //         confirmation_sent_at: "2024-10-30T18:32:32.17170897Z",
  //         created_at: "2024-10-30T18:32:32.17170897Z",
  //         email: "limmiinning@gmail.com",
  //         id: "f7194ea2-92f0-4513-a5d3-f6afe07d2f77",
  //         identities: [],
  //         is_anonymous: false,
  //         phone: "",
  //         role: "",
  //         updated_at: "2024-10-30T18:32:32.17170897Z",
  //         user_metadata: {}
  //     },
  //     session: null
  // };

    toast.success('Check your email for the confirmation link!');
    setIsModalOpen(true);
    setStatus('Waiting for email confirmation. Please check your email inbox.');
    setLoading(false);

    // Start polling for email confirmation
    startPollingForConfirmation();
  };

  const startPollingForConfirmation = () => {
    const pollInterval = setInterval(async () => {
      const isConfirmed = await checkEmailConfirmation(email); // Poll for confirmation status

      console.log("isConfirmed: ",isConfirmed)
      if (isConfirmed) {
        clearInterval(pollInterval);
        setModalLoading(false);
        setStatus('Email confirmed successfully! Redirecting to login...');
        
        setTimeout(() => {
          setIsModalOpen(false);
          router.push('/auth/register'); // Redirect after confirmation
        }, 2000);
      }
    }, 3000); // Check every 3 seconds
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-96">
        <CardContent>
          <CardTitle className="text-center">Sign Up</CardTitle>
          <form onSubmit={handleSignup} className="space-y-4">
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
              {loading ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </form>
          <p className="mt-4 text-center">
            Already have an account?{' '}
            <button className="text-blue-500" onClick={() => router.push('/auth/login')}>
              Sign In
            </button>
          </p>
        </CardContent>
      </Card>

      {/* Toast container */}
      <ToastContainer />

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="p-8 max-w-md text-center bg-white rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Confirming Your Email</h2>
            {modalLoading ? (
              <div className="flex flex-col items-center">
                <ClipLoader size={50} color="#4A90E2" loading={modalLoading} />
                <p className="text-lg font-medium text-gray-600 mt-4">{status}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <MdCheckCircle className="text-green-500 mb-2" style={{ fontSize: '48px' }} />
                <p className="text-lg font-medium text-green-600">{status}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupPage;
