// app/auth/confirmEmail/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ClipLoader from 'react-spinners/ClipLoader';
import { useSearchParams } from 'next/navigation'; // Use this to get query params
import { MdCheckCircle } from 'react-icons/md'; // Import the checkmark icon

const ConfirmEmail = () => {
  const searchParams = useSearchParams(); // Get search params
  const [status, setStatus] = useState('Email Confirmation');
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false); // Track confirmation state

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const token = searchParams.get('token'); // Get token from search params
      const email = searchParams.get('email'); // Get email from search params

      if (!token || !email) {
        setStatus('Waiting for email confirmation. Please check your email inbox.');
        return; // Exit early without setting loading to false
      }

      // Call verifyOtp with both token and email
      const { error } = await supabase.auth.verifyOtp({ token, email, type: 'email' });

      if (error) {
        setStatus(`Error: ${error.message}`);
      } else {
        setConfirmed(true); // Update confirmed state on success
        setStatus('Email confirmed successfully! You may close this page.'); // Updated message
      }

      setLoading(false); // Only stop loading when we finish verification
    };

    handleEmailConfirmation();
  }, [searchParams]);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="p-8 max-w-md text-center bg-white rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Confirming Your Email</h2>
        {loading ? (
          <div className="flex flex-col items-center">
            <ClipLoader 
              size={50} 
              color="#4A90E2" 
              loading={loading} 
            />
            <p className="text-lg font-medium text-gray-600 mt-4">{status}</p>
          </div>
        ) : (
            <div className="flex flex-col items-center">
                {status.includes('successfully') && (
                  <MdCheckCircle className="text-green-500 mb-2" style={{ fontSize: '48px' }} />
                )}
                <p className={`text-lg font-medium ${status.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
                  {status}
                </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmEmail;
