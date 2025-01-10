"use client";

import { useEffect, useState } from 'react';
import SideBarComponent from "@/components/dashboard/sideBar"; // Adjust the import path
import { User } from '@supabase/supabase-js';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { UserType } from '@/datatypes/types';
import { getUser, signOut } from '@/lib/authFactory';
import { toast } from 'react-toastify';
import { Breadcrumb, BreadcrumbSeparator, BreadcrumbLink, BreadcrumbItem, BreadcrumbList } from '@/components/ui/breadcrumb';
import { getItems } from '@/lib/supabaseAPI';
import { Calendar, Truck, Phone, Mail, UserPen, BadgeInfo, Check, Clock, X } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Head from 'next/head';
import { Button } from '@/components/ui/button';

const Map = dynamic(() => import('@/components/map/map'), { ssr: false });

interface RequestItem {
    id: number;
    resource_name: string;
    request_amount: number;
    resource_amount: number;
    resource_category: string;
}

const beneficiaryRequest = () => {
    const [userData, setUserData] = useState<UserType | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const organizationId = searchParams.get('organizationId');
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
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
        const fetchItems = async () => {
            setLoading(true);
            try {
                const { data, error } = await getItems('request', userData?.id, organizationId, 'accepted');
                if (error) {
                    throw new Error(error.message);
                }
                if (data) {
                    setItems(data);
                    console.log("Fetched items: ", data);
                } else {
                    console.log("No items found.");
                }
            } catch (error) {
                console.error('Error fetching items:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
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
            <Head>
                <link rel="preload" href="/images/background.png" as="image" />
            </Head>

            <SideBarComponent 
                userData={userData || undefined}
                onLogout={handleLogout}
            />

            {/* Main Content */}
            <main className="h-screen w-screen flex flex-col mt-8 md:ml-10 ml-5 md:mr-10 mr-5">
                <div className="flex items-center gap-2">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>Home</BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/beneficiaryDashboard">Dashboard</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink className="font-semibold text-black">{items[0]?.users?.organization_name || 'Organization Name Not Available'}</BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <div className="mt-7 mb-7 flex items-center justify-between">
                    <h1 className="font-giorgio font-bold text-4xl sm:text-5xl md:text-6xl">
                        {items[0]?.users?.organization_name || 'Organization Name Not Available'}
                    </h1>

                    <div className="mt-3">
                        <Button
                            className='bg-[#0077B6] hover:bg-[#026194] px-6'
                            onClick={() => router.back()}
                        >
                            Back
                        </Button>
                    </div>

                </div>

                <div className="flex flex-col">
                    <div className="flex-col md:flex-row flex">
                        <div 
                            className="w-full md:w-1/2 md:p-2 p-1"
                            style={{ height: 327 }}
                        >
                            <Image
                                src={items[0]?.users?.profile_picture || '/images/background.png'}
                                alt="Dashboard"
                                width={600}
                                height={600}
                                draggable={false}
                                onClick={(e) => e.preventDefault()}
                                style={{ width: '100%', height: '100%' }}
                                className="w-full rounded-lg object-cover"
                            />
                        </div>

                        <div 
                            className="w-full md:w-1/2 md:p-2 p-1"
                            style={{ height: 265 }}
                        >
                            <Card className='p-2 md:p-4'>
                                <div className="p-2 flex">
                                    <Calendar className='mr-2'/>
                                    <p className="font-bold text-sm sm:text-sm md:text-lg mr-2"> Request Date:</p>
                                    <p className="text-sm sm:text-sm md:text-lg">
                                        {new Date(items[0]?.request_date).toLocaleString('default', { year: 'numeric', month: 'long', day: 'numeric' }) || 'Request Date'}
                                    </p>
                                </div>
                                <div className="p-2 flex">
                                    <Truck className='mr-2'/>
                                    <p className="font-bold text-sm sm:text-sm md:text-lg mr-2"> Delivery Method:</p>
                                    <p className="text-sm sm:text-sm md:text-lg">
                                        {items[0]?.delivery_method === 'pickUp' ? 'Pick Up' : items[0]?.delivery_method === 'dropOff' ? 'Drop Off' : 'Delivery Method Not Available'}
                                    </p>
                                </div>
                                <div className="p-2 flex">
                                    <Phone className='mr-2'/>
                                    <p className="font-bold text-sm sm:text-sm md:text-lg mr-2"> Telephone number:</p>
                                    <p className="text-sm sm:text-sm md:text-lg">
                                        {items[0]?.users?.telephone_number}
                                    </p>
                                </div>
                                <div className="p-2 flex">
                                    <Mail className='mr-2'/>
                                    <p className="font-bold text-sm sm:text-sm md:text-lg mr-2"> Email:</p>
                                    <p className="text-sm sm:text-sm md:text-lg">
                                        {items[0]?.users?.email}
                                    </p>
                                </div>
                                <div className="p-2 flex">
                                    <UserPen className='mr-2'/>
                                    <p className="font-bold text-sm sm:text-sm md:text-lg mr-2"> Person in charge:</p>
                                    <p className="text-sm sm:text-sm md:text-lg">
                                        {items[0]?.users?.full_name}
                                    </p>
                                </div>
                                <div className="p-2 flex items-center">
                                    <BadgeInfo className='mr-2'/>
                                    <p className="font-bold text-sm sm:text-sm md:text-lg mr-2"> Request status:</p>
                                    <div className={`p-2 rounded-md items-center flex ${items[0]?.status === 'accepted' ? 'bg-green-500' : items[0]?.status === 'pending' ? 'bg-gray-500' : items[0]?.status === 'rejected' ? 'bg-red-500' : ''}`}>
                                        {items[0]?.status === 'accepted' && <Check className='mr-2' />}
                                        {items[0]?.status === 'pending' && <Clock className='mr-2' />}
                                        {items[0]?.status === 'rejected' && <X className='mr-2' />}
                                        <p className="text-sm item-center">
                                            {items[0]?.status === 'accepted' ? 'Accepted' : items[0]?.status === 'pending' ? 'Pending' : items[0]?.status === 'rejected' ? 'Rejected' : ''}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    <div className="flex flex-col mt-5 mb-5">
                        <p className="font-bold text-xl sm:text-xl md:text-2xl mr-2 mb-1">Requested Items: </p>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader style={{ backgroundColor: '#3597ff'}}>
                                    <TableRow>
                                        <TableHead className='text-white'>Resource Name</TableHead>
                                        <TableHead className='text-white'>Requested Amount</TableHead>
                                        <TableHead className='text-white'>Available Amount</TableHead>
                                        <TableHead className='text-white'>Category</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.length > 0 && items[0].request_items?.length ? (
                                        items[0].request_items.map((item: RequestItem, index: number) => (
                                            <TableRow key={item.id || index}>
                                                <TableCell>{item.resource_name}</TableCell>
                                                <TableCell>{item.request_amount}</TableCell>
                                                <TableCell>{item.resource_amount}</TableCell>
                                                <TableCell>{item.resource_category}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center">
                                                No results.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <div className="flex flex-col mt-5 mb-5">
                        <p className="font-bold text-xl sm:text-xl md:text-2xl mr-2 mb-1">Location: </p>
                        <Map 
                            locationText={items[0]?.users?.organization_address || 'Organization Address Not Available'} 
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default beneficiaryRequest; 