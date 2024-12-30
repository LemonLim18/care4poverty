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
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';  // Add this import at the top of your file
import { Select, SelectItem, SelectLabel, SelectGroup, SelectContent, SelectValue, SelectTrigger } from '@/components/ui/select';
import { MapPin, BookImage, ChartPie, IdCard, Phone, Mail, PanelsTopLeft } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Dialog, DialogTrigger, DialogContent,  DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getEvents } from '@/lib/supabaseAPI';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';

const Map = dynamic(() => import('@/components/map/map'), { ssr: false });

const EventPage = () => {
    const [userData, setUserData] = useState<UserType | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState<string>("donation");
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState<any[]>([]);
    const [myEvents, setMyEvents] = useState<any[]>([]);
    const [eventsCategory, setEventsCategory] = useState<any[]>([]);
    const [eventsNear, setEventsNear] = useState<any[]>([]);
    const [loadingCategory, setLoadingCategory] = useState(true);
    
    useEffect(() => {
        window.scrollTo(0, 0);

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

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const { data, error } = await getEvents('events', null, null, {}, 'event_date');
                if (error) {
                    throw new Error(error.message);
                }
                if (data) {
                    setEvents(data);
                    console.log("Fetched Events: ", data);
                } else {
                    console.log("No events found.");
                }
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    useEffect(() => {
        const fetchMyEvents = async (userId: string | null) => {
            if (userId !== null) {
                setLoading(true);
                try {
                    const { data, error } = await getEvents('events', userId, null, {}, 'event_date');
                    if (error) {
                        throw new Error(error.message);
                    }
                    if (data) {
                        setMyEvents(data);
                        console.log("Fetched My Events: ", data);
                    } else {
                        console.log("No events found.");
                    }
                } catch (error) {
                    console.error('Error fetching events:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchMyEvents(userData?.id ?? null);
    }, [userData]);

    useEffect(() => {
        fetchEventsCategory(selectedCategory);
    }, []);

    const fetchEventsCategory = async (category: string) => {
        setLoadingCategory(true);
        try {
            const { data, error } = await getEvents('events', null, category, {}, 'event_date');
            if (error) {
                throw new Error(error.message);
            }
            if (data) {
                setEventsCategory(data);
                console.log("Fetched Events Category: ", data);
            } else {
                console.log("No events found.");
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoadingCategory(false);
        }
    };

    useEffect(() => {
        const fetchEventsNear = async () => {
            setLoading(true);
            try {
                const { data, error } = await getEvents('events', null, null, {}, 'event_location');
                if (error) {
                    throw new Error(error.message);
                }
                if (data) {
                    setEventsNear(data);
                    console.log("Fetched Events Near: ", data);
                } else {
                    console.log("No events found.");
                }
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEventsNear();
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
                                <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem className="font-bold text-black">Event</BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                {/* Title */}
                <div className="mt-7 mb-7">
                    <h1 className="font-giorgio font-bold text-4xl sm:text-5xl md:text-6xl">Events</h1>
                </div>

                {/* for organization only */}
                <div className="mb-8">
                    {
                        userData?.role === 'charity-admin' && (
                            <div>
                                <div className="mt-1 mb-2 flex">
                                    <h2 className="font-roboto text-lg sm:text-xl md:text-2xl">My Events</h2>
                                    <a href="/create-event" className="bg-blue-500 transition-colors duration-300 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto">
                                        Create New Event
                                    </a>
                                </div>

                                <div>
                                { loading ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {Array.from({ length: 6 }).map((_, index) => (
                                            <div key={index}>
                                                <Skeleton className="mb-2 h-48 w-full rounded-t-lg" />
                                                <div className="space-y-2">
                                                    <Skeleton className="h-4 w-[250px] mb-2" />
                                                    <Skeleton className="h-4 w-[200px] mb-2" />
                                                </div>
                                            </div>
                                        ))} 
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {myEvents.map((event, index) => (
                                            <div key={event.event_id}>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Card
                                                            className="cursor-pointer hover:bg-blue-100 transition-colors duration-200 overflow-hidden"
                                                            onClick={() => {}}
                                                        >
                                                            <CardContent className="flex flex-col p-0">
                                                                <div className="relative">
                                                                    <Image
                                                                        src={event.event_photos[0]}
                                                                        alt="event"
                                                                        width={600}
                                                                        height={500}
                                                                        priority
                                                                        draggable={false}
                                                                        onClick={(e) => e.preventDefault()}
                                                                        className="h-48 w-full rounded-t-lg object-cover transition-transform duration-200 hover:scale-110"
                                                                    />
                                                                    <div className="absolute top-0 left-0 bg-black bg-opacity-50 text-white p-2">
                                                                        <span>{event.event_location}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="m-4 flex justify-between items-center">
                                                                    <div>
                                                                        <p className="font-roboto text-sm text-gray-500 mb-2">{event.event_date}</p>
                                                                        <span className="font-roboto text-xl font-semibold">{event.event_title}</span>
                                                                        <p className="font-roboto text-sm">{event.event_summary}</p>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center mb-5">
                                                                    <div className=" ml-3 mr-2">
                                                                        <Avatar>
                                                                            <AvatarImage 
                                                                                src={event.users.profile_picture} 
                                                                                alt="avatar" 
                                                                                className='object-cover w-12 h-12'
                                                                            />
                                                                            <AvatarFallback>H</AvatarFallback>
                                                                        </Avatar>
                                                                    </div>
                                                                    <div className="flex flex-col text-left">
                                                                        <h1 className="font-roboto text-sm">{event.users.full_name}</h1>
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-h-[90vh] overflow-y-auto scrollbar-hidden">
                                                        <DialogHeader>
                                                            <DialogTitle className='text-2xl'>{event.event_title}</DialogTitle>
                                                        </DialogHeader>
                                                        <DialogDescription className='text-sm'>{event.event_description}</DialogDescription>
                                                        <div className="">
                                                            <h1 className="font-roboto font-bold">Date:</h1>
                                                            <h1 className="font-roboto">{event.event_date}</h1>

                                                            <h1 className="font-roboto font-bold mt-4">Location:</h1>
                                                            <h1 className="font-roboto">{event.event_location}</h1>

                                                            <Map locationText={event.event_location} />

                                                            <Link href={event.event_url} passHref target="_blank">
                                                                <Button className='bg-blue-600 mt-5'>Click here for more details</Button>
                                                            </Link>

                                                            <div className="relative mt-4">
                                                                <Carousel className="mt-4">
                                                                    <CarouselContent>
                                                                        {event.event_photos.map((photo: string, index: number) => (
                                                                            <Image
                                                                                key={index}
                                                                                src={photo}
                                                                                alt={`event photo ${index + 1}`}
                                                                                width={600}
                                                                                height={300}
                                                                                priority
                                                                                draggable={false}
                                                                                onClick={(e) => e.preventDefault()}
                                                                                className="object-cover justify-center"
                                                                            />
                                                                        ))}
                                                                    </CarouselContent>
                                                                    <CarouselNext className="absolute top-1/2 right-1 transform -translate-y-1/2" />
                                                                    <CarouselPrevious className="absolute top-1/2 left-1 transform -translate-y-1/2" />
                                                                </Carousel>
                                                            </div>
                                                        </div>

                                                        <Separator className="mt-4"/>
                                                        
                                                        <h1 className="font-roboto font-bold text-xl mt-4">Organization:</h1>
                                                        <h1 className="font-roboto">{event.users.organization_name}</h1>
                                                        <div className="flex items-center mb-5">
                                                            <div className=" ml-3 mr-5">
                                                                <Avatar className='h-24 w-24'>
                                                                    <AvatarImage 
                                                                        src={event.users.profile_picture} 
                                                                        alt="avatar" 
                                                                        className='object-cover'
                                                                    />
                                                                    <AvatarFallback>H</AvatarFallback>
                                                                </Avatar>
                                                            </div>
                                                            <div className="flex flex-col text-left">
                                                                <div className="flex mb-1">
                                                                    <IdCard className='ml-3 mr-3' />
                                                                    <h1 className="font-roboto text-sm">{event.users.full_name}</h1>
                                                                </div>
                                                                <div className="flex mb-1">
                                                                    <Phone className='ml-3 mr-3'/>
                                                                    <h1 className="font-roboto text-sm">{event.users.telephone_number}</h1>
                                                                </div>
                                                                <div className="flex mb-1">
                                                                    <Mail className='ml-3 mr-3'/>
                                                                    <h1 className="font-roboto text-sm">{event.users.email}</h1>
                                                                </div>
                                                                <div className="flex mb-1">
                                                                    <PanelsTopLeft className='ml-3 mr-3'/>
                                                                    <Link href={event.users.website} passHref target="_blank" className='cursor-pointer hover:underline'>
                                                                        <h1 className="font-roboto text-sm">{event.users.website}</h1>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                </div>
                            </div>
                        )
                    }
                </div>
                    

                {/* Subtitle */}
                <div className="mt-1 mb-2 flex">
                    <h2 className="font-roboto text-lg sm:text-xl md:text-2xl">Recent Events</h2>
                </div>

                {/* Recent events */}
                <div>
                    { loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div key={index}>
                                    <Skeleton className="mb-2 h-48 w-full rounded-t-lg" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-[250px] mb-2" />
                                        <Skeleton className="h-4 w-[200px] mb-2" />
                                    </div>
                                </div>
                            ))} 
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {events.map((event, index) => (
                                <div key={event.event_id}>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Card
                                                className="cursor-pointer hover:bg-blue-100 transition-colors duration-200 overflow-hidden"
                                                onClick={() => {}}
                                            >
                                                <CardContent className="flex flex-col p-0">
                                                    <div className="relative">
                                                        <Image
                                                            src={event.event_photos[0]}
                                                            alt="event"
                                                            width={600}
                                                            height={500}
                                                            priority
                                                            draggable={false}
                                                            onClick={(e) => e.preventDefault()}
                                                            className="h-48 w-full rounded-t-lg object-cover transition-transform duration-200 hover:scale-110"
                                                        />
                                                        <div className="absolute top-0 left-0 bg-black bg-opacity-50 text-white p-2">
                                                            <span>{event.event_location}</span>
                                                        </div>
                                                    </div>
                                                    <div className="m-4 flex justify-between items-center">
                                                        <div>
                                                            <p className="font-roboto text-sm text-gray-500 mb-2">{event.event_date}</p>
                                                            <span className="font-roboto text-xl font-semibold">{event.event_title}</span>
                                                            <p className="font-roboto text-sm">{event.event_summary}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center mb-5">
                                                        <div className=" ml-3 mr-2">
                                                            <Avatar>
                                                                <AvatarImage 
                                                                    src={event.users.profile_picture} 
                                                                    alt="avatar" 
                                                                    className='object-cover w-12 h-12'
                                                                />
                                                                <AvatarFallback>H</AvatarFallback>
                                                            </Avatar>
                                                        </div>
                                                        <div className="flex flex-col text-left">
                                                            <h1 className="font-roboto text-sm">{event.users.full_name}</h1>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </DialogTrigger>
                                        <DialogContent className="max-h-[90vh] overflow-y-auto scrollbar-hidden">
                                            <DialogHeader>
                                                <DialogTitle className='text-2xl'>{event.event_title}</DialogTitle>
                                            </DialogHeader>
                                            <DialogDescription className='text-sm'>{event.event_description}</DialogDescription>
                                            <div className="">
                                                <h1 className="font-roboto font-bold">Date:</h1>
                                                <h1 className="font-roboto">{event.event_date}</h1>

                                                <h1 className="font-roboto font-bold mt-4">Location:</h1>
                                                <h1 className="font-roboto">{event.event_location}</h1>
                                                
                                                <Map locationText={event.event_location} />

                                                <Link href={event.event_url} passHref target="_blank">
                                                    <Button className='bg-blue-600 mt-5'>Click here for more details</Button>
                                                </Link>

                                                <div className="relative mt-4">
                                                    <Carousel className="mt-4">
                                                        <CarouselContent>
                                                            {event.event_photos.map((photo: string, index: number) => (
                                                                <Image
                                                                    key={index}
                                                                    src={photo}
                                                                    alt={`event photo ${index + 1}`}
                                                                    width={600}
                                                                    height={300}
                                                                    priority
                                                                    draggable={false}
                                                                    onClick={(e) => e.preventDefault()}
                                                                    className="object-cover justify-center"
                                                                />
                                                            ))}
                                                        </CarouselContent>
                                                        <CarouselNext className="absolute top-1/2 right-1 transform -translate-y-1/2" />
                                                        <CarouselPrevious className="absolute top-1/2 left-1 transform -translate-y-1/2" />
                                                    </Carousel>
                                                </div>
                                            </div>

                                            <Separator className="mt-4"/>
                                            
                                            <h1 className="font-roboto font-bold text-xl mt-4">Organization:</h1>
                                            <h1 className="font-roboto">{event.users.organization_name}</h1>
                                            <div className="flex items-center mb-5">
                                                <div className=" ml-3 mr-5">
                                                    <Avatar className='h-24 w-24'>
                                                        <AvatarImage 
                                                            src={event.users.profile_picture} 
                                                            alt="avatar" 
                                                            className='object-cover'
                                                        />
                                                        <AvatarFallback>H</AvatarFallback>
                                                    </Avatar>
                                                </div>
                                                
                                                <div className="flex flex-col text-left">
                                                    <div className="flex mb-1">
                                                        <IdCard className='ml-3 mr-3' />
                                                        <h1 className="font-roboto text-sm">{event.users.full_name}</h1>
                                                    </div>
                                                    <div className="flex mb-1">
                                                        <Phone className='ml-3 mr-3'/>
                                                        <h1 className="font-roboto text-sm">{event.users.telephone_number}</h1>
                                                    </div>
                                                    <div className="flex mb-1">
                                                        <Mail className='ml-3 mr-3'/>
                                                        <h1 className="font-roboto text-sm">{event.users.email}</h1>
                                                    </div>
                                                    <div className="flex mb-1">
                                                        <PanelsTopLeft className='ml-3 mr-3'/>
                                                        <Link href={event.users.website} passHref target="_blank" className='cursor-pointer hover:underline'>
                                                            <h1 className="font-roboto text-sm">{event.users.website}</h1>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <Separator className="mt-8"/>                

                <div className="mt-7 md:justify-center flex">
                    <ChartPie className="text-3xl sm:text-4xl md:text-5xl mr-3 mt-2" size={36}/>
                    <h2 className="font-giorgio font-bold text-3xl sm:text-4xl md:text-5xl">Event Category</h2>
                </div>
                
                <div className="mt-8 mb-8 block md:hidden">
                    <div className="mb-6">
                        <Select onValueChange={(value) => {
                            setSelectedCategory(value)
                            fetchEventsCategory(value);
                        }}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select here" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Events</SelectLabel>
                                    <SelectItem value="donation">Donation</SelectItem>
                                    <SelectItem value="funrun">Fun Run</SelectItem>
                                    <SelectItem value="galaevent">Gala Event</SelectItem>
                                    <SelectItem value="concert">Concert</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='overflow-y-auto'>
                        { loading ? (
                             <div className="flex h-screen items-bottom justify-center">
                                <Skeleton className="mb-2 h-64" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {eventsCategory.map((eventsCategory, index) => (
                                    <div key={eventsCategory.event_id}>
                                        <Card
                                            className="cursor-pointer hover:bg-blue-100 transition-colors duration-200 overflow-hidden"
                                            onClick={() => {}}
                                        >
                                            <CardContent className="flex flex-col p-0">
                                            <div className="relative">
                                                <Image
                                                    src={eventsCategory.event_photos[0]}
                                                    alt="event"
                                                    width={600}
                                                    height={500}
                                                    priority
                                                    draggable={false}
                                                    onClick={(e) => e.preventDefault()}
                                                    className="h-48 w-full rounded-t-lg object-cover transition-transform duration-200 hover:scale-110"
                                                />
                                                <div className="absolute top-0 left-0 bg-black bg-opacity-50 text-white p-2">
                                                    <span>{eventsCategory.event_location}</span>
                                                </div>
                                            </div>
                                                <div className="m-4 flex justify-between items-center">
                                                    <div>
                                                        <p className="font-roboto text-sm text-gray-500 mb-2">{eventsCategory.event_date}</p>
                                                        <span className="font-roboto text-xl font-semibold">{eventsCategory.event_title}</span>
                                                        <p className="font-roboto text-sm">{eventsCategory.event_summary}</p>
                                                    </div>
                                                </div>

                                                        <div className="flex items-center mb-5">
                                                            <div className=" ml-3 mr-2">
                                                                <Avatar>
                                                                    <AvatarImage 
                                                                        src={eventsCategory.users.profile_picture} 
                                                                        alt="avatar" 
                                                                        className='object-cover w-12 h-12'
                                                                    />
                                                                    <AvatarFallback>H</AvatarFallback>
                                                                </Avatar>
                                                            </div>
                                                            <div className="flex flex-col text-left">
                                                                <h1 className="font-roboto text-sm">{eventsCategory.users.full_name}</h1>
                                                            </div>
                                                        </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 mb-8 hidden md:block ">
                    <Tabs defaultValue="donation" onValueChange={(value) => {
                        setSelectedCategory(value);
                        fetchEventsCategory(value);
                    }}>
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="donation">Donation</TabsTrigger>
                            <TabsTrigger value="funrun">Fun Run</TabsTrigger>
                            <TabsTrigger value="galaevent">Gala Event</TabsTrigger>
                            <TabsTrigger value="concert">Concert</TabsTrigger>
                        </TabsList>
                        <TabsContent value={selectedCategory}>
                            <div>
                                { loadingCategory ? (
                                    <div className="flex justify-center items-center h-full">
                                        <Skeleton className="mb-2 h-72 w-full rounded-t-lg" />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {eventsCategory.map((event, index) => (
                                            <div key={event.event_id}>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Card
                                                            className="cursor-pointer hover:bg-blue-100 transition-colors duration-200 overflow-hidden"
                                                            onClick={() => {}}
                                                        >
                                                            <CardContent className="flex flex-col p-0">
                                                            <div className="relative">
                                                                <Image
                                                                    src={event.event_photos[0]}
                                                                    alt="event"
                                                                    width={600}
                                                                    height={500}
                                                                    priority
                                                                    draggable={false}
                                                                    onClick={(e) => e.preventDefault()}
                                                                    className="h-48 w-full rounded-t-lg object-cover transition-transform duration-200 hover:scale-110"
                                                                />
                                                                <div className="absolute top-0 left-0 bg-black bg-opacity-50 text-white p-2">
                                                                    <span>{event.event_location}</span>
                                                                </div>
                                                            </div>
                                                                <div className="m-4 flex justify-between items-center">
                                                                    <div>
                                                                        <p className="font-roboto text-sm text-gray-500 mb-2">{event.event_date}</p>
                                                                        <span className="font-roboto text-xl font-semibold">{event.event_title}</span>
                                                                        <p className="font-roboto text-sm">{event.event_summary}</p>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center mb-5">
                                                                    <div className=" ml-3 mr-2">
                                                                        <Avatar>
                                                                            <AvatarImage 
                                                                                src={event.users.profile_picture} 
                                                                                alt="avatar" 
                                                                                className='object-cover w-12 h-12'
                                                                            />
                                                                            <AvatarFallback>H</AvatarFallback>
                                                                        </Avatar>
                                                                    </div>
                                                                    <div className="flex flex-col text-left">
                                                                        <h1 className="font-roboto text-sm">{event.users.full_name}</h1>
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-h-[90vh] overflow-y-auto scrollbar-hidden">
                                                        <DialogHeader>
                                                            <DialogTitle className='text-2xl'>{event.event_title}</DialogTitle>
                                                        </DialogHeader>
                                                        <DialogDescription className='text-sm'>{event.event_description}</DialogDescription>
                                                        <div className="">
                                                            <h1 className="font-roboto font-bold">Date:</h1>
                                                            <h1 className="font-roboto">{event.event_date}</h1>

                                                            <h1 className="font-roboto font-bold mt-4">Location:</h1>
                                                            <h1 className="font-roboto">{event.event_location}</h1>

                                                            <Map locationText={event.event_location} />

                                                            <Link href={event.event_url} passHref target="_blank">
                                                                <Button className='bg-blue-600 mt-5'>Click here for more details</Button>
                                                            </Link>

                                                            <div className="relative mt-4 p-0">
                                                                <Carousel className="mt-4">
                                                                    <CarouselContent>
                                                                        {event.event_photos.map((photo: string, index: number) => (
                                                                            <Image
                                                                                key={index}
                                                                                src={photo}
                                                                                alt={`event photo ${index + 1}`}
                                                                                width={600}
                                                                                height={300}
                                                                                priority
                                                                                draggable={false}
                                                                                onClick={(e) => e.preventDefault()}
                                                                                className="object-cover justify-center"
                                                                            />
                                                                        ))}
                                                                    </CarouselContent>
                                                                    <CarouselNext className="absolute top-1/2 right-1 transform -translate-y-1/2" />
                                                                    <CarouselPrevious className="absolute top-1/2 left-1 transform -translate-y-1/2" />
                                                                </Carousel>
                                                            </div>
                                                        </div>

                                                        <Separator className="mt-4"/>
                                                        
                                                        <h1 className="font-roboto font-bold text-xl mt-4">Organization:</h1>
                                                        <h1 className="font-roboto">{event.users.organization_name}</h1>
                                                        <div className="flex items-center mb-5">
                                                            <div className=" ml-3 mr-5">
                                                                <Avatar className='h-24 w-24'>
                                                                    <AvatarImage 
                                                                        src={event.users.profile_picture} 
                                                                        alt="avatar" 
                                                                        className='object-cover'
                                                                    />
                                                                    <AvatarFallback>H</AvatarFallback>
                                                                </Avatar>
                                                            </div>
                                                            
                                                            <div className="flex flex-col text-left">
                                                                <div className="flex mb-1">
                                                                    <IdCard className='ml-3 mr-3' />
                                                                    <h1 className="font-roboto text-sm">{event.users.full_name}</h1>
                                                                </div>
                                                                <div className="flex mb-1">
                                                                    <Phone className='ml-3 mr-3'/>
                                                                    <h1 className="font-roboto text-sm">{event.users.telephone_number}</h1>
                                                                </div>
                                                                <div className="flex mb-1">
                                                                    <Mail className='ml-3 mr-3'/>
                                                                    <h1 className="font-roboto text-sm">{event.users.email}</h1>
                                                                </div>
                                                                <div className="flex mb-1">
                                                                    <PanelsTopLeft className='ml-3 mr-3'/>
                                                                    <Link href={event.users.website} passHref target="_blank" className='cursor-pointer hover:underline'>
                                                                        <h1 className="font-roboto text-sm">{event.users.website}</h1>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                <Separator />
                
                {/* Subtitle*/}
                <div className="mt-7 flex items-center">
                    <h2 className="font-giorgio font-bold text-3xl mb-6 sm:text-4xl md:text-5xl">Events near you</h2>
                </div>

                {/* Events near you */}
                <div>
                    { loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div key={index}>
                                    <Skeleton className="mb-2 h-48 w-full rounded-t-lg" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-[250px] mb-2" />
                                        <Skeleton className="h-4 w-[200px] mb-2" />
                                    </div>
                                </div>
                            ))} 
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {eventsNear.map((event, index) => (
                                <div key={event.event_id}>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Card
                                                className="cursor-pointer hover:bg-blue-100 transition-colors duration-200 overflow-hidden"
                                                onClick={() => {}}
                                            >
                                                <CardContent className="flex flex-col p-0">
                                                    <div className="relative">
                                                        <Image
                                                            src={event.event_photos[0]}
                                                            alt="event"
                                                            width={600}
                                                            height={500}
                                                            priority
                                                            draggable={false}
                                                            onClick={(e) => e.preventDefault()}
                                                            className="h-48 w-full rounded-t-lg object-cover transition-transform duration-200 hover:scale-110"
                                                        />
                                                        <div className="absolute top-0 left-0 bg-black bg-opacity-50 text-white p-2">
                                                            <span>{event.event_location}</span>
                                                        </div>
                                                    </div>
                                                    <div className="m-4 flex justify-between items-center">
                                                        <div>
                                                            <p className="font-roboto text-sm text-gray-500 mb-2">{event.event_date}</p>
                                                            <span className="font-roboto text-xl font-semibold">{event.event_title}</span>
                                                            <p className="font-roboto text-sm">{event.event_summary}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center mb-5">
                                                         <div className=" ml-3 mr-2">
                                                             <Avatar>
                                                                 <AvatarImage 
                                                                     src={event.users.profile_picture} 
                                                                     alt="avatar" 
                                                                     className='object-cover w-12 h-12'
                                                                 />
                                                                 <AvatarFallback>H</AvatarFallback>
                                                             </Avatar>
                                                         </div>
                                                         <div className="flex flex-col text-left">
                                                             <h1 className="font-roboto text-sm">{event.users.full_name}</h1>
                                                         </div>
                                                     </div>
                                                </CardContent>
                                            </Card>
                                        </DialogTrigger>
                                        <DialogContent className="max-h-[90vh] overflow-y-auto scrollbar-hidden">
                                            <DialogHeader>
                                                <DialogTitle className='text-2xl'>{event.event_title}</DialogTitle>
                                            </DialogHeader>
                                            <DialogDescription className='text-sm'>{event.event_description}</DialogDescription>
                                            <div className="">
                                                <h1 className="font-roboto font-bold">Date:</h1>
                                                <h1 className="font-roboto">{event.event_date}</h1>

                                                <h1 className="font-roboto font-bold mt-4">Location:</h1>
                                                <h1 className="font-roboto">{event.event_location}</h1>

                                                <Map locationText={event.event_location} />

                                                <Link href={event.event_url} passHref target="_blank">
                                                    <Button className='bg-blue-600 mt-5'>Click here for more details</Button>
                                                </Link>

                                                <div className="relative mt-4">
                                                    <Carousel className="mt-4">
                                                        <CarouselContent>
                                                            {event.event_photos.map((photo: string, index: number) => (
                                                                <Image
                                                                    key={index}
                                                                    src={photo}
                                                                    alt={`event photo ${index + 1}`}
                                                                    width={600}
                                                                    height={300}
                                                                    priority
                                                                    draggable={false}
                                                                    onClick={(e) => e.preventDefault()}
                                                                    className="object-cover justify-center"
                                                                />
                                                            ))}
                                                        </CarouselContent>
                                                        <CarouselNext className="absolute top-1/2 right-1 transform -translate-y-1/2" />
                                                        <CarouselPrevious className="absolute top-1/2 left-1 transform -translate-y-1/2" />
                                                    </Carousel>
                                                </div>
                                            </div>

                                            <Separator className="mt-4"/>
                                            
                                            <h1 className="font-roboto font-bold text-xl mt-4">Organization:</h1>
                                            <h1 className="font-roboto">{event.users.organization_name}</h1>
                                            <div className="flex items-center mb-5">
                                                <div className=" ml-3 mr-5">
                                                    <Avatar className='h-24 w-24'>
                                                        <AvatarImage 
                                                            src={event.users.profile_picture} 
                                                            alt="avatar" 
                                                            className='object-cover'
                                                        />
                                                        <AvatarFallback>H</AvatarFallback>
                                                    </Avatar>
                                                </div>
                                                
                                                
                                                
                                                <div className="flex flex-col text-left">
                                                    <div className="flex mb-1">
                                                        <IdCard className='ml-3 mr-3' />
                                                        <h1 className="font-roboto text-sm">{event.users.full_name}</h1>
                                                    </div>
                                                    <div className="flex mb-1">
                                                        <Phone className='ml-3 mr-3'/>
                                                        <h1 className="font-roboto text-sm">{event.users.telephone_number}</h1>
                                                    </div>
                                                    <div className="flex mb-1">
                                                        <Mail className='ml-3 mr-3'/>
                                                        <h1 className="font-roboto text-sm">{event.users.email}</h1>
                                                    </div>
                                                    <div className="flex mb-1">
                                                        <PanelsTopLeft className='ml-3 mr-3'/>
                                                        <Link href={event.users.website} passHref target="_blank" className='cursor-pointer hover:underline'>
                                                            <h1 className="font-roboto text-sm">{event.users.website}</h1>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                <Separator className="mt-8"/>
            </main>
        </div>
    );
};

export default EventPage; 