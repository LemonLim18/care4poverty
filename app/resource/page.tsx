"use client";

import { useEffect, useState } from 'react';
import SideBarComponent from "@/components/dashboard/sideBar"; // Adjust the import path
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { UserType } from '@/datatypes/types';
import { getUser, signOut } from '@/lib/authFactory';
import { toast } from 'react-toastify';
import { Package, Truck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ResourceBar from '@/components/resource/resourceBar'; // Adjust the import path
import ResourceBarSkeleton from '@/components/resource/ResourceBarSkeleton'; // Import the skeleton
import { getRecordById } from "@/lib/supabaseAPI";
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
    const router = useRouter();
    const [resources, setResources] = useState<any[]>([]);
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
                const response = await fetch('/data/resources.json'); // Adjust the path if necessary
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setResources(data);
            } catch (error) {
                console.error('Error fetching resources:', error);
            } finally {
                // setLoading(false); // Set loading to false after fetching
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchResources();
    }); 

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
                            <BreadcrumbItem>
                                <BreadcrumbLink href="#">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>Resources</BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                {/* Title */}
                <div className="mt-7 mb-7">
                    <h1 className="ml-6 font-giorgio font-bold text-4xl sm:text-5xl md:text-6xl">My Resources</h1>
                    {/* <div className="w-full flex justify-end">
                        <Button onClick={()=>{}} className="bg-[#0077B6] hover:bg-[#038BD4] mr-6">Add Resource</Button>
                    </div> */}

                    {/* Replaced with Resource List */}
                    {/* <div className=" grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 p-6">
                        {loading ? (
                            // Show skeletons while loadingz
                            Array.from({ length: 10 }).map((_, index) => (
                                <ResourceBarSkeleton key={index} />
                            ))
                        ) : (
                            resources.map((resource, index) => (
                                <ResourceBar 
                                    key={index}
                                    icon={resource.icon === "Package" ? Package : resource.icon === "Truck" ? Truck : Users} // Map icon names to actual components
                                    name={resource.name}
                                    category={resource.category}
                                    number={resource.number}
                                    // actionLabel={resource.actionLabel}
                                    // onActionClick={() => handleAction(resource.name)}
                                />
                            ))
                        )}
                    </div> */}
                    {/* For listing the resources */}
                    <ResourceList loading={loading} resources={resources} />                    
                </div>
            </main>
        </div>
        
    );
};

export default ResourcePage; 