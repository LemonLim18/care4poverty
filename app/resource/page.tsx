"use client";

import { useEffect, useState } from 'react';
import SideBarComponent from "@/components/dashboard/sideBar"; // Adjust the import path
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { UserType } from '@/datatypes/types';
import { getUser, signOut } from '@/lib/authFactory';
import { toast } from 'react-toastify';
import { getAllRecords, getRecordById, getRecordsByField } from "@/lib/supabaseAPI";
// later need to get the all resources from a specified organization
import ResourceList from "@/components/resource/resourceList";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const ResourcePage = () => {
    const [userData, setUserData] = useState<UserType | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [resources, setResources] = useState<any[]>([]);
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    // const testLoading = () => {
    //     setLoading(true);
    // }
    
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

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const { data, error } = await getAllRecords('resources'); // Fetch all records from the 'resources' table
                console.log("Resources fetched: ", data);
                if (error) {
                    throw new Error('Error fetching resources: ' + error.message);
                }
                setResources(data || []); // Set to an empty array if data is null
            } catch (error) {
                console.error('Error fetching resources:', error);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchResources();
    }, []); // Re-fetch when the location changes

    const handleLogout = async () => {
        await signOut();
        toast.success('Successfully logged out!', {
            autoClose: 1250, // Toast will disappear after 1500s
        });
        setTimeout(() => {
            router.push('/auth/login'); // Redirect to login page after logout
        }, 1000);
    };

    return (
        <div className="h-screen flex">
            <SideBarComponent 
                userData={userData || undefined}
                onLogout={handleLogout}
            />
            <main className="h-screen w-screen flex flex-col mt-8 md:ml-10 sm:ml-8 md:mr-10 sm:mr-8">
                <div className="flex items-center gap-2">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="ml-6">
                                <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem className="font-bold text-black">Resources</BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                {/* Title */}
                <div className="mt-7 mb-7">
                    <h1 className="ml-6 font-giorgio font-bold text-4xl sm:text-5xl md:text-6xl">My Resources</h1>
                   
                    {/* For listing the resources */}
                    <ResourceList loading={loading} resources={resources} userID ={userId || ''} />                    
                </div>
            </main>
        </div>
        
    );
};

export default ResourcePage; 