"use client"; // Ensure this is a client component

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // For redirection
import { getUser, signOut } from '../../lib/authFactory'; // Adjust the import path
import { Button } from "@/components/ui/button"; // Adjust the import path
import { toast } from 'react-toastify'; // For notifications
import Image from 'next/image';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarProvider,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, Settings, User, LogOut, BarChart, Package, Building, Send, ChevronRight, Bell, Calendar } from "lucide-react"; // Import icons
import logoPng from "@/public/images/logo.png";

// Define a User type based on your application structure
type User = {
    email?: string;
};


type UserType = {
    id: string;
    created_at: string; // Use 'string' to represent timestamps in ISO format
    updated_at: string; // Same as above
    full_name: string;
    ic_number: string;
    telephone_number: string;
    email: string;
    role: string;
    organization_name: string;
    registration_number: string;
    bank_account: string;
    org_address: string;
    website: string;
    registration_cert?: string;
    home_address: string;
    income_statement?: string;
    medical_report?: string;
  };
  
const DashboardPage = () => {
    const [user, setUser] = useState<User | null>(null);  // Initialize user state with type User or null
    const storedUserData = sessionStorage.getItem('user');
    let userData: UserType | null = null;
    if(storedUserData) {
        userData= JSON.parse(storedUserData);
        console.log("Session Storage: ", userData)
    } else {
        console.log('No user data found in session storage');
    }
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const currentUser: User | null = await getUser();
            if (!currentUser) {
                toast.error('User not found! Redirecting to login...', {
                    autoClose: 1350,
                });
                router.push('/auth/login'); // Redirect to login if no user is found
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

    // const handleTest = async () => {
        // console.log("Show the session storage: ", user); 
    // }

    return (
        <div className="h-screen flex">
            <SidebarProvider>
                <Sidebar className="w-64 border-r">
                    <SidebarHeader className="flex flex-col items-center justify-center w-full bg-[#0077B6] p-4 pb-2">
                        <Image
                          src={logoPng}
                          alt="Care4Poverty logo"
                          className="w-36"
                        />
                        <Avatar className="h-24 w-24">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <h2 className="font-giorgio text-2xl text-white font-bold tracking-wide">{userData?.organization_name}</h2>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarGroup className='bg-[#0077B6]'>
                            <h4 className="font-roboto text-[#D2D2D2] text-xsm mx-2">Account</h4>
                            <button className="flex items-center justify-between gap-2 w-full p-2 text-white hover:bg-[#038BD4] rounded-lg">
                                <div className="flex items-center gap-2">
                                    <User size={18} />
                                    <span className="font-roboto text-sm">Profile</span>
                                </div>
                                <ChevronRight size={18}/>
                            </button>
                            <button className="flex items-center justify-between w-full p-2 text-white hover:bg-[#038BD4] rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Building size={18} />
                                    <span className="font-roboto text-sm">Organization</span>
                                </div>
                                <ChevronRight size={18} />
                            </button>
                            <h4 className="font-roboto text-[#D2D2D2] text-xsm mt-5 mx-2">Home</h4>
                            <button className="flex items-center justify-between w-full p-2 text-white hover:bg-[#038BD4] rounded-lg">
                                <div className="flex items-center gap-2">
                                    <BarChart size={18} />
                                    <span className="font-roboto text-sm">Dashboard</span>
                                </div>
                                <ChevronRight size={18} />
                            </button>
                            <button className="flex items-center justify-between w-full p-2 text-white hover:bg-[#038BD4] rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Send size={18} />
                                    <span className="font-roboto text-sm">Request</span>
                                </div>
                                <ChevronRight size={18} />
                            </button>
                            <button className="flex items-center justify-between w-full p-2 text-white hover:bg-[#038BD4] rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Package size={18} />
                                    <span className="font-roboto text-sm">Resource</span>
                                </div>
                                <ChevronRight size={18} />
                            </button>
                            <button className="flex items-center justify-between w-full p-2 text-white hover:bg-[#038BD4] rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Bell size={18} />
                                    <span className="font-roboto text-sm">Notification</span>
                                </div>
                                <ChevronRight size={18} />
                            </button>
                            <button className="flex items-center justify-between w-full p-2 text-white hover:bg-[#038BD4] rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Calendar size={18} />
                                    <span className="font-roboto text-sm">Event</span>
                                </div>
                                <ChevronRight size={18} />
                            </button>
                        </SidebarGroup>
                    </SidebarContent>
                    <SidebarFooter className="bg-[#0077B6] p-4">
                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full p-2 text-white hover:bg-[#038BD4] rounded-lg"
                        >
                            <LogOut size={20} />
                            <span className="font-roboto text-sm">Logout</span>
                        </button>
                    </SidebarFooter>
                </Sidebar>
            </SidebarProvider>

            {/* Main Content */}
            <main className="bg-blue-200 w-full flex-1 p-8 flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold">Welcome</h1>
                {user ? (
                    <div className="mt-4">
                        <p>Welcome, {user.email}!</p>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </main>
        </div>
    );
}

export default DashboardPage;
