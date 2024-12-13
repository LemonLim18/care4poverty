"use client";

import { useEffect, useState } from 'react';
import SideBarComponent from "@/components/dashboard/sideBar"; // Adjust the import path
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { UserType } from '@/datatypes/types';
import { getUser, signOut } from '@/lib/authFactory';
import { toast } from 'react-toastify';
import { Select, SelectItem, SelectLabel, SelectGroup, SelectContent, SelectValue, SelectTrigger } from '@/components/ui/select';
import { Breadcrumb, BreadcrumbSeparator, BreadcrumbLink, BreadcrumbItem, BreadcrumbList } from '@/components/ui/breadcrumb';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import avatarImage from "@/public/images/dummy/avatar.jpg";
import sideImage1 from "@/public/images/dummy/charity.jpg";
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerTrigger, DrawerContent, DrawerDescription, DrawerTitle, DrawerHeader, DrawerClose, DrawerFooter } from '@/components/ui/drawer';


const NotificationPage = () => {
    const [userData, setUserData] = useState<UserType | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
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
            {/* bg-blue-200 */}
            <main className="h-screen w-screen flex flex-col mt-8 md:ml-10 ml-5 md:mr-10 mr-5">
                <div className="flex items-center gap-2">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="#">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>Notification</BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <div className="flex">
                    <div className="w-full md:w-2/3 flex flex-col">
                        <div className="mt-7 mb-7">
                            <h1 className="font-giorgio font-bold text-4xl sm:text-5xl md:text-6xl">Notification</h1>
                        </div>
                        <div className="flex justify-start">
                            <div className="w-full md:w-1/3 mb-8">
                                <Select onValueChange={(value) => setSelectedCategory(value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select here" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Timeline</SelectLabel>
                                            <SelectItem value="AllTime">All Time</SelectItem>
                                            <SelectItem value="Today">Today</SelectItem>
                                            <SelectItem value="3days">3 days ago</SelectItem>
                                            <SelectItem value="1week">1 week ago</SelectItem>
                                            <SelectItem value="1month">1 month ago</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <Drawer>
                                {Array.from({ length: 10 }).map((_, index) => (
                                    <div key={index}>
                                        <DrawerTrigger asChild>
                                            <button className="flex w-full hover:bg-blue-100 rounded-lg transition duration-200 p-4">
                                                <div className="mr-4">
                                                    <div className="flex items-center">
                                                        <Avatar>
                                                            <AvatarImage 
                                                                src={avatarImage.src} 
                                                                alt="avatar" 
                                                                className='object-cover max-h-48'
                                                            />
                                                            <AvatarFallback>H</AvatarFallback>
                                                        </Avatar>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col text-left">
                                                    <h1 className="font-roboto font-bold text-xl">Donation Provided</h1>
                                                    <p className="font-roboto text-sm">Dicky has donated a box, an apple and a beer.</p>
                                                </div>
                                            </button>
                                        </DrawerTrigger>
                                        <div className='w-full'>
                                            <Separator className='mt-2 mb-2'/>
                                        </div>
                                    </div>
                                ))}
                                <DrawerContent>
                                    <div className="mx-auto w-full max-w-sm">
                                        <DrawerHeader>
                                            <DrawerTitle className="font-roboto font-bold text-3xl">Donation Provided</DrawerTitle>
                                            <DrawerDescription className="font-roboto text-2x1">Dicky has donated a box, an apple and a beer.</DrawerDescription>
                                            <p className="font-roboto text-sm text-gray-500">{new Date().toLocaleString()}</p>
                                        </DrawerHeader>
                                        <div className="flex items-center">
                                            <div className="mr-2">
                                                <Avatar>
                                                    <AvatarImage 
                                                        src={avatarImage.src} 
                                                        alt="avatar" 
                                                        className='object-cover max-h-48'
                                                    />
                                                    <AvatarFallback>H</AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <div className="flex flex-col text-left mt-5 mb-5">
                                                <h1 className="font-roboto font-bold text-xl">Dicky</h1>
                                                <p className="font-roboto text-sm">Dicky is a generous donor who has contributed various items to help those in need.</p>
                                            </div>
                                        </div>
                                        <DrawerFooter>
                                            <Button>Mark as read</Button>
                                            <DrawerClose asChild>
                                            <Button variant="outline">Cancel</Button>
                                            </DrawerClose>
                                        </DrawerFooter>
                                    </div>
                                </DrawerContent>
                            </Drawer>
                        </div>

                        
                    </div>
                    <div className="hidden md:block w-1/3 flex flex-col">
                        <Image
                            src={sideImage1.src} 
                            alt='image'
                            width={300}
                            height={500}
                            className="mb-2 object-cover mx-auto"
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default NotificationPage; 