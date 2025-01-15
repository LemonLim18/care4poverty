"use client"; // Ensure this is a client component

import { useEffect, useState, useMemo } from 'react';
import SideBarComponent from "@/components/dashboard/sideBar"; // Adjust the import path
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation'; // For redirection
import { UserType } from  "@/datatypes/types";
import { getUser, signOut } from '../../lib/authFactory'; // Adjust the import path
import { toast } from 'react-toastify'; // For notifications
import { getRecordById } from '@/lib/supabaseAPI';
import { Area, AreaChart, CartesianGrid, XAxis, Label, Pie, PieChart, Sector, Bar, BarChart, PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartStyle, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { PieSectorDataItem } from 'recharts/types/polar/Pie';
import { TrendingUp, IdCard, Phone, Mail, PanelsTopLeft, MessageCircle } from "lucide-react";
import image from "../../public/images/donation.jpeg"
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { typeData, barData, chartData, chartConfigType, chartConfigBar, chartConfig } from "./data/data";
import { getDonor, getEvents, getNotifications } from '@/lib/supabaseAPI';

interface DonationType {
  donor_id: string;
  users: {
    full_name: string;
    profile_picture: string;
  };
}

const Map = dynamic(() => import('@/components/map/map'), { ssr: false });

const DashboardPage = () => {
    const [userData, setUserData] = useState<UserType | null>();
    const [userId, setUserId] = useState<string | null>();
    const [loading, setLoading] = useState(true);
    const [donation, setDonation] = useState<any[]>([]);
    const [donationCount, setDonationCount] = useState(0);
    const [newNotifications, setNewNotifications] = useState(0);
    const [uniqueDonor, setUniqueDonor] = useState<Record<string, number>>({});
    const [events, setEvents] = useState<any[]>([]);
    const [loadingEvents, setLoadingEvents] = useState(true);

    const router = useRouter();
    const [timeRange, setTimeRange] = useState("30d")
    const id = "pie-interactive"
    const [activeMonth, setActiveMonth] = useState(typeData[0].month)
    
    const activeIndex = useMemo(
        () => typeData.findIndex((item) => item.month === activeMonth),
        [activeMonth]
    )
    const months = useMemo(() => typeData.map((item) => item.month), [])
    
    useEffect(() => {        
        const fetchUser = async () => {
            const currentUser: User | null = await getUser();
            console.log("Current User: ", currentUser); // Log to see if user is fetched
            if (!currentUser) {
                toast.error('User not found! Redirecting to login...', {
                    autoClose: 1350,
                });
                router.push('/auth/login');
            } else {
                setUserId(currentUser.id);
                // Fetch user data after getting the current user
                fetchUserData(currentUser.id);
            }
        };

        fetchUser();
        
        const fetchUserData = async (userId: string) => {
            const { data: user, error: fetchError } = await getRecordById('users', userId);
            console.log("Fetched User Data: ", user);
            if (fetchError) {
                console.error('Error fetching user data:', fetchError.message);
                return;
            }
            if (user) {
                sessionStorage.setItem('user', JSON.stringify(user)); // Store user data
                setUserData(user); // Set user data in state
                console.log('User data stored in session storage:', user);
            } else {
                console.error("User data is undefined.");
            }
        }; 

        if (typeof window !== 'undefined') {
            const storedUserData = sessionStorage.getItem('user');
            if (storedUserData) {
                const parsedUserData = JSON.parse(storedUserData);
                setUserData(parsedUserData);
                // console.log("Session Storage: ", parsedUserData);
            } else {   
                console.log('No user data found in session storage');
            }
        }

        let count = 0;
        const targetCount = donationCount;
        const interval = setInterval(() => {
            count += 1;
            setDonationCount(count);
            if (count >= targetCount) {
                clearInterval(interval);
            }
        }, 1);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!userData) {
            return;
        }
        const fetchNotifications = async () => {
            const { data, error } = await getNotifications('notifications', userData?.id, {}, undefined, "unread");
            if (error) {
                console.error('Error fetching notifications:', error.message);
                return;
            }
            if (data) {
                console.log("Notifications: ", data);
                setNewNotifications(data.length);
                console.log("Number of notifications: ", data.length);
            } else {
                console.log("No notifications found.");
            }
        };
        fetchNotifications();
    }, [userData]);

    useEffect(() => {
        if (!userData){
            return;
        }
        console.log("Updated New Notifications Count:", newNotifications);
        if (newNotifications > 0) {
            toast(
            <div className="flex flex-col">
                <strong className="text-lg">Welcome back!</strong>
                <div className="flex items-center mt-2">
                    <MessageCircle className="mr-2" />
                    {`You have ${newNotifications} new notifications`}
                </div>
            </div>, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }, [newNotifications]);

    const filteredData = chartData.filter((item) => {
        const date = new Date(item.date)
        const referenceDate = new Date("2024-06-30")
        let daysToSubtract = 90
        if (timeRange === "30d") {
          daysToSubtract = 30
        } else if (timeRange === "7d") {
          daysToSubtract = 7
        }
        const startDate = new Date(referenceDate)
        startDate.setDate(startDate.getDate() - daysToSubtract)
        return date >= startDate
    })
    
    const handleLogout = async () => {
        await signOut();
        sessionStorage.clear(); // Clear session storage
        toast.success('Successfully logged out!', {
            autoClose: 1250, // Toast will disappear after 1500s
        });
        setTimeout(() => {
            router.push('/auth/login'); // Redirect to login page after logout
        }, 1000);
    };

    useEffect(() => {
        if (!userData) {
            return;
        }
        fetch();
    }, [userData]);

    const fetch = async () => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const currentUser: User | null = await getUser();
                const { data: donationData, error: donationError } = await getDonor('donation', currentUser?.id);
                if (donationError) throw new Error(donationError.message);
                if (donationData) {
                    setDonation(donationData);
                    setDonationCount(donationData.length);
                    countDonation(donationData);
                    console.log("Fetched donation: ", donationData);
                    console.log("Number of donations: ", donationData.length);
                } else {
                    console.log("No donation found.");
                }
            } catch (error) {
                console.error('Error fetching donation:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    };

    useEffect(() => {
        if (!userData) {
            return;
        }
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
    }, [userData]);

    const countDonation = (donations: any[]) => {
        const donorCounts: Record<string, number> = {};
        donations.forEach((donation) => {
            const donorId = donation.donor_id;
            donorCounts[donorId] = (donorCounts[donorId] || 0) + 1;
        });

        const sortedDonorCounts = Object.entries(donorCounts)
            .sort(([, countA], [, countB]) => countB - countA)
            .reduce<Record<string, number>>((acc, [donorId, count]) => {
                acc[donorId] = count;
                return acc;
            }, {});

        setUniqueDonor(sortedDonorCounts);
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
                            <BreadcrumbItem className="font-bold text-black">Dashboard</BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                {/* Title */}
                <div className="mt-7 mb-7">
                    <h1 className="font-giorgio font-bold text-4xl sm:text-5xl md:text-6xl">Dashboard</h1>
                </div>

                {/* Total donation  */}
                <div className="mt-2 mb-2">
                    <h1 className="font-roboto font-bold text-xl sm:text-2xl md:text-2xl">Total Donation Received</h1>
                    <h1 className="font-roboto font-bold text-xl sm:text-3xl md:text-3xl bg-gradient-to-r from-red-400 via-green-400 to-blue-500 bg-clip-text text-transparent">
                        {donationCount} donations in total
                    </h1>
                </div>

                <div className="mt-4 mb-4 flex flex-col">
                    <h2 className="font-giorgio font-bold text-3xl sm:text-3xl md:text-4xl mb-3">Top Contributors</h2>
                    <div className=" gap-4">
                        <div className='flex grid grid-cols-1 md:grid-cols-3'>
                            {Object.entries(uniqueDonor).map(([donorId, count], index) => {
                                const donationMap: Record<string, DonationType> = Object.fromEntries(donation.map(d => [d.donor_id, d]));
                                return (
                                    <div key={donorId} className='flex p-3 items-center'>
                                        <Avatar className='h-20 w-20'>
                                            <AvatarImage 
                                                src={donationMap[donorId].users.profile_picture} 
                                                alt="avatar"
                                                className='object-cover'
                                            />
                                            <AvatarFallback>H</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col ml-3">
                                            <h1 className="font-roboto font-bold text-xl sm:text-xl md:text-xl">{donationMap[donorId].users.full_name}</h1>
                                            <h1 className="font-roboto text-sm sm:text-sm md:text-sm">{count} donations</h1>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Donation and Fund Comparison */}    
                <div className="mt-2 mb-2">
                    <Card>
                        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                            <div className="grid flex-1 gap-1 text-center sm:text-left">
                                <div className="font-roboto font-bold text-xl sm:text-xl md:text-xl">Donation and Fund Comparison</div>
                                <div className="font-roboto text-sm sm:text-sm md:text-sm">
                                    Showing total donation and fund for the last 3 months
                                </div>
                            </div>
                            <Select value={timeRange} onValueChange={setTimeRange}>
                            <SelectTrigger
                                className="w-[160px] rounded-lg sm:ml-auto"
                                aria-label="Select a value"
                            >
                                <SelectValue placeholder="Last 3 months" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="90d" className="rounded-lg">
                                Last 3 months
                                </SelectItem>
                                <SelectItem value="30d" className="rounded-lg">
                                Last 30 days
                                </SelectItem>
                                <SelectItem value="7d" className="rounded-lg">
                                Last 7 days
                                </SelectItem>
                            </SelectContent>
                            </Select>
                        </CardHeader>
                        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                            <ChartContainer
                            config={chartConfig}
                            className="aspect-auto h-[250px] w-full"
                            >
                            <AreaChart data={filteredData}>
                                <defs>
                                <linearGradient id="fillDonation" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                    offset="5%"
                                    stopColor="var(--color-donation)"
                                    stopOpacity={0.8}
                                    />
                                    <stop
                                    offset="95%"
                                    stopColor="var(--color-donation)"
                                    stopOpacity={0.1}
                                    />
                                </linearGradient>
                                <linearGradient id="fillFund" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                    offset="5%"
                                    stopColor="var(--color-fund)"
                                    stopOpacity={0.8}
                                    />
                                    <stop
                                    offset="95%"
                                    stopColor="var(--color-fund)"
                                    stopOpacity={0.1}
                                    />
                                </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={32}
                                tickFormatter={(value) => {
                                    const date = new Date(value)
                                    return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    })
                                }}
                                />
                                <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        })
                                    }}
                                    indicator="dot"
                                    />
                                }
                                />
                                <Area
                                dataKey="donation"
                                type="natural"
                                fill="url(#fillDonation)"
                                stroke="var(--color-donation)"
                                stackId="a"
                                />
                                <Area
                                dataKey="fund"
                                type="natural"
                                fill="url(#fillFund)"
                                stroke="var(--color-fund)"
                                stackId="a"
                                />
                                <ChartLegend content={<ChartLegendContent />} />
                            </AreaChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>
                <div className="mt-2 mb-2 grid md:grid-cols-3 grid-cols-1 gap-2 mb-4">
                    <div className="p-1">
                        <Card data-chart={id} className="flex flex-col">
                            <ChartStyle id={id} config={chartConfigType} />
                            <CardHeader className="flex-row items-start space-y-0 pb-0">
                                <div className="grid gap-1">
                                    <div className="font-roboto font-bold text-xl sm:text-xl md:text-xl">Pie Chart - Donation</div>
                                    <div className="font-roboto text-sm sm:text-sm md:text-sm">
                                        January - June 2024
                                    </div>
                                </div>
                                <Select value={activeMonth} onValueChange={setActiveMonth}>
                                <SelectTrigger
                                    className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
                                    aria-label="Select a value"
                                >
                                    <SelectValue placeholder="Select month" />
                                </SelectTrigger>
                                <SelectContent align="end" className="rounded-xl">
                                    {months.map((key) => {
                                        const config = chartConfigType[key as keyof typeof chartConfigType];
                                        if (!config) {
                                            return null;
                                        }
                                        return (
                                            <SelectItem
                                                key={key}
                                                value={key}
                                                className="rounded-lg [&_span]:flex"
                                            >
                                                <div className="flex items-center gap-2 text-xs">
                                                    <span
                                                        className="flex h-3 w-3 shrink-0 rounded-sm"
                                                        style={{
                                                            backgroundColor: `var(--color-${key})`,
                                                        }}
                                                    />
                                                    {config.label}
                                                </div>
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                                </Select>
                            </CardHeader>
                            <CardContent className="flex flex-1 justify-center pb-0 mt-6">
                                <ChartContainer
                                id={id}
                                config={chartConfig}
                                className="mx-auto aspect-square w-full max-w-[300px]"
                                >
                                <PieChart>
                                    <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                    />
                                    <Pie
                                    data={typeData}
                                    dataKey="donation"
                                    nameKey="month"
                                    innerRadius={60}
                                    strokeWidth={5}
                                    activeIndex={activeIndex}
                                    activeShape={({
                                        outerRadius = 0,
                                        ...props
                                    }: PieSectorDataItem) => (
                                        <g>
                                        <Sector {...props} outerRadius={outerRadius + 10} />
                                        <Sector
                                            {...props}
                                            outerRadius={outerRadius + 25}
                                            innerRadius={outerRadius + 12}
                                        />
                                        </g>
                                    )}
                                    >
                                    <Label
                                        content={({ viewBox }) => {
                                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                            return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                className="fill-foreground text-3xl font-bold"
                                                >
                                                {typeData[activeIndex].donation.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                x={viewBox.cx}
                                                y={(viewBox.cy || 0) + 24}
                                                className="fill-muted-foreground"
                                                >
                                                Donation
                                                </tspan>
                                            </text>
                                            )
                                        }
                                        }}
                                    />
                                    </Pie>
                                </PieChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="p-1">
                        <Card>
                            <CardHeader>
                                <div className="grid gap-1">
                                    <div className="font-roboto font-bold text-xl sm:text-xl md:text-xl">Bar Chart - Donation and Fund</div>
                                    <div className="font-roboto text-sm sm:text-sm md:text-sm">
                                        January - June 2024
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfigBar}>
                                <BarChart accessibilityLayer data={barData}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                    />
                                    <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="dashed" />}
                                    />
                                    <Bar dataKey="donation" fill="#6699FF" radius={4} />
                                    <Bar dataKey="fund" fill="#FF6666" radius={4} />
                                </BarChart>
                                </ChartContainer>
                            </CardContent>
                            <CardFooter className="flex-col items-start gap-2 text-sm mt-4">
                                <div className="flex gap-2 font-medium leading-none">
                                Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                                </div>
                                <div className="leading-none text-muted-foreground">
                                Showing total donation and fund for the last 5 months
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                    <div className="p-1">
                        <Card>
                            <CardHeader>
                                <div className="grid gap-1">
                                    <div className="font-roboto font-bold text-xl sm:text-xl md:text-xl">Radar Chart - Donation and Fund</div>
                                    <div className="font-roboto text-sm sm:text-sm md:text-sm">
                                        January - June 2024
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer
                                config={chartConfigBar}
                                className="mx-auto aspect-square max-h-[205px]"
                                >
                                <RadarChart
                                    data={barData}
                                    margin={{
                                    top: -40,
                                    bottom: -10,
                                    }}
                                >
                                    <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="line" />}
                                    />
                                    <PolarAngleAxis dataKey="month" />
                                    <PolarGrid />
                                    <Radar
                                    dataKey="donation"
                                    fill="#6699FF"
                                    fillOpacity={0.6}
                                    />
                                    <Radar dataKey="fund" fill="#FF6666" />
                                    <ChartLegend className="mt-8" content={<ChartLegendContent />} />
                                </RadarChart>
                                </ChartContainer>
                            </CardContent>
                            <CardFooter className="flex-col gap-2 pt-4 text-sm mt-4">
                                <div className="flex gap-2 font-medium leading-none">
                                Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                                </div>
                                <div className="flex gap-2 leading-none text-muted-foreground">
                                January - May 2024
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </div>

                <div className="relative w-full mb-8">
                    <Image 
                        src={image.src} 
                        alt="donation" 
                        width={1200}
                        height={100}
                        priority
                        draggable={false}
                        onClick={(e) => e.preventDefault()}
                        className="object-cover max-h-32 md:max-h-48 rounded-lg"
                    />
                    <div className="hidden md:flex absolute top-1/2 left-1/2 p-5 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-lg flex-col">
                        <span className="font-roboto text-xl font-semibold">"Charity is the bridge that connects those who have with those in need, transforming compassion into action and hope into reality."</span>
                        <span className="font-roboto text-xl text-gray-800 font-bold text-right">- Care4Poverty</span>
                    </div>
                </div>
                
                <h2 className="font-giorgio font-bold text-4xl sm:text-4xl md:text-5xl mb-3">Latest News</h2>
                <div>
                    { loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array.from({ length: 3 }).map((_, index) => (
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
                            {events.slice(0, 3).map((event) => (
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
                                                            <h1 className="font-roboto text-sm">{event.users.organization_name}</h1>
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

                                                <div className="mt-4">
                                                    <Carousel>
                                                        <CarouselContent>
                                                            {event.event_photos.map((photo: string, index: number) => (
                                                                <Image
                                                                    key={index}
                                                                    src={photo}
                                                                    alt={`event photo ${index + 1}`}
                                                                    width={600}
                                                                    height={600}
                                                                    priority
                                                                    draggable={false}
                                                                    onClick={(e) => e.preventDefault()}
                                                                    className="object-cover w-full h-autojustify-center"
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
                                                <div className="ml-3 mr-5">
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
                                                            <h1 className="font-roboto text-sm">Website</h1>
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
            </main>
        </div>
    );
}

export default DashboardPage;
