"use client"; // Add this line at the top

import { useEffect } from 'react';
import { checkUserAndRedirect } from '@/lib/authFactory'; // Adjust the import path

const CheckUserPage = () => {
    useEffect(() => {
        const timer = setTimeout(() => {
            checkUserAndRedirect();
        }, 3000);
    
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="h-[100vh] w-full flex justify-center items-center">
            <img 
            src="/images/loading.gif" 
            alt="Loading..." 
            draggable={false} 
            onClick={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            />
        </div>
    );
};

export default CheckUserPage;