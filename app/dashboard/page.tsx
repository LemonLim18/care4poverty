"use client"; // Ensure this is a client component

import { useEffect, useState } from 'react';
import SideBarComponent from "@/components/dashboard/sideBar"; // Adjust the import path
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation'; // For redirection
import { UserType } from  "@/datatypes/types";
import { getUser, signOut } from '../../lib/authFactory'; // Adjust the import path
import { toast } from 'react-toastify'; // For notifications
import { getRecordById } from '@/lib/supabaseAPI';

  
const DashboardPage = () => {
    const [userData, setUserData] = useState<UserType | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const router = useRouter();
    
    useEffect(() => {        
        const fetchUser = async () => {
            const currentUser: User | null = await getUser();
            console.log("Current User: ", currentUser);
            if (!currentUser) {
                toast.error('User not found! Redirecting to login...', {
                    autoClose: 1350,
                });
                router.push('/auth/login');
            } else {
                setUser(currentUser);
                setUserId(currentUser.id);
                // Fetch user data after getting the current user
                fetchUserData(currentUser.id);
            }
        };

        const fetchUserData = async (userId: string) => {
            const { data: userData, error: fetchError } = await getRecordById('users', userId);
            if (fetchError) {
                console.error('Error fetching user data:', fetchError.message);
                return;
            }
            if (userData) {
                sessionStorage.setItem('user', JSON.stringify(userData)); // Store user data
                setUserData(userData); // Set user data in state
                console.log('User data stored in session storage:', userData);
            } else {
                console.error("User data is undefined.");
            }
        }; 

        fetchUser();

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
    }, []);

    const handleLogout = async () => {
        await signOut();
        sessionStorage.clear(); // Clear session storage
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
