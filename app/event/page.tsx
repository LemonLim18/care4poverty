"use client";

import { useEffect, useState } from 'react';
import SideBarComponent from "@/components/dashboard/sideBar"; // Adjust the import path
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { UserType } from '@/datatypes/types';
import { getUser, signOut } from '@/lib/authFactory';
import { toast } from 'react-toastify';
import Image from 'next/image';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import logoPng from "@/public/images/logo.png";
import { Card, CardContent } from '@/components/ui/card';
import eventImage1 from "@/public/images/event1.jpeg";
import eventImage2 from "@/public/images/event2.jpg";
import eventImage3 from "@/public/images/event3.jpeg";
import eventImage4 from "@/public/images/event4.jpg";
import Link from 'next/link';  // Add this import at the top of your file

const EventPage = () => {
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

    return (
        <div className="h-screen flex">
            <SideBarComponent 
                userData={userData || undefined}
                onLogout={handleLogout}
            />

            {/* Main Content */}
            <main className="h-screen w-screen flex flex-col mt-8 md:ml-10 sm:ml-8 md:mr-10 sm:mr-8">
                <div className="flex items-center gap-2">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="#">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>Event</BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                {/* Title */}
                <div className="mt-7 mb-7">
                    <h1 className="font-giorgio font-bold text-4xl sm:text-5xl md:text-6xl">Events</h1>
                </div>

                {/* Subtitle */}
                <div className="mt-1">
                    <h2 className="font-roboto text-lg sm:text-xl md:text-2xl">Recent Events</h2>
                </div>

                {/* Recent events */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Card 
                        className="cursor-pointer hover:bg-gray-50 transition-colors duration-200" 
                        onClick={() => {/* Handle card click */}}
                    >
                        <CardContent className="flex flex-col">
                            <Image 
                                src={eventImage1} 
                                alt="Description" 
                                className="mb-2 max-h-48 rounded-t-lg object-cover"
                            />
                            <div className="m-4 flex justify-between items-center">
                                <div>
                                    <span className="text-2xl font-semibold">Card 1</span>
                                    <p className="text-sm">This is a short description of Card 1.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card 
                        className="cursor-pointer hover:bg-gray-50 transition-colors duration-200" 
                        onClick={() => {/* Handle card click */}}
                    >
                        <CardContent className="flex flex-col">
                            <Image 
                                src={eventImage2} 
                                alt="Description" 
                                className="mb-2 max-h-48 rounded-t-lg object-cover"
                            />                            
                            <div className="m-4 flex justify-between items-center">
                                <div>
                                    <span className="text-2xl font-semibold">Card 2</span>
                                    <p className="text-sm">This is a short description of Card 2.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card 
                        className="cursor-pointer hover:bg-gray-50 transition-colors duration-200" 
                        onClick={() => {/* Handle card click */}}
                    >
                        <CardContent className="flex flex-col">
                            <Image 
                                src={eventImage3} 
                                alt="Description" 
                                className="mb-2 max-h-48 rounded-t-lg object-cover"
                            />                            
                            <div className="m-4 flex justify-between items-center">
                                <div>
                                    <span className="text-2xl font-semibold">Card 3</span>
                                    <p className="text-sm">This is a short description of Card 3.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card 
                        className="cursor-pointer hover:bg-gray-50 transition-colors duration-200" 
                        onClick={() => {/* Handle card click */}}
                    >
                        <CardContent className="flex flex-col">
                            <Image 
                                src={eventImage4} 
                                alt="Description" 
                                className="mb-2 max-h-48 rounded-t-lg object-cover"
                            />                            
                            <div className="m-4 flex justify-between items-center">
                                <div>
                                    <span className="text-2xl font-semibold">Card 4</span>
                                    <p className="text-sm">This is a short description of Card 4.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Subtitle */}
                <div className="mt-1">
                    <h2 className="font-roboto text-lg sm:text-xl md:text-2xl">Events near you</h2>
                </div>

                {/* Recent events */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Card 
                        className="cursor-pointer hover:bg-gray-50 transition-colors duration-200" 
                        onClick={() => {/* Handle card click */}}
                    >
                        <CardContent className="flex flex-col">
                            <Image 
                                src={eventImage1} 
                                alt="Description" 
                                className="mb-2 max-h-48 rounded-t-lg object-cover"
                            />
                            <div className="m-4 flex justify-between items-center">
                                <div>
                                    <span className="text-2xl font-semibold">Card 1</span>
                                    <p className="text-sm">This is a short description of Card 1.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card 
                        className="cursor-pointer hover:bg-gray-50 transition-colors duration-200" 
                        onClick={() => {/* Handle card click */}}
                    >
                        <CardContent className="flex flex-col">
                            <Image 
                                src={eventImage2} 
                                alt="Description" 
                                className="mb-2 max-h-48 rounded-t-lg object-cover"
                            />                            
                            <div className="m-4 flex justify-between items-center">
                                <div>
                                    <span className="text-2xl font-semibold">Card 2</span>
                                    <p className="text-sm">This is a short description of Card 2.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card 
                        className="cursor-pointer hover:bg-gray-50 transition-colors duration-200" 
                        onClick={() => {/* Handle card click */}}
                    >
                        <CardContent className="flex flex-col">
                            <Image 
                                src={eventImage3} 
                                alt="Description" 
                                className="mb-2 max-h-48 rounded-t-lg object-cover"
                            />                            
                            <div className="m-4 flex justify-between items-center">
                                <div>
                                    <span className="text-2xl font-semibold">Card 3</span>
                                    <p className="text-sm">This is a short description of Card 3.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card 
                        className="cursor-pointer hover:bg-gray-50 transition-colors duration-200" 
                        onClick={() => {/* Handle card click */}}
                    >
                        <CardContent className="flex flex-col">
                            <Image 
                                src={eventImage4} 
                                alt="Description" 
                                className="mb-2 max-h-48 rounded-t-lg object-cover"
                            />                            
                            <div className="m-4 flex justify-between items-center">
                                <div>
                                    <span className="text-2xl font-semibold">Card 4</span>
                                    <p className="text-sm">This is a short description of Card 4.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default EventPage; 