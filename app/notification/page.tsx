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
import { supabase } from '@/lib/supabaseClient';
import { Skeleton } from '@/components/ui/skeleton';
import { getNotifications } from '@/lib/supabaseAPI';

const NotificationPage = () => {
    const [userData, setUserData] = useState<UserType | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [selectedNotificationIndex, setSelectedNotificationIndex] = useState<number | null>(null);

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
    }, []); // Only run once on mount

    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            const storedUserData = sessionStorage.getItem('user');
            const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null; // Parse the user data
            try {
                const { data, error } = await getNotifications('notifications', parsedUserData?.id, {}, 'notis_timestamp');
                if (error) {
                    throw new Error(error.message);
                }
                if (data) {
                    setNotifications(data);
                    console.log("Fetched Notifications: ", data);
                } else {
                    console.log("No notifications found.");
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
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
                                <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
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

                        <div className="flex flex-col">
                            <Drawer>
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <div key={index} className="flex items-center space-x-4 mb-8">
                                            <Skeleton className="h-12 w-12 rounded-full" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-[250px]" />
                                                <Skeleton className="h-4 w-[200px]" />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div>
                                        {notifications.map((notification, index) => (
                                            <div key={notification.notis_id}>
                                                <DrawerTrigger asChild>
                                                    <button
                                                        className="flex w-full hover:bg-blue-100 rounded-lg transition duration-200 p-4"
                                                        onClick={() => setSelectedNotificationIndex(index)}
                                                    >
                                                        <div className="mr-4">
                                                            <div className="flex">
                                                                <Avatar className="h-16 w-16 items-center">
                                                                    <AvatarImage 
                                                                        src={notification.users.profile_picture || avatarImage.src}
                                                                        alt="avatar" 
                                                                        className='object-cover h-full w-full'
                                                                    />
                                                                    <AvatarFallback>H</AvatarFallback>
                                                                </Avatar>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col text-left">
                                                            <h1 className="font-roboto font-bold text-xl">{notification.users.full_name}</h1>
                                                            <p className='font-roboto text-sm text-gray-500 mb-2'>{new Date(notification.notis_timestamp).toISOString().split('T')[0]}</p>
                                                            <p className="font-roboto text-sm">{notification.notis_title}</p>
                                                        </div>
                                                    </button>
                                                </DrawerTrigger>
                                                <div className='w-full'>
                                                    <Separator className='mt-2 mb-2'/>
                                                </div>

                                                {selectedNotificationIndex === index && (
                                                    <DrawerContent>
                                                        <div className="mx-auto max-w-sm">
                                                            <DrawerHeader>
                                                                <DrawerTitle className="font-roboto font-bold text-3xl">{notification.notis_title}</DrawerTitle>
                                                                <DrawerDescription className="font-roboto text-2x1">{notification.notis_description}</DrawerDescription>
                                                                <p className="font-roboto text-sm text-gray-500">{notification.notis_timestamp}</p>
                                                            </DrawerHeader>
                                                            <div className="flex items-center">
                                                                <div className=" ml-4 mr-2">
                                                                    <Avatar>
                                                                        <AvatarImage 
                                                                            src={notification.users.profile_picture} 
                                                                            alt="avatar" 
                                                                            className='object-cover max-h-48'
                                                                        />
                                                                        <AvatarFallback>H</AvatarFallback>
                                                                    </Avatar>
                                                                </div>
                                                                <div className="flex flex-col text-left mt-5 mb-5 w-2/3">
                                                                    <h1 className="font-roboto font-bold text-xl">{notification.users.full_name}</h1>
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
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Drawer>
                        </div>   
                    </div>
                    {/* <div className="hidden md:block w-1/3 flex flex-col"> */}
                    <div className="hidden md:block w-1/3 flex-col">
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