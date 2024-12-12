"use client";

import { useEffect, useState } from 'react';
import SideBarComponent from "@/components/dashboard/sideBar"; // Adjust the import path
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { UserType } from '@/datatypes/types';
import { getUser, signOut } from '@/lib/authFactory';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import eventImage1 from "@/public/images/dummy/event1.jpeg";
import eventImage2 from "@/public/images/dummy/event2.jpg";
import eventImage3 from "@/public/images/dummy/event3.jpeg";
import eventImage4 from "@/public/images/dummy/event4.jpg";
import eventImage5 from "@/public/images/dummy/event5.jpeg";
import eventImage6 from "@/public/images/dummy/event6.jpg";
import { supabase } from "@/lib/supabaseClient";
import Link from 'next/link';  // Add this import at the top of your file
import { Select, SelectItem, SelectLabel, SelectGroup, SelectContent, SelectValue, SelectTrigger } from '@/components/ui/select';
import { MapPin, BookImage, ChartPie } from "lucide-react";

const EventImages = () => [
    eventImage1,
    eventImage2,
    eventImage3,
    eventImage4,
    eventImage5,
    eventImage6
];

const EventPage = () => {
    const [userData, setUserData] = useState<UserType | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    
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
            <main className="h-screen w-screen flex flex-col mt-8 md:ml-10 ml-5 md:mr-10 mr-5">
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
                <div className="mt-1 mb-2 flex">
                    <BookImage className="text-3xl sm:text-4xl md:text-5xl mr-2" size={30}/>
                    <h2 className="font-roboto text-lg sm:text-xl md:text-2xl">Recent Events</h2>
                </div>

                {/* Recent events */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index}>
                            <Card
                                className="cursor-pointer hover:bg-blue-100 transition-colors duration-200 overflow-hidden"
                                onClick={() => {/* Handle card click */}}
                            >
                                <CardContent className="flex flex-col">
                                    <Image
                                        src={EventImages()[index]} 
                                        alt={`Event ${index + 1}`} 
                                        className="mb-2 h-48 w-full rounded-t-lg object-cover transition-transform duration-200 hover:scale-110"
                                    />
                                    <div className="m-4 flex justify-between items-center">
                                        <div>
                                            <span className="text-2xl font-semibold">Card {index + 1}</span>
                                            <p className="text-sm">This is a short description of Card {index + 1}.</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>

                <Separator className="mt-8"/>                
                
                <div className="mt-7 md:justify-center flex">
                    <ChartPie className="text-3xl sm:text-4xl md:text-5xl mr-2" size={36}/>
                    <h2 className="font-giorgio font-bold text-3xl sm:text-4xl md:text-5xl">Select a Category</h2>
                </div>
                
                <div className="mt-8 mb-8 block md:hidden">
                    <div className="mb-6">
                        <Select onValueChange={(value) => setSelectedCategory(value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select here" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Events</SelectLabel>
                                    <SelectItem value="All">All</SelectItem>
                                    <SelectItem value="Donation">Donation</SelectItem>
                                    <SelectItem value="FunRun">Fun Run</SelectItem>
                                    <SelectItem value="GalaEvent">Gala Event</SelectItem>
                                    <SelectItem value="Concert">Concert</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).filter((_, index) => {
                            if (selectedCategory === "All") return true;
                            return false;
                        }).map((_, index) => (
                            <div key={index}>
                                <Card
                                    className="cursor-pointer hover:bg-gray-50 transition-colors duration-200 overflow-hidden"
                                    onClick={() => {/* Handle card click */}}
                                >
                                    <CardContent className="flex flex-col">
                                        <Image
                                            src={EventImages()[index]} 
                                            alt={`Event ${index + 1}`} 
                                            className="mb-2 h-48 w-full rounded-t-lg object-cover transition-transform duration-200 hover:scale-110"
                                        />
                                        <div className="m-4 flex justify-between items-center">
                                            <div>
                                                <span className="text-2xl font-semibold">Card {index + 1}</span>
                                                <p className="text-sm">This is a short description of Card {index + 1}.</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).filter((_, index) => {
                            if (selectedCategory === "Donation") return true;
                            return false;
                        }).map((_, index) => (
                            <div key={index}>
                                <Card
                                    className="cursor-pointer hover:bg-gray-50 transition-colors duration-200 overflow-hidden"
                                    onClick={() => {/* Handle card click */}}
                                >
                                    <CardContent className="flex flex-col">
                                        <Image
                                            src={EventImages()[index]} 
                                            alt={`Event ${index + 1}`} 
                                            className="mb-2 h-48 w-full rounded-t-lg object-cover transition-transform duration-200 hover:scale-110"
                                        />
                                        <div className="m-4 flex justify-between items-center">
                                            <div>
                                                <span className="text-2xl font-semibold">Card {index + 1}</span>
                                                <p className="text-sm">This is a short description of Card {index + 1}.</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).filter((_, index) => {
                            if (selectedCategory === "FunRun") return true;
                            return false;
                        }).map((_, index) => (
                            <div key={index}>
                                <Card
                                    className="cursor-pointer hover:bg-gray-50 transition-colors duration-200 overflow-hidden"
                                    onClick={() => {/* Handle card click */}}
                                >
                                    <CardContent className="flex flex-col">
                                        <Image
                                            src={EventImages()[index]} 
                                            alt={`Event ${index + 1}`} 
                                            className="mb-2 h-48 w-full rounded-t-lg object-cover transition-transform duration-200 hover:scale-110"
                                        />
                                        <div className="m-4 flex justify-between items-center">
                                            <div>
                                                <span className="text-2xl font-semibold">Card {index + 1}</span>
                                                <p className="text-sm">This is a short description of Card {index + 1}.</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).filter((_, index) => {
                            if (selectedCategory === "GalaEvent") return true;
                            return false;
                        }).map((_, index) => (
                            <div key={index}>
                                <Card
                                    className="cursor-pointer hover:bg-gray-50 transition-colors duration-200 overflow-hidden"
                                    onClick={() => {/* Handle card click */}}
                                >
                                    <CardContent className="flex flex-col">
                                        <Image
                                            src={EventImages()[index]} 
                                            alt={`Event ${index + 1}`} 
                                            className="mb-2 h-48 w-full rounded-t-lg object-cover transition-transform duration-200 hover:scale-110"
                                        />
                                        <div className="m-4 flex justify-between items-center">
                                            <div>
                                                <span className="text-2xl font-semibold">Card {index + 1}</span>
                                                <p className="text-sm">This is a short description of Card {index + 1}.</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).filter((_, index) => {
                            if (selectedCategory === "Concert") return true;
                            return false;
                        }).map((_, index) => (
                            <div key={index}>
                                <Card
                                    className="cursor-pointer hover:bg-gray-50 transition-colors duration-200 overflow-hidden"
                                    onClick={() => {/* Handle card click */}}
                                >
                                    <CardContent className="flex flex-col">
                                        <Image
                                            src={EventImages()[index]} 
                                            alt={`Event ${index + 1}`} 
                                            className="mb-2 h-48 w-full rounded-t-lg object-cover transition-transform duration-200 hover:scale-110"
                                        />
                                        <div className="m-4 flex justify-between items-center">
                                            <div>
                                                <span className="text-2xl font-semibold">Card {index + 1}</span>
                                                <p className="text-sm">This is a short description of Card {index + 1}.</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 mb-8 hidden md:block">
                    <Tabs defaultValue="All">
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="All">All</TabsTrigger>
                            <TabsTrigger value="Donation">Donation</TabsTrigger>
                            <TabsTrigger value="FunRun">Fun Run</TabsTrigger>
                            <TabsTrigger value="GalaEvent">Gala Event</TabsTrigger>
                            <TabsTrigger value="Concert">Concert</TabsTrigger>
                        </TabsList>
                        <TabsContent value="All">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <div key={index}>
                                        <Card
                                            className="cursor-pointer hover:bg-gray-50 transition-colors duration-200 overflow-hidden"
                                            onClick={() => {/* Handle card click */}}
                                        >
                                            <CardContent className="flex flex-col">
                                                <Image
                                                    src={EventImages()[index]} 
                                                    alt={`Event ${index + 1}`} 
                                                    className="mb-2 h-48 w-full rounded-t-lg object-cover transition-transform duration-200 hover:scale-110"
                                                />
                                                <div className="m-4 flex justify-between items-center">
                                                    <div>
                                                        <span className="text-2xl font-semibold">Card {index + 1}</span>
                                                        <p className="text-sm">This is a short description of Card {index + 1}.</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="Donation">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <div key={index}>
                                        <Card
                                            className="cursor-pointer hover:bg-gray-50 transition-colors duration-200 overflow-hidden"
                                            onClick={() => {/* Handle card click */}}
                                        >
                                            <CardContent className="flex flex-col">
                                                <Image
                                                    src={EventImages()[index]} 
                                                    alt={`Event ${index + 1}`} 
                                                    className="mb-2 h-48 w-full rounded-t-lg object-cover transition-transform duration-200 hover:scale-110"
                                                />
                                                <div className="m-4 flex justify-between items-center">
                                                    <div>
                                                        <span className="text-2xl font-semibold">Card {index + 1}</span>
                                                        <p className="text-sm">This is a short description of Card {index + 1}.</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="FunRun">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <div key={index}>
                                        <Card
                                            className="cursor-pointer hover:bg-gray-50 transition-colors duration-200 overflow-hidden"
                                            onClick={() => {/* Handle card click */}}
                                        >
                                            <CardContent className="flex flex-col">
                                                <Image
                                                    src={EventImages()[index]} 
                                                    alt={`Event ${index + 1}`} 
                                                    className="mb-2 h-48 w-full rounded-t-lg object-cover transition-transform duration-200 hover:scale-110"
                                                />
                                                <div className="m-4 flex justify-between items-center">
                                                    <div>
                                                        <span className="text-2xl font-semibold">Card {index + 1}</span>
                                                        <p className="text-sm">This is a short description of Card {index + 1}.</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="GalaEvent">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <div key={index}>
                                        <Card
                                            className="cursor-pointer hover:bg-gray-50 transition-colors duration-200 overflow-hidden"
                                            onClick={() => {/* Handle card click */}}
                                        >
                                            <CardContent className="flex flex-col">
                                                <Image
                                                    src={EventImages()[index]} 
                                                    alt={`Event ${index + 1}`} 
                                                    className="mb-2 h-48 w-full rounded-t-lg object-cover transition-transform duration-200 hover:scale-110"
                                                />
                                                <div className="m-4 flex justify-between items-center">
                                                    <div>
                                                        <span className="text-2xl font-semibold">Card {index + 1}</span>
                                                        <p className="text-sm">This is a short description of Card {index + 1}.</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="Concert">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <div key={index}>
                                        <Card
                                            className="cursor-pointer hover:bg-gray-50 transition-colors duration-200 overflow-hidden"
                                            onClick={() => {/* Handle card click */}}
                                        >
                                            <CardContent className="flex flex-col">
                                                <Image
                                                    src={EventImages()[index]} 
                                                    alt={`Event ${index + 1}`} 
                                                    className="mb-2 h-48 w-full rounded-t-lg object-cover transition-transform duration-200 hover:scale-110"
                                                />
                                                <div className="m-4 flex justify-between items-center">
                                                    <div>
                                                        <span className="text-2xl font-semibold">Card {index + 1}</span>
                                                        <p className="text-sm">This is a short description of Card {index + 1}.</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                <Separator />

                {/* Subtitle*/}
                <div className="mt-7 flex items-center">
                    <MapPin className="text-3xl mb-6 sm:text-4xl md:text-5xl mr-2" size={36}/>
                    <h2 className="font-giorgio font-bold text-3xl mb-6 sm:text-4xl md:text-5xl">Events near you</h2>
                </div>

                {/* Events near you */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index}>
                            <Card
                                className="cursor-pointer hover:bg-gray-50 transition-colors duration-200 overflow-hidden"
                                onClick={() => {/* Handle card click */}}
                            >
                                <CardContent className="flex flex-col">
                                    <Image
                                        src={EventImages()[index]} 
                                        alt={`Event ${index + 1}`} 
                                        className="mb-2 h-48 w-full rounded-t-lg object-cover transition-transform duration-200 hover:scale-110"
                                    />
                                    <div className="m-4 flex justify-between items-center">
                                        <div>
                                            <span className="text-2xl font-semibold">Card {index + 1}</span>
                                            <p className="text-sm">This is a short description of Card {index + 1}.</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
                
                <Separator className="mt-8"/>

            </main>
        </div>
    );
};

export default EventPage; 