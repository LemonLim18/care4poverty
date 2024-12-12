"use client"; // Ensure this is a client component

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // For redirection
import { getUser, signOut } from '../../lib/authFactory'; // Adjust the import path
import { Button } from "@/components/ui/button"; // Adjust the import path
import { toast } from 'react-toastify'; // For notifications
import Image from 'next/image';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarProvider,
} from "@/components/ui/sidebar";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, Settings, User, LogOut, BarChart, Package, Building, Send, ChevronRight, Bell, Calendar } from "lucide-react"; // Import icons
import logoPng from "@/public/images/logo.png";
import { Card, CardContent } from '@/components/ui/card';
import eventImage1 from "@/public/images/event1.jpeg";
import eventImage2 from "@/public/images/event2.jpg";
import eventImage3 from "@/public/images/event3.jpeg";
import eventImage4 from "@/public/images/event4.jpg";
import Link from 'next/link';  // Add this import at the top of your file
// Define a User type based on your application structure
type User = {
    email?: string;
};

function EventPage() {
    const [user, setUser] = useState<User | null>(null);  // Initialize user state with type User or null
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const currentUser: User | null = await getUser();
            if (!currentUser) {
                toast.error('User not found! Redirecting to login...', {
                    autoClose: 1350,
                });
                router.push('/auth/login'); // Redirect to login if no user is found
            } else {
                setUser(currentUser);
            }
        };

        fetchUser();
    }, [router]);

    const handleLogout = async () => {
        await signOut();
        toast.success('Successfully logged out!', {
            autoClose: 1250, // Toast will disappear after 1500s
        });
        setTimeout(() => {
            router.push('/auth/login'); // Redirect to login page after logout
        }, 1000);
    };

    const handleTest = async () => {
        console.log("user: ", user); 
    }

    return (
        <div className="h-screen flex">
            <SidebarProvider>
                <Sidebar className="w-64 border-r">
                    <SidebarHeader className="flex flex-col items-center justify-center w-full bg-[#0077B6] p-4 pb-2">
                        <Image
                          src={logoPng}
                          alt="Care4Poverty logo"
                          className="w-36"
                        />
                        <Avatar className="h-24 w-24">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <h2 className="font-giorgio text-2xl text-white font-bold tracking-wide">ABC Charity Society</h2>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarGroup className='bg-[#0077B6]'>
                            <h4 className="font-roboto text-[#D2D2D2] text-xsm mx-2">Account</h4>
                            <button className="flex items-center justify-between gap-2 w-full p-2 text-white hover:bg-[#038BD4] rounded-lg">
                                <div className="flex items-center gap-2">
                                    <User size={18} />
                                    <span className="font-roboto text-sm">Profile</span>
                                </div>
                                <ChevronRight size={18}/>
                            </button>
                            <button className="flex items-center justify-between w-full p-2 text-white hover:bg-[#038BD4] rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Building size={18} />
                                    <span className="font-roboto text-sm">Organization</span>
                                </div>
                                <ChevronRight size={18} />
                            </button>
                            <h4 className="font-roboto text-[#D2D2D2] text-xsm mt-5 mx-2">Home</h4>
                            <button className="flex items-center justify-between w-full p-2 text-white hover:bg-[#038BD4] rounded-lg">
                                <div className="flex items-center gap-2">
                                    <BarChart size={18} />
                                    <span className="font-roboto text-sm">Dashboard</span>
                                </div>
                                <ChevronRight size={18} />
                            </button>
                            <button className="flex items-center justify-between w-full p-2 text-white hover:bg-[#038BD4] rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Send size={18} />
                                    <span className="font-roboto text-sm">Request</span>
                                </div>
                                <ChevronRight size={18} />
                            </button>
                            <button className="flex items-center justify-between w-full p-2 text-white hover:bg-[#038BD4] rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Package size={18} />
                                    <span className="font-roboto text-sm">Resource</span>
                                </div>
                                <ChevronRight size={18} />
                            </button>
                            <button className="flex items-center justify-between w-full p-2 text-white hover:bg-[#038BD4] rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Bell size={18} />
                                    <span className="font-roboto text-sm">Notification</span>
                                </div>
                                <ChevronRight size={18} />
                            </button>
                            <button className="flex items-center justify-between w-full p-2 text-white hover:bg-[#038BD4] rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Calendar size={18} />
                                    <span className="font-roboto text-sm">Event</span>
                                </div>
                                <ChevronRight size={18} />
                            </button>
                        </SidebarGroup>
                    </SidebarContent>
                    <SidebarFooter className="bg-[#0077B6] p-4">
                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full p-2 text-white hover:bg-[#038BD4] rounded-lg"
                        >
                            <LogOut size={20} />
                            <span className="font-roboto text-sm">Logout</span>
                        </button>
                    </SidebarFooter>
                </Sidebar>
            </SidebarProvider>

            {/* Main Content */}
            <div className="h-screen w-screen flex flex-col mt-8 md:ml-10 sm:ml-8 md:mr-10 sm:mr-8">
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
            </div>
        </div>
    );
}

export default EventPage;