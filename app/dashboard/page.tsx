"use client"; // Ensure this is a client component

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // For redirection
import { getUser, signOut } from '../../lib/authFactory'; // Adjust the import path
import { toast } from 'react-toastify'; // For notifications
import { UserType } from  "@/datatypes/types";
import SideBarComponent from "@/components/dashboard/sideBar"; // Adjust the import path

// Define a User type based on your application structure
type User = {
    email?: string;
};  
  
const DashboardPage = () => {
    const [userData, setUserData] = useState<UserType | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    
    useEffect(() => {
        // Check if window is defined (client-side)
        if (typeof window !== 'undefined') {
            const storedUserData = sessionStorage.getItem('user');
            if (storedUserData) {
                const parsedUserData = JSON.parse(storedUserData);
                setUserData(parsedUserData);
                console.log("Session Storage: ", parsedUserData);
            } else {
                console.log('No user data found in session storage');
            }
        }

        const fetchUser = async () => {
            const currentUser: User | null = await getUser();
            if (!currentUser) {
                toast.error('User not found! Redirecting to login...', {
                    autoClose: 1350,
                });
                router.push('/auth/login');
            } else {
                setUser(currentUser);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        await signOut();
        toast.success('Successfully logged out!', {
            autoClose: 1250, // Toast will disappear after 1500s
        });
        setTimeout(() => {
            router.push('/auth/login'); // Redirect to login page after logout
        }, 1000);
    };

    // const handleTest = async () => {
        // console.log("Show the session storage: ", user); 
    // }

    return (
        <div className="h-screen flex">
            <SideBarComponent 
                userData={userData || undefined}
                onLogout={handleLogout}
            />

            {/* Main Content */}
            {/* bg-blue-200 */}
            <main className="bg-white w-full flex-1 p-8 flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold">Welcome</h1>
                {user ? (
                    <div className="mt-4">
                        <p>Welcome, {user.email}!</p>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </main>
        </div>
    );
}

export default DashboardPage;
