"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserType } from '@/datatypes/types';
import { getRecordById } from '@/lib/supabaseAPI';
import SideBarComponent from '@/components/dashboard/sideBar';
import { toast } from 'react-toastify';
import { getUser, signOut } from '@/lib/authFactory';
import { User } from '@supabase/supabase-js';
import { Breadcrumb, BreadcrumbLink, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, AtSign } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const CharityDetailedPage = () => {
    const searchParams = useSearchParams();
    const charityId = searchParams.get('id');
    const [userData, setUserData] = useState<UserType | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [charityData, setCharityData] = useState<UserType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        const fetchCharityData = async () => {
            if (charityId) {
                const {data, error} = await getRecordById('users', charityId);
                if (error) {
                    console.error("Error fetching charity data:", error);
                    return; // Handle error appropriately
                }
                console.log("Charity Data: ", data);
                setCharityData(data);
            }
        };
        fetchCharityData();
    }, [charityId]);

    useEffect(() => {
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
                setUserRole(parsedUserData.role);
                setUserData(parsedUserData);
                console.log("User Session Storage: ", parsedUserData);
                console.log("User Role Session Storage: ", parsedUserData.role);
            } else {
                try {
                    const { data: userFetchData, error: fetchError } = await getRecordById('users', currentUser?.id || '');
                    if (fetchError) {
                        console.error('Error fetching user data:', fetchError.message);
                        return;
                    }
                    setUserRole(userFetchData?.role || null);
                    setUserData(userFetchData || null);
                    sessionStorage.setItem('user', JSON.stringify(userData));
                    console.log('User Data fetched from server:', userFetchData);
                    console.log('User Role fetched from server:', userFetchData?.role);
                } catch (error) {
                    console.error('Unexpected error fetching user data:', error);
                }
            }
            setLoading(false);
        };

        fetchUser();
    },[]);

    const handleLogout = async () => {
        await signOut();
        toast.success('Successfully logged out!', {
            autoClose: 1250, // Toast will disappear after 1500s
        });
        setTimeout(() => {
            router.push('/auth/login'); // Redirect to login page after logout
        }, 1000);
    };

    const splitIntoSentences = (text: string) => {
        return text.split('.').map((sentence) => {
            const trimmedSentence = sentence.trim();
            return trimmedSentence ? trimmedSentence + '.' : ''; // Add a period only if the sentence is not empty
        }).filter(sentence => sentence !== ''); // Filter out any empty sentences
    };

    const sentences = splitIntoSentences(charityData?.organization_description || '');
    const groupSentences = [];

    for (let i=0; i < sentences.length; i++) {
        groupSentences.push(sentences.slice(i, i+5).join(' '));
    }

    if (!charityId) {
        return <div>Charity ID not found in the URL!</div>;
    }

    const handleRedirection = () => {
        if (userRole === 'beneficiary') {
            router.push(`/centers/request?id=${charityId}`);
        } else if (userRole === 'donor') {
            router.push(`/centers/donate?id=${charityId}`);
        } else {
            toast.error('User role not found!');
        }
    }
    // () => router.push(`/centers/donate?id=${charityData.id}`)

    return (
        <div className="h-full flex">
            <SideBarComponent 
                userData={userData || undefined}
                onLogout={handleLogout}
            />

            <main className="w-screen h-full flex flex-col mt-8 mx-8 sm:mx-8 md:ml-16 md:mr-10">
                <div className="flex items-center gap-2">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href={userRole ==="beneficiary" ? '/request' : '/donate'}>{userRole === 'beneficiary' ? 'Request' : userRole === 'donor'? 'Donate' : '...'}</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem className="font-bold text-black">{loading? '...' : charityData?.organization_name}</BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div className="mt-7 mb-7">
                    {charityData ? (
                        <>
                            <div className="w-full flex space-x-20">
                                {/* <Carousel className="bg-red-500 min-w-[450px] max-h-[270px] rounded-3xl mt-4 "> */}
                                <Carousel className="min-w-[450px] max-h-[270px] rounded-3xl mt-4 ">
                                    <CarouselContent className="ml-0 bg-blue-200 min-w-[450px] max-h-[270px] rounded-3xl overflow-hidden">
                                        <Image
                                            src={charityData.profile_picture}
                                            alt={charityData.organization_name}
                                            width={600}
                                            height={400}
                                            priority
                                            draggable={false}
                                            className="object-cover justify-center h-full"
                                        />
                                    </CarouselContent>
                                    <CarouselPrevious className="border-2 border-black bg-[#F5F9FE] hover:bg-white cursor-pointer transform -translate-y-1/2" />
                                    <CarouselNext className="border-2 border-black bg-[#F5F9FE] hover:bg-white hover:cursor-pointer transform -translate-y-1/2" />
                                </Carousel>
                                <section className="w-full flex flex-col justify-center ">
                                    <p className="text-left px-4 mb-1 font-roboto text-sm font-light">Posted 40 mins ago</p>
                                    <div className="w-full px-4 flex justify-between items-center">
                                        <h1 className="font-giorgio font-bold text-5xl">{charityData.organization_name}</h1>
                                        <Button 
                                            className="bg-[#0077B6] hover:bg-[#038BD4] rounded-lg"
                                            onClick={handleRedirection}
                                        >
                                            {userRole === 'beneficiary' ? 'I want to request' : 'I want to donate'}
                                        </Button>
                                    </div>
                                    <div className="flex flex-col justify-center items-start gap-y-3 mt-6 px-4">
                                        {/* <p className="flex gap-x-2 font-roboto"><MapPin className="text-white fill-[#0077B6]"/>{charityData.organization_district}</p> */}
                                        <p className="flex items-center gap-x-2 text-sm font-roboto font-light"><MapPin className="text-white fill-[#0077B6]"/>{charityData.organization_address}</p>
                                        <p className="flex items-center gap-x-2 text-sm font-roboto font-light"><Phone className="text-white fill-[#0077B6]"/>{charityData.telephone_number}</p>
                                        <p className="flex items-center gap-x-2 text-sm font-roboto font-light"><AtSign className="w-5 h-5 text-[#0077B6]"/>{charityData.email}</p>
                                    </div>
                                    {/* Items Needed */}
                                    <div className="mt-4 px-4">
                                        <p className="text-lg font-roboto font-bold">{userRole === 'beneficiary' ? 'Items Provided' : 'Items Needed'}</p>
                                        <div className="flex mt-2 gap-x-1">
                                            <Badge className="py-1 w-[110px] flex justify-center bg-[#8A71E7] hover:bg-[#7a5ce4] font-roboto font-light text-white hover:scale-105 cursor-default">Dress</Badge>
                                            <span className="text-3xl flex items-center">·</span>
                                            <Badge className="py-1 w-[110px] flex justify-center bg-[#DCE02D] hover:bg-[#ced133] font-roboto font-light text-black hover:scale-105 cursor-default">Rice</Badge>
                                            <span className="text-3xl flex items-center">·</span>
                                            <Badge className="py-1 w-[110px] flex justify-center bg-[#c53c2a] hover:bg-[#a73a2b] font-roboto font-light text-white hover:scale-105 cursor-default">Canned Product</Badge>
                                            <span className="text-3xl flex items-center">·</span>
                                            <Badge className="py-1 w-[110px] flex justify-center bg-[#39AF01] hover:bg-[#458527] font-roboto font-light text-white hover:scale-105 cursor-default">Food Oil</Badge>
                                        </div>
                                    </div>
                                </section>
                            </div>
                            
                            <p className="mt-10 text-lg font-roboto font-bold">Description</p>
                            {/* <div className="h-[230px] mr-8 pr-6 overflow-y-auto scrollbar-thin scrollbar-thumb-white scrollbar-track-cyan-600"> */}
                            <div className="h-full mr-8 pr-6 overflow-y-auto scrollbar-thin scrollbar-thumb-white scrollbar-track-cyan-600">
                                {groupSentences.map((group, index) => (
                                    <p key={index} className="mt-2 font-roboto font-light">
                                        {group}
                                    </p>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="[@media(min-width:255px)]:ml-[70px] absolute top-[50%] left-[50%] ">Loading...</div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CharityDetailedPage;
