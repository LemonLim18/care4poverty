"use client"; // Add this line at the top

import { useEffect } from 'react';
import { checkUserAndRedirect } from '@/lib/authFactory'; // Adjust the import path

const CheckUserPage = () => {
    useEffect(() => {
        checkUserAndRedirect(); // Call the function to check user existence and redirect
    }, []);

    return (
        <div className="h-[100vh] w-full flex justify-center items-center">
            Loading...
        </div>
    ); // Show a loading state while checking
};

export default CheckUserPage; 