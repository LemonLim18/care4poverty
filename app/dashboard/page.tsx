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
import { PieSectorDataItem } from 'recharts/types/polar/Pie';
import { Link, PanelsTopLeft, Mail, Phone, IdCard, TrendingUp } from "lucide-react";
import image from "../../public/images/donation.jpeg"
import image2 from "../../public/images/dummy/avatar.jpg"
import Image from 'next/image'; // Ensure this import is present
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const typeData = [
    { month: "january", donation: 186, fund: 120, fill: "var(--color-january)" },
    { month: "february", donation: 305, fund: 150, fill: "var(--color-february)" },
    { month: "march", donation: 237, fund: 180, fill: "var(--color-march)" },
    { month: "april", donation: 173, fund: 130, fill: "var(--color-april)" },
    { month: "may", donation: 209, fund: 160, fill: "var(--color-may)" },
]

const barData = [
    { month: "january", donation: 186, fund: 120 },
    { month: "february", donation: 305, fund: 150 },
    { month: "march", donation: 237, fund: 180 },
    { month: "april", donation: 173, fund: 130 },
    { month: "may", donation: 209, fund: 160 },
]

const chartConfigType = {
    month: {
      label: "Month",
    },
    donation: {
      label: "Donation",
    },
    fund: {
      label: "Fund",
    },
    january: {
      label: "January",
      color: "hsl(var(--chart-1))",
    },
    february: {
      label: "February",
      color: "hsl(var(--chart-2))",
    },
    march: {
      label: "March",
      color: "hsl(var(--chart-3))",
    },
    april: {
      label: "April",
      color: "hsl(var(--chart-4))",
    },
    may: {
      label: "May",
      color: "hsl(var(--chart-5))",
    },
    june: {
      label: "June",
      color: "hsl(var(--chart-6))",
    },
} satisfies ChartConfig;

const chartConfigBar = {
    donation: {
      label: "Donation",
    },
    fund: {
      label: "Fund",
    },
} satisfies ChartConfig;

const chartData = [
    { date: "2024-04-01", donation: 222, fund: 150 },
    { date: "2024-04-02", donation: 97, fund: 180 },
    { date: "2024-04-03", donation: 167, fund: 120 },
    { date: "2024-04-04", donation: 242, fund: 260 },
    { date: "2024-04-05", donation: 373, fund: 290 },
    { date: "2024-04-06", donation: 301, fund: 340 },
    { date: "2024-04-07", donation: 245, fund: 180 },
    { date: "2024-04-08", donation: 409, fund: 320 },
    { date: "2024-04-09", donation: 59, fund: 110 },
    { date: "2024-04-10", donation: 261, fund: 190 },
    { date: "2024-04-11", donation: 327, fund: 350 },
    { date: "2024-04-12", donation: 292, fund: 210 },
    { date: "2024-04-13", donation: 342, fund: 380 },
    { date: "2024-04-14", donation: 137, fund: 220 },
    { date: "2024-04-15", donation: 120, fund: 170 },
    { date: "2024-04-16", donation: 138, fund: 190 },
    { date: "2024-04-17", donation: 446, fund: 360 },
    { date: "2024-04-18", donation: 364, fund: 410 },
    { date: "2024-04-19", donation: 243, fund: 180 },
    { date: "2024-04-20", donation: 89, fund: 150 },
    { date: "2024-04-21", donation: 137, fund: 200 },
    { date: "2024-04-22", donation: 224, fund: 170 },
    { date: "2024-04-23", donation: 138, fund: 230 },
    { date: "2024-04-24", donation: 387, fund: 290 },
    { date: "2024-04-25", donation: 215, fund: 250 },
    { date: "2024-04-26", donation: 75, fund: 130 },
    { date: "2024-04-27", donation: 383, fund: 420 },
    { date: "2024-04-28", donation: 122, fund: 180 },
    { date: "2024-04-29", donation: 315, fund: 240 },
    { date: "2024-04-30", donation: 454, fund: 380 },
    { date: "2024-05-01", donation: 165, fund: 220 },
    { date: "2024-05-02", donation: 293, fund: 310 },
    { date: "2024-05-03", donation: 247, fund: 190 },
    { date: "2024-05-04", donation: 385, fund: 420 },
    { date: "2024-05-05", donation: 481, fund: 390 },
    { date: "2024-05-06", donation: 498, fund: 520 },
    { date: "2024-05-07", donation: 388, fund: 300 },
    { date: "2024-05-08", donation: 149, fund: 210 },
    { date: "2024-05-09", donation: 227, fund: 180 },
    { date: "2024-05-10", donation: 293, fund: 330 },
    { date: "2024-05-11", donation: 335, fund: 270 },
    { date: "2024-05-12", donation: 197, fund: 240 },
    { date: "2024-05-13", donation: 197, fund: 160 },
    { date: "2024-05-14", donation: 448, fund: 490 },
    { date: "2024-05-15", donation: 473, fund: 380 },
    { date: "2024-05-16", donation: 338, fund: 400 },
    { date: "2024-05-17", donation: 499, fund: 420 },
    { date: "2024-05-18", donation: 315, fund: 350 },
    { date: "2024-05-19", donation: 235, fund: 180 },
    { date: "2024-05-20", donation: 177, fund: 230 },
    { date: "2024-05-21", donation: 82, fund: 140 },
    { date: "2024-05-22", donation: 81, fund: 120 },
    { date: "2024-05-23", donation: 252, fund: 290 },
    { date: "2024-05-24", donation: 294, fund: 220 },
    { date: "2024-05-25", donation: 201, fund: 250 },
    { date: "2024-05-26", donation: 213, fund: 170 },
    { date: "2024-05-27", donation: 420, fund: 460 },
    { date: "2024-05-28", donation: 233, fund: 190 },
    { date: "2024-05-29", donation: 78, fund: 130 },
    { date: "2024-05-30", donation: 340, fund: 280 },
    { date: "2024-05-31", donation: 178, fund: 230 },
    { date: "2024-06-01", donation: 178, fund: 200 },
    { date: "2024-06-02", donation: 470, fund: 410 },
    { date: "2024-06-03", donation: 103, fund: 160 },
    { date: "2024-06-04", donation: 439, fund: 380 },
    { date: "2024-06-05", donation: 88, fund: 140 },
    { date: "2024-06-06", donation: 294, fund: 250 },
    { date: "2024-06-07", donation: 323, fund: 370 },
    { date: "2024-06-08", donation: 385, fund: 320 },
    { date: "2024-06-09", donation: 438, fund: 480 },
    { date: "2024-06-10", donation: 155, fund: 200 },
    { date: "2024-06-11", donation: 92, fund: 150 },
    { date: "2024-06-12", donation: 492, fund: 420 },
    { date: "2024-06-13", donation: 81, fund: 130 },
    { date: "2024-06-14", donation: 426, fund: 380 },
    { date: "2024-06-15", donation: 307, fund: 350 },
    { date: "2024-06-16", donation: 371, fund: 310 },
    { date: "2024-06-17", donation: 475, fund: 520 },
    { date: "2024-06-18", donation: 107, fund: 170 },
    { date: "2024-06-19", donation: 341, fund: 290 },
    { date: "2024-06-20", donation: 408, fund: 450 },
    { date: "2024-06-21", donation: 169, fund: 210 },
    { date: "2024-06-22", donation: 317, fund: 270 },
    { date: "2024-06-23", donation: 480, fund: 530 },
    { date: "2024-06-24", donation: 132, fund: 180 },
    { date: "2024-06-25", donation: 141, fund: 190 },
    { date: "2024-06-26", donation: 434, fund: 380 },
    { date: "2024-06-27", donation: 448, fund: 490 },
    { date: "2024-06-28", donation: 149, fund: 200 },
    { date: "2024-06-29", donation: 103, fund: 160 },
    { date: "2024-06-30", donation: 446, fund: 400 },
]

const chartConfig = {
    date: {
      label: "Date",
    },
    donation: {
      label: "donation",
      color: "hsl(var(--chart-1))",
    },
    fund: {
      label: "Fund",
      color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;
  

const DashboardPage = () => {
    const [userData, setUserData] = useState<UserType | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [donationCount, setDonationCount] = useState<number>(0);
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
            console.log("Current User: ", currentUser);
            if (!currentUser) {
                toast.error('User not found! Redirecting to login...', {
                    autoClose: 1350,
                });
                router.push('/auth/login');
            } else {
                setUser(currentUser);
                setUserId(currentUser.id);
                // Fetch user data after getting the current user
                fetchUserData(currentUser.id);
            }
        };

        const fetchUserData = async (userId: string) => {
            const { data: userData, error: fetchError } = await getRecordById('users', userId);
            if (fetchError) {
                console.error('Error fetching user data:', fetchError.message);
                return;
            }
            if (userData) {
                sessionStorage.setItem('user', JSON.stringify(userData)); // Store user data
                setUserData(userData); // Set user data in state
                console.log('User data stored in session storage:', userData);
            } else {
                console.error("User data is undefined.");
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

        // Donation count animation
        let count = 0;
        const targetCount = 353;
        const interval = setInterval(() => {
            count += 1;
            setDonationCount(count);
            if (count >= targetCount) {
                clearInterval(interval);
            }
        }, 10);

        return () => clearInterval(interval);
    }, []);

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

    // const handleTest = async () => {
        // console.log("Show the session storage: ", user); 
    // }

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
                        <div className='flex p-4 grid grid-cols-2 md:grid-cols-4'>
                            {[...Array(4)].map((_, index) => (
                                <div key={index} className='flex'>
                                    <Avatar className='h-12 w-12'>
                                        <AvatarImage 
                                            src="https://github.com/shadcn.png" 
                                            alt="avatar" 
                                            className='object-cover'
                                        />
                                        <AvatarFallback>H</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col ml-3">
                                        <h1 className="font-roboto font-bold text-xl sm:text-xl md:text-xl">John Doe</h1>
                                        <h1 className="font-roboto text-sm sm:text-sm md:text-sm">100 donations</h1>
                                    </div>
                                    
                                </div>
                            ))}
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
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    {[...Array(3)].map((_, index) => (
                        <div
                            className="cursor-pointer hover:bg-blue-100 transition-colors duration-200 overflow-hidden mb-5"
                            key={index}
                        >
                        <div className="flex flex-col">
                            <div>
                                <Image
                                    src="/images/localCharity.jpg"
                                    alt="event"
                                    width={600}
                                    height={500}
                                    priority
                                    draggable={false}
                                    onClick={(e) => e.preventDefault()}
                                    className="h-48 w-full object-cover transition-transform duration-200 hover:scale-110"
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
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default DashboardPage;
