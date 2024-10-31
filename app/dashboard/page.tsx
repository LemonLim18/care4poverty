"use client"; // Ensure this is a client component

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // For redirection
import { getUser, signOut } from '../../lib/authFactory'; // Adjust the import path
import { Button } from "@/components/ui/button"; // Adjust the import path
import { toast } from 'react-toastify'; // For notifications

// Define a User type based on your application structure
type User = {
    email?: string;
};

function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);  // Initialize user state with type User or null
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const currentUser: User | null = await getUser();
            if (!currentUser) {
                toast.error('User not found! Redirecting to login...');
                router.push('/auth/login'); // Redirect to login if no user is found
            } else {
                setUser(currentUser);
            }
        };

        fetchUser();
    }, [router]);

    const handleLogout = async () => {
        await signOut();
        toast.success('Successfully logged out!');
        router.push('/auth/login'); // Redirect to login page after logout
    };

    const handleTest = async () => {
        console.log("user: ", user); 
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            {user ? (
                <div className="mt-4">
                    <p>Welcome, {user.email}!</p>
                    <div className="gap-2">
                        <Button onClick={handleLogout}>Log Out</Button>
                        <Button onClick={handleTest}>Test</Button>
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default DashboardPage;
