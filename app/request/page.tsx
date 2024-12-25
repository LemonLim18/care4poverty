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
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';  // Add this import at the top of your file
import { RotateCw, Map, MapPin, MapPinned, MapPinCheckInside, BookImage, ChartPie, IdCard, Phone, Mail, PanelsTopLeft } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { getAllRecords, getRecordById, getRecordsByField } from '@/lib/supabaseAPI';
import { Button } from '@/components/ui/button';

import Image5 from '@/public/images/charity_center/charity_center5.jpeg';
import { Input } from '@/components/ui/input';

const RequestPage = () => {
    const [userData, setUserData] = useState<UserType | null>(null);
    const [charityData, setCharityData] = useState<any[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState<any[]>([]);
    const [locationFilter, setLocationFilter] = useState("");
    
    useEffect(() => {
        // window.scrollTo(0, 0);
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
            console.log("Current User: ", currentUser?.id);
            const storedUserData = sessionStorage.getItem('user');
            console.log("Stored User Data: ", storedUserData);
            if (storedUserData && storedUserData !== "null" && storedUserData !== "undefined") {
                const parsedUserData = JSON.parse(storedUserData);
                setUserData(parsedUserData);
                console.log("User Session Storage: ", parsedUserData);
            } else {
                try {
                    
                    const { data: userFetchData, error: fetchError } = await getRecordById('users', currentUser?.id || '');
                    if (fetchError) {
                        console.error('Error fetching user data:', fetchError.message);
                        return;
                    }
                    setUserData(userFetchData || null);
                    sessionStorage.setItem('user', JSON.stringify(userData));
                    console.log('User Data fetched from server:', userFetchData);
                } catch (error) {
                    console.error('Unexpected error fetching user data:', error);
                }
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
        const fetchCharity = async () => {
            // Check if charity data exists in session storage
            const storedCharityData = sessionStorage.getItem('charityData');
            if (storedCharityData) {
                const parsedCharityData = JSON.parse(storedCharityData);
                setCharityData(parsedCharityData);
                console.log('Charity Data loaded from session storage:', parsedCharityData);
            } else {
                // Fetch charity data if session storage is empty
                try {
                    const { data: charityFetchData, error: charityError } = await getRecordsByField('users', 'role', 'charity-admin');
                    if (charityError) {
                        console.error('Error fetching charity data:', charityError.message);
                        return;
                    }
                    setCharityData(charityFetchData || []);
                    sessionStorage.setItem('charityData', JSON.stringify(charityFetchData));
                    console.log('Charity Data fetched from server:', charityFetchData);
                } catch (error) {
                    console.error('Unexpected error fetching charity data:', error);
                }
            }
            setLoading(false);
        };
    
        fetchCharity();
    }, []);

    // Handle the location filter change
    const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log("Location Filter: ", event.target.value);
        // Detect the change in the input field, update and reflect the change in the useState variable to be operated by the other processes
        setLocationFilter(event.target.value);
    };

    const filteredCharityData = charityData.filter((charityCenter) => {
        const districtMatch = charityCenter.organization_district 
            ? charityCenter.organization_district.toLowerCase().includes(locationFilter.toLowerCase()) 
            : false; // If organization_district is not present, default to false

        const nameMatch = charityCenter.organization_name.toLowerCase().includes(locationFilter.toLowerCase());

        return districtMatch || nameMatch; // Return true if either condition matches
    });

    console.log("Filtered Charity Data: ", filteredCharityData);
    
    const handleRefresh = () => {
        // clear the input
        setLocationFilter("");
    }

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
        <div className="h-full flex">
            <SideBarComponent 
                userData={userData || undefined}
                onLogout={handleLogout}
            />

            {/* Main Content */}
            {/* <main className="h-full w-full overflow-x-hidden flex flex-col mt-8 mx-5 md:mx-10"> */}
            <main className="h-full w-full overflow-x-hidden flex flex-col mt-8 mb-8 ml-5 md:ml-16">
                <div className="flex items-center gap-2">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem className="font-bold whitespace-nowrap text-black">Request</BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                {/* Title, Search Bar, Refresh Button */}
                <div className="mt-7 mb-10 w-full block sm:flex sm:space-x-7 md:space-x-12 lg:space-x-20 items-center">
                    <h1 className="font-giorgio font-bold text-4xl sm:text-5xl lg:text-6xl whitespace-nowrap">Charity Centers</h1>
                    <div className="flex w-full sm:justify-between items-center mt-3 sm:mt-0 gap-x-6 md:gap-x-10 lg:gap-x-20">
                        <div className="relative flex w-full max-w-[80%] sm:max-w-[80%]">
                            <MapPin 
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white fill-[#3E4961]"
                                size={20} 
                            />
                            <Input
                                autoComplete="off"
                                placeholder="Location"
                                className="font-roboto w-full rounded-lg border border-gray-300 p-5 pl-12 focus:border-blue-500"
                                value={locationFilter}  // Bind the input to the filter state
                                onChange={handleLocationChange} // Handle the input change
                            />
                        </div>
                        <Button className="mr-0 sm:mr-10 bg-[#0077B6] hover:bg-[#038BD4] text-white"onClick={handleRefresh}>
                            <RotateCw/>
                            <span className="hidden sm:block font-roboto">Refresh</span>
                        </Button>
                    </div>
                </div>

                {/* Subtitle */}
                <div className="mb-2 flex">
                    <MapPinned className="text-3xl sm:text-4xl md:text-5xl mr-2" size={30}/>
                    <h2 className="font-roboto font-bold text-lg sm:text-xl md:text-2xl">Places Near You</h2>
                </div>

                {/* Places Near You */}
                <div className="w-full overflow-x-scroll scrollbar-hide">
                    {/* { loading ? ( */}
                    { loading ? (
                        // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="flex gap-x-16 gap-y-4 mt-2">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div key={index}>
                                    <Skeleton className="mb-2 h-36 w-full rounded-t-lg" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-[250px] mb-2" />
                                        <Skeleton className="h-4 w-[200px] mb-2" />
                                    </div>
                                </div>
                            ))} 
                        </div>
                    ) : (
                        // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                        // Place near you
                        <div className="flex gap-4 mt-2 w-full ">
                            {/* {charityData.map((charityCenter, index) => ( */} {/* Display all the charity centers*/}
                            {filteredCharityData.length === 0 ? ( // Check if there are no charity centers
                                <div className="text-center w-full">
                                    <p className="mt-8 text-lg text-gray-700 font-roboto">No available center</p>
                                </div>
                            ) : (filteredCharityData.map((charityCenter, index) => (
                                <Link 
                                    key={index}
                                    href={{pathname: "/centers", query: {id: charityCenter?.id}}}    // Link to the charity center page
                                    passHref //passHref ensures that the link is passed as well to the child component, such that when click the Card, it will also trigger the redirection
                                >
                                    <Card
                                        className="mr-10 min-w-[300px] cursor-pointer hover:bg-blue-100 transition-colors duration-200 overflow-hidden"
                                    >
                                        <CardContent className="flex flex-col">
                                            <div className="relative">
                                                <Image
                                                    src={charityCenter.profile_picture}
                                                    alt="charity image"
                                                    width={600}
                                                    height={400}
                                                    draggable
                                                    priority
                                                    className="h-48 w-full rounded-t-lg object-cover transition-transform duration-200 hover:scale-110"
                                                />
                                                <div className="absolute bottom-0 left-0 flex flex-col items-center justify-center py-3 w-full bg-[#002154] opacity-85 text-white">
                                                    <p className="my-1 font-roboto font-semibold text-center">
                                                        {charityCenter.organization_name}
                                                    </p>
                                                    <p className="my-1 font-roboto font-semibold text-sm">
                                                        <span className="font-roboto text-[#0084ff]">0.5KM</span>
                                                         &middot; {charityCenter.organization_district}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            )))}
                        </div>
                    )}
                </div>

                {/* Explore other places */}
                <div className="mt-12 mb-2 flex">
                    <Map className="text-3xl sm:text-4xl md:text-5xl mr-2" size={30}/>
                    <h2 className="font-roboto font-bold text-lg sm:text-xl md:text-2xl">Explore other places</h2>
                </div>

                <div className="w-full overflow-x-scroll scrollbar-hide">
                    {/* { loading ? ( */}
                    { loading ? (
                        // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="flex gap-4 mt-2">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div key={index}>
                                    <Skeleton className="mb-2 mr-10 w-[500px] h-[250px] rounded-t-lg" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-[250px] mb-2" />
                                        <Skeleton className="h-4 w-[200px] mb-2" />
                                    </div>
                                </div>
                            ))} 
                        </div>
                    ) : (
                        // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                        // Explore other places
                        <div className="flex gap-4 mt-2 w-full ">
                            {/* <Card
                                // className="mr-10 min-w-[300px] cursor-pointer hover:bg-blue-100 transition-colors duration-200 overflow-hidden"
                                className="mr-10 min-w-[500px] max-h-[250px] cursor-pointer hover:bg-blue-100 transition-colors duration-200 overflow-hidden"
                                onClick={() => {}}
                            >
                                <CardContent className="flex flex-col h-full">
                                    <div className="relative h-full">
                                        <Image
                                            src={Image5.src}
                                            alt="charity image"
                                            width={600}
                                            height={400}
                                            draggable
                                            priority
                                            onClick={(e) => e.preventDefault()}
                                            className="h-full  rounded-t-lg object-cover transition-transform duration-200 hover:scale-110"
                                        />
                                        <div className="h-[43%] absolute bottom-0 left-0 flex items-center py-3 gap-x-6 w-full bg-[#A9D2FC] opacity-95 text-black">
                                            <div className="flex items-center py-3 h-full">
                                                <div className="h-4/5 w-[4px] ml-6 mr-3 rounded-md bg-black"></div>
                                                <p className="my-1 font-roboto text-left font-semibold leading-tight">P.B.A Senior Citizens Home</p>
                                            </div>
                                            <p className="my-1 font-roboto text-left text-sm font-light">Lorem ipsum dolor sit amet consectetur adipisicing elit ...</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card> */}

                            {/* {charityData.map((charityCenter, index) => ( */} {/* Display all the charity centers */}
                            {filteredCharityData.length === 0 ? ( // Check if there are no charity centers
                                <div className="text-center w-full">
                                    <p className="mt-8 text-lg text-gray-700 font-roboto">No available center</p>
                                </div>
                            ) : (filteredCharityData.map((charityCenter, index) => (
                            
                            <Card
                                key={index}
                                className="mr-10 min-w-[500px] max-h-[250px] cursor-pointer hover:bg-blue-100 transition-colors duration-200 overflow-hidden"
                                onClick={() => {}}
                            >
                                <CardContent className="flex flex-col h-full">
                                    <div className="relative h-full">
                                        <Image
                                            src={charityCenter.profile_picture}
                                            alt={`${charityCenter.organization_name} image`}
                                            width={600}
                                            height={400}
                                            draggable
                                            priority
                                            className="h-full rounded-t-lg object-cover transition-transform duration-200 hover:scale-110"
                                        />
                                        <div className="h-[43%] absolute bottom-0 left-0 flex items-center py-3 gap-x-6 w-full bg-[#A9D2FC] opacity-95 text-black">
                                            <div className="flex items-center py-3 h-full min-w-[150px]">
                                                <div className="h-4/5 w-[4px] ml-6 mr-3 rounded-md bg-black"></div>
                                                <p className="my-1 font-roboto text-left font-semibold leading-tight">{charityCenter.organization_name}</p>
                                            </div>
                                            <p className="my-1 mr-3 font-roboto text-left text-sm font-light overflow-hidden text-ellipsis line-clamp-2">{charityCenter.organization_description}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default RequestPage; 