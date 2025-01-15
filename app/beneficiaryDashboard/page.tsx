"use client"; // Ensure this is a client component

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation'; // For redirection
import { getUser, signOut } from '../../lib/authFactory'; // Adjust the import path
import { toast } from 'react-toastify'; // For notifications
import { UserType } from  "@/datatypes/types";
import SideBarComponent from "@/components/dashboard/sideBar"; // Adjust the import path
import { Breadcrumb, BreadcrumbList, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbItem } from '@/components/ui/breadcrumb';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { CupSoda, HeartPulse, Pizza, Shirt, User, TrendingUp, IdCard, Phone, Mail, PanelsTopLeft, MessageCircle } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, PieChart, Pie } from "recharts";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardTitle, CardDescription, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import Image from "next/image";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from '@/components/ui/pagination';
import { getItems, getEvents, getNotifications } from '@/lib/supabaseAPI';
import { Skeleton } from '@/components/ui/skeleton';
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Head from 'next/head';
import { chartData, chartDataOverview } from './data/data';
import dynamic from "next/dynamic";

const Map = dynamic(() => import('@/components/map/map'), { ssr: false });

// Define a User type based on your application structure
// type User = {
//     email?: string;
// };  

interface RequestItem {
    request_amount: number;
    resource_category: string;
}

const YourRequest = () => {
    const [userData, setUserData] = useState<UserType | null>(null);
    // const [user, setUser] = useState<User | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [wearableItemsCount, setWearableItemsCount] = useState(0);
    const [foodCount, setFoodCount] = useState(0);
    const [drinksCount, setDrinksCount] = useState(0);
    const [healthSuppliesCount, setHealthSuppliesCount] = useState(0);
    const [newNotifications, setNewNotifications] = useState(0);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

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
            const currentUser: any | null = await getUser();
            if (!currentUser) {
                toast.error('User not found! Redirecting to login...', {
                    autoClose: 1350,
                });
                router.push('/auth/login');
            } else {
                // setUser(currentUser);
                setUserId(currentUser.id);
            }
        };

        fetchUser();
    }, []);

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

    const handleCardClick = (organizationId: string) => {
        if (userData?.id) {
            router.push(`/beneficiaryRequest?organizationId=${organizationId}`);
        }
    };
    
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

    const chartConfigOverview = {
        fund: {
          label: "Fund",
          color: "#2563eb",
        },
        items: {
          label: "Items",
          color: "#60a5fa",
        },
    } satisfies ChartConfig;

    const chartConfig = {
        views: {
          label: "Page Views",
        },
        globaldonation: {
          label: "request",
          color: "hsl(var(--chart-1))",
        },
        globalfund: {
          label: "fund",
          color: "hsl(var(--chart-2))",
        },
    } satisfies ChartConfig;

    const [activeChart, setActiveChart] =
        useState<keyof typeof chartConfig>("globaldonation")

    const total = useMemo(
        () => ({
            globaldonation: chartData.reduce((acc, curr) => acc + curr.globaldonation, 0),
            globalfund: chartData.reduce((acc, curr) => acc + curr.globalfund, 0),
        }),
        [chartData]
    )

    const chartDataPie = [
        { item: "wearable", amount: 275, fill: "var(--color-wearable)" },
        { item: "food", amount: 200, fill: "var(--color-food)" },
        { item: "drinks", amount: 187, fill: "var(--color-drinks)" },
        { item: "health", amount: 173, fill: "var(--color-health)" },
        { item: "other", amount: 90, fill: "var(--color-other)" },
      ]
    
      const chartConfigPie = {
        item: {
          label: "Items",
        },
        wearable: {
          label: "Wearable Items",
          color: "hsl(var(--chart-1))",
        },
        food: {
          label: "Food",
          color: "hsl(var(--chart-2))",
        },
        drinks: {
          label: "Drinks",
          color: "hsl(var(--chart-3))",
        },
        health: {
          label: "Health Supplies",
          color: "hsl(var(--chart-4))",
        },
        other: {
          label: "Other",
          color: "hsl(var(--chart-5))",
        },
    } satisfies ChartConfig;

    useEffect(() => {
        const fetchItems = async () => {
            if(!userId) return;

            setLoading(true);
            try {
                const { data, error } = await getItems('request', userId, null, 'Completed');
                console.log("Beneficiary ID: ", userId);
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
    }, [userId]);

    useEffect(() => {
        if (!userData) {
            return;
        }
        // Calculate category counts
        const categoryCounts = items.reduce((acc, item) => {
            item.request_items.forEach((requestItem: RequestItem) => {
                if (requestItem.request_amount > 0) {
                    const category = requestItem.resource_category;
                    if (!acc[category]) {
                        acc[category] = 0;
                    }
                    acc[category] += requestItem.request_amount;
                }
            });
            return acc;
        }, {});

        // Function to animate count
        const animateCount = (target: number, setState: React.Dispatch<React.SetStateAction<number>>) => {
            let currentCount = 0;
            const increment = Math.ceil(target / 50);
            const interval = setInterval(() => {
                currentCount += increment;
                if (currentCount >= target) {
                    currentCount = target;
                    clearInterval(interval);
                }
                setState(currentCount);
            }, 10);
        };

        animateCount(categoryCounts['Wearable Items'] || 0, setWearableItemsCount);
        animateCount(categoryCounts['Foods'] || 0, setFoodCount);
        animateCount(categoryCounts['Drinks'] || 0, setDrinksCount);
        animateCount(categoryCounts['Health Supplies'] || 0, setHealthSuppliesCount);
    
    }, [items]);

    const truncateText = (text: string, wordLimit: number) => {
        const words = text.split(' ');
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(' ') + ' ...';
        }
        return text;
    };

    return (
        <div className="h-screen flex">
            <Head>
                <link rel="preload" href="/images/localCharity.jpg" as="image" />
            </Head>

            <SideBarComponent 
                userData={userData || undefined}
                onLogout={handleLogout}
            />

            {/* Main Content */}
            <main className="h-screen w-screen flex flex-col mt-8 md:ml-10 ml-5 md:mr-10 mr-5 mb-5">
                <div className="flex items-center gap-2">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>Home</BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink className="font-semibold text-black" href="/beneficiaryDashboard">Dashboard</BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                {/* Title */}
                <div className="mt-7 mb-7">
                    <h1 className="font-giorgio font-bold text-4xl sm:text-5xl md:text-6xl">Dashboard</h1>
                </div>

                {/* first colume */}
                <div className="mt-1 mb-2 md:flex">
                    <div className='md:w-2/3 md:mr-4 mb-5 flex flex-col'>
                        <Card className='p-5 flex-1'>
                            <h2 className="font-roboto text-lg sm:text-xl md:text-xl">Recently Requested Items</h2>
                            <p className="font-roboto text-sm sm:text-sm md:text-sm text-gray-500">Request summary</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 mt-1">
                                <Card className="m-2 bg-red-300 flex flex-col items-center transform transition-transform hover:scale-105">
                                    <CardHeader>
                                        <div className="flex items-center justify-center w-16 h-16 bg-red-500 rounded-full">
                                            <Shirt />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-col justify-center items-center">
                                            <p className='font-giorgio text-5xl font-bold'>{wearableItemsCount}</p>
                                            <p className='font-roboto text-md mt-1 mb-5'>Wearable Items</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="m-2 bg-yellow-300 flex flex-col items-center transform transition-transform hover:scale-105">
                                    <CardHeader>
                                        <div className="flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full">
                                            <Pizza />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-col justify-center items-center">
                                            <p className='font-giorgio text-5xl font-bold'>{foodCount}</p>
                                            <p className='font-roboto text-md mt-1 mb-5'>Food</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="m-2 bg-green-300 flex flex-col items-center transform transition-transform hover:scale-105">
                                    <CardHeader>
                                        <div className="flex items-center justify-center w-16 h-16 bg-green-500 rounded-full">
                                            <CupSoda />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-col justify-center items-center">
                                            <p className='font-giorgio text-5xl font-bold'>{drinksCount}</p>
                                            <p className='font-roboto text-md mt-1 mb-5'>Drinks</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="m-2 bg-purple-300 flex flex-col items-center transform transition-transform hover:scale-105">
                                    <CardHeader>
                                        <div className="flex items-center justify-center w-16 h-16 bg-purple-500 rounded-full">
                                            <HeartPulse />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-col justify-center items-center">
                                            <p className='font-giorgio text-5xl font-bold'>{healthSuppliesCount}</p>
                                            <p className='font-roboto text-md mt-1 mb-5'>Health supplies</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </Card>  
                    </div>
                    {/* financial overview */}
                    <div className='md:w-1/3 flex flex-col'>
                        <Card className='p-5'>
                            <h2 className="font-roboto text-lg sm:text-xl md:text-xl">Request Overview</h2>
                            <div className="mt-10">
                                <ChartContainer config={chartConfigOverview} className="min-h-[200px] w-full">
                                    <BarChart accessibilityLayer data={chartDataOverview}>
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

                {/* second colume */}
                <div className="mt-1 mb-2 md:flex md:flex-col">
                    <div className="mt-7 flex">
                        <h2 className="font-giorgio font-bold text-3xl sm:text-3xl md:text-4xl">Organizations Requested</h2>
                    </div>
                    {loading ? (
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
                        <div className='mt-5 grid grid-cols-1 md:grid-cols-3 gap-4'>
                            {currentItems.map((item) => (
                                <div key={item.request_id}>
                                    <Card 
                                        className="relative cursor-pointer overflow-hidden"
                                        style={{ width: '100%', height: 250 }}
                                        onClick={() => handleCardClick(item.organization_id)}
                                    >
                                        <Image 
                                            src={item.users.profile_picture || '/images/localCharity.png'}
                                            alt="Donor Image" 
                                            height={600}
                                            width={600}
                                            draggable={false}
                                            onClick={(e) => e.preventDefault()}
                                            style={{ width: '100%', height: '100%' }}
                                            className="w-full rounded-t-lg object-cover transition-transform duration-200 hover:scale-110"
                                        />

                                        <div
                                            className="absolute h-1/2 inset-0 z-10 bg-white bg-opacity-80"
                                            style={{ top: '50%' }}
                                        >
                                            <div className="m-4">
                                                <h2 className="font-roboto text-lg font-bold sm:text-xl md:text-xl">{item.users.organization_name}</h2>
                                                <p className="font-roboto text-sm font-bold sm:text-sm md:text-sm">
                                                    Location:
                                                </p>
                                                <p className="font-roboto text-sm sm:text-sm md:text-sm">
                                                    {truncateText(item.users.organization_address, 10)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="absolute top-0 left-0 z-10 bg-white bg-opacity-80 p-1">
                                            <p className="font-roboto text-sm sm:text-sm md:text-sm">
                                                {new Date(item.request_date).toLocaleString('default', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                        </div>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                    <div className="mt-3">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious 
                                        href="#" 
                                        onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)} 
                                    />
                                </PaginationItem>
                                {Array.from({ length: Math.ceil(items.length / itemsPerPage) }).map((_, index) => (
                                    <PaginationItem key={index}>
                                        <PaginationLink 
                                            href="#" 
                                            isActive={currentPage === index + 1} 
                                            onClick={() => setCurrentPage(index + 1)}
                                        >
                                            {index + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <PaginationNext 
                                        href="#" 
                                        onClick={() => setCurrentPage(currentPage < Math.ceil(items.length / itemsPerPage) ? currentPage + 1 : currentPage)} 
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>

                <div className="mt-7 flex">
                    <h2 className="font-giorgio font-bold text-3xl sm:text-3xl md:text-4xl">Insights and Analysis</h2>
                </div>
                {/* third colume */}
                <div className="mt-1 mb-2 md:flex">
                    {/* pie chart */}
                    <div className='md:w-1/3 flex flex-col p-1'>
                        <Card className="flex flex-col">
                            <CardHeader className="items-center pb-0 p-6">
                                <div className="font-bold text-lg">Request Overview by Category</div>
                                <div className="font-roboto text-sm">January - June 2024</div>
                            </CardHeader>
                            <CardContent className="flex-1 pb-0">
                                <ChartContainer
                                config={chartConfigPie}
                                className="mx-auto aspect-square max-h-[250px] px-0"
                                >
                                <PieChart>
                                    <ChartTooltip
                                    content={<ChartTooltipContent nameKey="amount" hideLabel />}
                                    />
                                    <Pie
                                    data={chartDataPie}
                                    dataKey="amount"
                                    labelLine={false}
                                    label={({ payload, ...props }) => {
                                        return (
                                        <text
                                            cx={props.cx}
                                            cy={props.cy}
                                            x={props.x}
                                            y={props.y}
                                            textAnchor={props.textAnchor}
                                            dominantBaseline={props.dominantBaseline}
                                            fill="hsla(var(--foreground))"
                                        >
                                            {payload.amount}
                                        </text>
                                        )
                                    }}
                                    nameKey="item"
                                    />
                                </PieChart>
                                </ChartContainer>
                            </CardContent>
                            <CardFooter className="flex-col gap-2 text-sm">
                                <div className="flex items-center gap-2 font-medium leading-none">
                                Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                                </div>
                                <div className="leading-none text-muted-foreground">
                                Showing total items donated for the last 6 months
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                    <div className='md:w-2/3 flex flex-col p-1'>
                        <Card>
                            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                                    <div className="font-bold text-lg">Request trend over time</div>
                                    <div className="font-roboto text-sm">
                                        Showing total requests and funds for the last 3 months
                                    </div>
                                </div>
                                <div className="flex">
                                {["globaldonation", "globalfund"].map((key) => {
                                    const chart = key as keyof typeof chartConfig
                                    return (
                                    <button
                                        key={chart}
                                        data-active={activeChart === chart}
                                        className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                                        onClick={() => setActiveChart(chart)}
                                    >
                                        <span className="text-xs text-muted-foreground">
                                        {chartConfig[chart].label}
                                        </span>
                                        <span className="text-lg font-bold leading-none sm:text-3xl">
                                        {total[key as keyof typeof total].toLocaleString()}
                                        </span>
                                    </button>
                                    )
                                })}
                                </div>
                            </CardHeader>
                            <CardContent className="px-2 sm:p-6">
                                <ChartContainer
                                config={chartConfig}
                                className="aspect-auto h-[250px] w-full"
                                >
                                <BarChart
                                    accessibilityLayer
                                    data={chartData}
                                    margin={{
                                    left: 12,
                                    right: 12,
                                    }}
                                >
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
                                    content={
                                        <ChartTooltipContent
                                        className="w-[150px]"
                                        nameKey="views"
                                        labelFormatter={(value) => {
                                            return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                            })
                                        }}
                                        />
                                    }
                                    />
                                    <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
                                </BarChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>  
                    </div>
                </div>

                <div className="mt-7">
                    <h2 className="font-giorgio font-bold text-3xl sm:text-3xl md:text-4xl">Recommended for you</h2>
                </div>
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

export default YourRequest;
