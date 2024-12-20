"use client"; // Ensure this is a client component

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // For redirection
import { getUser, signOut } from '../../lib/authFactory'; // Adjust the import path
import { toast } from 'react-toastify'; // For notifications
import { UserType } from  "@/datatypes/types";
import SideBarComponent from "@/components/dashboard/sideBar"; // Adjust the import path
import { Breadcrumb, BreadcrumbList, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbItem } from '@/components/ui/breadcrumb';
import { CupSoda, HeartPulse, Pizza, Shirt, User } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardTitle, CardDescription, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

// Define a User type based on your application structure
type User = {
    email?: string;
};  

const chartData = [
    { month: "January", fund: 186, items: 80 },
    { month: "February", fund: 305, items: 200 },
    { month: "March", fund: 237, items: 120 },
    { month: "April", fund: 73, items: 190 },
    { month: "May", fund: 209, items: 130 },
    { month: "June", fund: 214, items: 140 },
  ]
   
const chartConfig = {
    fund: {
      label: "Fund",
      color: "#2563eb",
    },
    items: {
      label: "Items",
      color: "#60a5fa",
    },
} satisfies ChartConfig;

const DashboardPage = () => {
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
            <main className="h-screen w-screen flex flex-col mt-8 md:ml-10 ml-5 md:mr-10 mr-5">
                <div className="flex items-center gap-2">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="#">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>Your Donation</BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                {/* Title */}
                <div className="mt-7 mb-7">
                    <h1 className="font-giorgio font-bold text-4xl sm:text-5xl md:text-6xl">Your Donation</h1>
                </div>

                {/* first colume */}
                <div className="mt-1 mb-2 mr-10 md:mr-0 md:flex">
                    <div className='md:w-2/3 md:mr-4 mb-5 flex flex-col'>
                        <Card className='p-5 flex-1'>
                            <h2 className="font-roboto text-lg sm:text-xl md:text-xl">Recently Donated Items</h2>
                            <p className="font-roboto text-sm sm:text-sm md:text-sm text-gray-500">Donation summary</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 mt-1">
                                <Card className="m-2 bg-red-300 flex-1 transform transition-transform hover:scale-105">
                                    <CardHeader>
                                        <div className="flex items-center justify-center w-16 h-16 bg-red-500 rounded-full">
                                            <Shirt />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex">
                                            <p className='font-giorgio text-5xl font-bold'>20</p>
                                        </div>
                                        <p className='font-roboto text-md mt-1'>Wearable Items</p>
                                    </CardContent>
                                </Card>
                                <Card className="m-2 bg-yellow-300 flex-1 transform transition-transform hover:scale-105">
                                    <CardHeader>
                                        <div className="flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full">
                                            <Pizza />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex">
                                            <p className='font-giorgio text-5xl font-bold'>6</p>
                                        </div>
                                        <p className='font-roboto text-md mt-1'>Food</p>
                                    </CardContent>
                                </Card>
                                <Card className="m-2 bg-green-300 flex-1 transform transition-transform hover:scale-105">
                                    <CardHeader>
                                        <div className="flex items-center justify-center w-16 h-16 bg-green-500 rounded-full">
                                            <CupSoda />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex">
                                            <p className='font-giorgio text-5xl font-bold'>10</p>
                                        </div>
                                        <p className='font-roboto text-md mt-1'>Drinks</p>
                                    </CardContent>
                                </Card>
                                <Card className="m-2 bg-purple-300 flex-1 transform transition-transform hover:scale-105">
                                    <CardHeader>
                                        <div className="flex items-center justify-center w-16 h-16 bg-purple-500 rounded-full">
                                            <HeartPulse />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex">
                                            <p className='font-giorgio text-5xl font-bold'>14</p>
                                        </div>
                                        <p className='font-roboto text-md mt-1'>Health supplies</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </Card>  
                    </div>
                    {/* financial overview */}
                    <div className='md:w-1/3 flex flex-col'>
                        <Card className='p-5'>
                            <h2 className="font-roboto text-lg sm:text-xl md:text-xl">Donation Overview</h2>
                            <div className="mt-12">
                                <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                                    <BarChart accessibilityLayer data={chartData}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="month"
                                            tickLine={false}
                                            tickMargin={10}
                                            axisLine={false}
                                            tickFormatter={(value) => value.slice(0, 3)}
                                        />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <ChartLegend content={<ChartLegendContent />} />
                                        <Bar dataKey="fund" fill="var(--color-fund)" radius={4} />
                                        <Bar dataKey="items" fill="var(--color-items)" radius={4} />
                                    </BarChart>
                                </ChartContainer>  
                            </div>
                        </Card>
                    </div>
                </div>

            </main>
        </div>
    );
}

export default DashboardPage;
