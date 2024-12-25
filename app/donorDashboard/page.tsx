"use client"; // Ensure this is a client component

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation'; // For redirection
import { getUser, signOut } from '../../lib/authFactory'; // Adjust the import path
import { toast } from 'react-toastify'; // For notifications
import { UserType } from  "@/datatypes/types";
import SideBarComponent from "@/components/dashboard/sideBar"; // Adjust the import path
import { Breadcrumb, BreadcrumbList, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbItem } from '@/components/ui/breadcrumb';
import { CupSoda, HeartPulse, Pizza, Shirt, User, TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, PieChart, Pie } from "recharts";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardTitle, CardDescription, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import Image from "next/image";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from '@/components/ui/pagination';

// Define a User type based on your application structure
type User = {
    email?: string;
};  

const chartDataOverview = [
    { month: "January", fund: 186, items: 80 },
    { month: "February", fund: 305, items: 200 },
    { month: "March", fund: 237, items: 120 },
    { month: "April", fund: 73, items: 190 },
    { month: "May", fund: 209, items: 130 },
    { month: "June", fund: 214, items: 140 },
  ]
   
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

const YourDonation = () => {
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

    const chartConfig = {
        views: {
          label: "Page Views",
        },
        globaldonation: {
          label: "donation",
          color: "hsl(var(--chart-1))",
        },
        globalfund: {
          label: "fund",
          color: "hsl(var(--chart-2))",
        },
    } satisfies ChartConfig;

    const [activeChart, setActiveChart] =
        useState<keyof typeof chartConfig>("globaldonation")

    const chartData = [
        { date: "2024-04-01", globaldonation: 222, globalfund: 150 },
        { date: "2024-04-02", globaldonation: 97, globalfund: 180 },
        { date: "2024-04-03", globaldonation: 167, globalfund: 120 },
        { date: "2024-04-04", globaldonation: 242, globalfund: 260 },
        { date: "2024-04-05", globaldonation: 373, globalfund: 290 },
        { date: "2024-04-06", globaldonation: 301, globalfund: 340 },
        { date: "2024-04-07", globaldonation: 245, globalfund: 180 },
        { date: "2024-04-08", globaldonation: 409, globalfund: 320 },
        { date: "2024-04-09", globaldonation: 59, globalfund: 110 },
        { date: "2024-04-10", globaldonation: 261, globalfund: 190 },
        { date: "2024-04-11", globaldonation: 327, globalfund: 350 },
        { date: "2024-04-12", globaldonation: 292, globalfund: 210 },
        { date: "2024-04-13", globaldonation: 342, globalfund: 380 },
        { date: "2024-04-14", globaldonation: 137, globalfund: 220 },
        { date: "2024-04-15", globaldonation: 120, globalfund: 170 },
        { date: "2024-04-16", globaldonation: 138, globalfund: 190 },
        { date: "2024-04-17", globaldonation: 446, globalfund: 360 },
        { date: "2024-04-18", globaldonation: 364, globalfund: 410 },
        { date: "2024-04-19", globaldonation: 243, globalfund: 180 },
        { date: "2024-04-20", globaldonation: 89, globalfund: 150 },
        { date: "2024-04-21", globaldonation: 137, globalfund: 200 },
        { date: "2024-04-22", globaldonation: 224, globalfund: 170 },
        { date: "2024-04-23", globaldonation: 138, globalfund: 230 },
        { date: "2024-04-24", globaldonation: 387, globalfund: 290 },
        { date: "2024-04-25", globaldonation: 215, globalfund: 250 },
        { date: "2024-04-26", globaldonation: 75, globalfund: 130 },
        { date: "2024-04-27", globaldonation: 383, globalfund: 420 },
        { date: "2024-04-28", globaldonation: 122, globalfund: 180 },
        { date: "2024-04-29", globaldonation: 315, globalfund: 240 },
        { date: "2024-04-30", globaldonation: 454, globalfund: 380 },
        { date: "2024-05-01", globaldonation: 165, globalfund: 220 },
        { date: "2024-05-02", globaldonation: 293, globalfund: 310 },
        { date: "2024-05-03", globaldonation: 247, globalfund: 190 },
        { date: "2024-05-04", globaldonation: 385, globalfund: 420 },
        { date: "2024-05-05", globaldonation: 481, globalfund: 390 },
        { date: "2024-05-06", globaldonation: 498, globalfund: 520 },
        { date: "2024-05-07", globaldonation: 388, globalfund: 300 },
        { date: "2024-05-08", globaldonation: 149, globalfund: 210 },
        { date: "2024-05-09", globaldonation: 227, globalfund: 180 },
        { date: "2024-05-10", globaldonation: 293, globalfund: 330 },
        { date: "2024-05-11", globaldonation: 335, globalfund: 270 },
        { date: "2024-05-12", globaldonation: 197, globalfund: 240 },
        { date: "2024-05-13", globaldonation: 197, globalfund: 160 },
        { date: "2024-05-14", globaldonation: 448, globalfund: 490 },
        { date: "2024-05-15", globaldonation: 473, globalfund: 380 },
        { date: "2024-05-16", globaldonation: 338, globalfund: 400 },
        { date: "2024-05-17", globaldonation: 499, globalfund: 420 },
        { date: "2024-05-18", globaldonation: 315, globalfund: 350 },
        { date: "2024-05-19", globaldonation: 235, globalfund: 180 },
        { date: "2024-05-20", globaldonation: 177, globalfund: 230 },
        { date: "2024-05-21", globaldonation: 82, globalfund: 140 },
        { date: "2024-05-22", globaldonation: 81, globalfund: 120 },
        { date: "2024-05-23", globaldonation: 252, globalfund: 290 },
        { date: "2024-05-24", globaldonation: 294, globalfund: 220 },
        { date: "2024-05-25", globaldonation: 201, globalfund: 250 },
        { date: "2024-05-26", globaldonation: 213, globalfund: 170 },
        { date: "2024-05-27", globaldonation: 420, globalfund: 460 },
        { date: "2024-05-28", globaldonation: 233, globalfund: 190 },
        { date: "2024-05-29", globaldonation: 78, globalfund: 130 },
        { date: "2024-05-30", globaldonation: 340, globalfund: 280 },
        { date: "2024-05-31", globaldonation: 178, globalfund: 230 },
        { date: "2024-06-01", globaldonation: 178, globalfund: 200 },
        { date: "2024-06-02", globaldonation: 470, globalfund: 410 },
        { date: "2024-06-03", globaldonation: 103, globalfund: 160 },
        { date: "2024-06-04", globaldonation: 439, globalfund: 380 },
        { date: "2024-06-05", globaldonation: 88, globalfund: 140 },
        { date: "2024-06-06", globaldonation: 294, globalfund: 250 },
        { date: "2024-06-07", globaldonation: 323, globalfund: 370 },
        { date: "2024-06-08", globaldonation: 385, globalfund: 320 },
        { date: "2024-06-09", globaldonation: 438, globalfund: 480 },
        { date: "2024-06-10", globaldonation: 155, globalfund: 200 },
        { date: "2024-06-11", globaldonation: 92, globalfund: 150 },
        { date: "2024-06-12", globaldonation: 492, globalfund: 420 },
        { date: "2024-06-13", globaldonation: 81, globalfund: 130 },
        { date: "2024-06-14", globaldonation: 426, globalfund: 380 },
        { date: "2024-06-15", globaldonation: 307, globalfund: 350 },
        { date: "2024-06-16", globaldonation: 371, globalfund: 310 },
        { date: "2024-06-17", globaldonation: 475, globalfund: 520 },
        { date: "2024-06-18", globaldonation: 107, globalfund: 170 },
        { date: "2024-06-19", globaldonation: 341, globalfund: 290 },
        { date: "2024-06-20", globaldonation: 408, globalfund: 450 },
        { date: "2024-06-21", globaldonation: 169, globalfund: 210 },
        { date: "2024-06-22", globaldonation: 317, globalfund: 270 },
        { date: "2024-06-23", globaldonation: 480, globalfund: 530 },
        { date: "2024-06-24", globaldonation: 132, globalfund: 180 },
        { date: "2024-06-25", globaldonation: 141, globalfund: 190 },
        { date: "2024-06-26", globaldonation: 434, globalfund: 380 },
        { date: "2024-06-27", globaldonation: 448, globalfund: 490 },
        { date: "2024-06-28", globaldonation: 149, globalfund: 200 },
        { date: "2024-06-29", globaldonation: 103, globalfund: 160 },
        { date: "2024-06-30", globaldonation: 446, globalfund: 400 },
    ]

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
                <div className="mt-1 mb-2 mr-10 md:mr-0 md:flex">
                    <div className='md:w-2/3 md:mr-4 mb-5 flex flex-col'>
                        <Card className='p-5 flex-1'>
                            <h2 className="font-roboto text-lg sm:text-xl md:text-xl">Recently Donated Items</h2>
                            <p className="font-roboto text-sm sm:text-sm md:text-sm text-gray-500">Donation summary</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 mt-1">
                                <Card className="m-1 bg-red-300 flex flex-col items-center transform transition-transform hover:scale-105">
                                    <CardHeader>
                                        <div className="flex items-center justify-center w-16 h-16 bg-red-500 rounded-full">
                                            <Shirt />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-col justify-center items-center">
                                            <p className='font-giorgio text-5xl font-bold'>20</p>
                                            <p className='font-roboto text-md mt-1 mb-5'>Wearable Items</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="m-1 bg-yellow-300 flex flex-col items-center transform transition-transform hover:scale-105">
                                    <CardHeader>
                                        <div className="flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full">
                                            <Pizza />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-col justify-center items-center">
                                            <p className='font-giorgio text-5xl font-bold'>6</p>
                                            <p className='font-roboto text-md mt-1 mb-5'>Food</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="m-1 bg-green-300 flex flex-col items-center transform transition-transform hover:scale-105">
                                    <CardHeader>
                                        <div className="flex items-center justify-center w-16 h-16 bg-green-500 rounded-full">
                                            <CupSoda />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-col justify-center items-center">
                                            <p className='font-giorgio text-5xl font-bold'>10</p>
                                            <p className='font-roboto text-md mt-1 mb-5'>Drinks</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="m-1 bg-purple-300 flex flex-col items-center transform transition-transform hover:scale-105">
                                    <CardHeader>
                                        <div className="flex items-center justify-center w-16 h-16 bg-purple-500 rounded-full">
                                            <HeartPulse />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-col justify-center items-center">
                                            <p className='font-giorgio text-5xl font-bold'>14</p>
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
                            <h2 className="font-roboto text-lg sm:text-xl md:text-xl">Donation Overview</h2>
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
                <div className="mt-1 mb-2 mr-10 md:mr-0 md:flex md:flex-col">
                    <div className="mt-7 flex">
                        <h2 className="font-giorgio font-bold text-2xl sm:text-3xl md:text-4xl">Supported Organizations</h2>
                    </div>
                    <div className='mt-5 grid grid-cols-1 md:grid-cols-3 gap-4'>
                        {[...Array(6)].map((_, index) => (
                            <Card 
                                key={index} 
                                className='relative cursor-pointer overflow-hidden'
                            >
                                <Image 
                                    src="/images/localCharity.jpg" 
                                    alt="Donor Image" 
                                    height={600}
                                    width={500}
                                    className="w-full rounded-t-lg object-cover transition-transform duration-200 hover:scale-110"
                                />
                                
                                <div 
                                    className="absolute h-1/2 inset-0 z-10 bg-white bg-opacity-80"
                                    style={{ top: '50%'}}
                                >
                                    <div className="m-4">
                                        <h2 className="font-roboto text-lg font-bold sm:text-2xl md:text-2xl">Glasses to the Rescue</h2>
                                        <p className="font-roboto text-sm font-bold sm:text-sm md:text-sm">
                                            Location:
                                        </p>
                                        <p className="font-roboto text-sm sm:text-sm md:text-sm">
                                            Penang Times Square, Jalan Dato Keramat, 10150 George Town, Penang, Malaysia.
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                    <div className="mt-3">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious href="#" />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#" isActive>1</PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#">
                                        2
                                    </PaginationLink>
                                 </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#">3</PaginationLink>
                                </PaginationItem>
                                    <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationNext href="#" />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </div>

                <div className="mt-7 flex">
                    <h2 className="font-giorgio font-bold text-2xl sm:text-3xl md:text-4xl">Insights and Analysis</h2>
                </div>
                {/* third colume */}
                <div className="mt-1 mb-2 mr-10 md:mr-0 md:flex">
                    {/* pie chart */}
                    <div className='md:w-1/3 flex flex-col p-1'>
                        <Card className="flex flex-col">
                            <CardHeader className="items-center pb-0 p-6">
                                <div className="font-bold text-lg">Donation Overview by Category</div>
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
                                    <div className="font-bold text-lg">Donation trend over time</div>
                                    <div className="font-roboto text-sm">
                                        Showing total donations and funds for the last 3 months
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
                
                <div className="mt-1 mb-2 mr-10 md:mr-0 md:flex md:flex-col">
                    <div className="mt-7 flex">
                        <h2 className="font-giorgio font-bold text-2xl sm:text-3xl md:text-4xl">Recommended for you</h2>
                    </div>
                    <div className='mt-5 mb-5 grid grid-cols-1 md:grid-cols-3 gap-4'>
                        {[...Array(3)].map((_, index) => (
                            <Card
                                className="cursor-pointer hover:bg-blue-100 transition-colors duration-200 overflow-hidden"
                                key={index}
                            >
                            <CardContent className="flex flex-col p-0">
                                <div className="relative">
                                    <Image
                                        src="/images/localCharity.jpg"
                                        alt="event"
                                        width={600}
                                        height={500}
                                        priority
                                        draggable={false}
                                        onClick={(e) => e.preventDefault()}
                                        className="h-48 w-full rounded-t-lg object-cover transition-transform duration-200 hover:scale-110"
                                    />
                                </div>
                                <div className="m-4 flex flex-col justify-between items-center">
                                    <div>
                                        <a href="https://www.charityConnectGlobal.org" className="font-roboto text-sm text-gray-500" target="_blank" rel="noopener noreferrer">
                                            www.charityConnectGlobal.org
                                        </a>
                                        <p className="font-roboto text-xl font-semibold mt-2">Charity Connect Global</p>
                                        <p className="font-roboto text-sm">
                                            A centralized platform connecting donors and charities worldwide, enabling seamless contributions 
                                            to impactful causes.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default YourDonation;
