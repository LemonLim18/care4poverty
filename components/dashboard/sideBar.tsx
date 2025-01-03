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
import { Archive, Home, LayoutDashboard, Settings, User, LogOut, BarChart, Package, Building, Send, ChevronRight, Bell, Calendar, GraduationCap, ScrollText, HandHeart, HandCoins } from "lucide-react"; // Import icons
import logoPng from "@/public/images/logo.png";
import { UserType } from  "@/datatypes/types";
import { useRouter } from 'next/navigation';
import { ClipLoader } from 'react-spinners';

// Define the prop types
interface SideBarProps {
    userData?: UserType;
    onLogout: () => void;
}

const SideBarComponent: React.FC<SideBarProps> = ({
    userData,
    onLogout,
}) => {
    const router = useRouter();

    const navigateToPage = (path: string) => {
        router.push(path);
    };

    return (
        <SidebarProvider>
            <Sidebar className="w-64 border-r">
                <SidebarHeader className="flex flex-col items-center justify-center w-full bg-[#0077B6] p-4 pb-2">
                    <Image
                      src={logoPng}
                      alt="Care4Poverty logo"
                      className="w-36"
                    />
                    <Avatar className="h-24 w-24">
                        {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                        <AvatarImage src={userData?.profile_picture} />
                        <AvatarFallback><ClipLoader size={25}></ClipLoader></AvatarFallback>
                    </Avatar>
                    <h2 className="font-giorgio text-2xl text-white font-bold tracking-wide">
                        {userData?.role === 'charity-admin' ? userData?.organization_name : userData?.full_name}</h2>
                </SidebarHeader>
                <SidebarContent> 
                    <SidebarGroup className='bg-[#0077B6]'>
                        <h4 className="font-roboto text-[#D2D2D2] text-xsm mx-2">Account</h4>
                        {/* PROFILE */}
                        {(userData?.role === 'donor' || userData?.role === 'beneficiary' || userData?.role === "charity-admin") && (
                        <button 
                            onClick={() => navigateToPage('/profile')}
                            className="flex items-center justify-between gap-2 w-full p-2 text-white hover:bg-[#038BD4] rounded-lg"
                        >
                            <div className="flex items-center gap-2">
                                <User size={18} />
                                <span className="font-roboto text-sm">Profile</span>
                            </div>
                            <ChevronRight size={18}/>
                        </button>
                        )}

                        {/* Dashboard */}
                        {userData?.role === 'charity-admin' && (
                            <button
                                onClick={() => navigateToPage('/dashboard')}
                                className="flex items-center justify-between w-full p-2 text-white hover:bg-[#038BD4] rounded-lg"
                            >
                                <div className="flex items-center gap-2">
                                    <LayoutDashboard size={18} />
                                    <span className="font-roboto text-sm">Dashboard</span>
                                </div>
                                <ChevronRight size={18} />
                            </button>
                        )}

                         {/* Donor Dashboard */}
                        {userData?.role === 'donor' && (
                            <button 
                                onClick={() => navigateToPage('/donorDashboard')}
                                className="flex items-center justify-between w-full p-2 text-white hover:bg-[#038BD4] rounded-lg"
                            >
                                <div className="flex items-center gap-2">
                                    <LayoutDashboard size={18} />
                                    <span className="font-roboto text-sm">Dashboard</span>
                                </div>
                                <ChevronRight size={18} />
                            </button>
                        )}
    
                         {/* Beneficiary Dashboard */}
                        {userData?.role === 'beneficiary' && (
                            <button 
                                onClick={() => navigateToPage('/beneficiaryDashboard')}
                                className="flex items-center justify-between w-full p-2 text-white hover:bg-[#038BD4] rounded-lg"
                            >
                                <div className="flex items-center gap-2">
                                    <LayoutDashboard size={18} />
                                    <span className="font-roboto text-sm">Dashboard</span>
                                </div>
                                <ChevronRight size={18} />
                            </button>
                        )}

                        {/* Section Breaker */}
                        <h4 className="font-roboto text-[#D2D2D2] text-xsm mt-5 mx-2">Home</h4>
                        
                        {/* ADMIN: REQUEST */}
                        {userData?.role === 'charity-admin' && (
                            <button 
                                onClick={() => navigateToPage('/requestList')}
                                className="flex items-center justify-between w-full p-2 text-white hover:bg-[#038BD4] rounded-lg"
                            >
                                <div className="flex items-center gap-2">
                                    <ScrollText size={18} />
                                    <span className="font-roboto text-sm">Request List</span>
                                </div>
                                <ChevronRight size={18} />
                            </button>
                        )}

                        {/* Donate */}
                        {userData?.role === 'donor' && (
                            <button
                                onClick={() => navigateToPage('/donate')}
                                className="flex items-center justify-between w-full p-2 text-white hover:bg-[#038BD4] rounded-lg"
                            >
                                <div className="flex items-center gap-2">
                                    <HandHeart size={18} />
                                    <span className="font-roboto text-sm">Donate</span>
                                </div>
                                <ChevronRight size={18} />
                            </button>
                        )}

                        {/* Request */}
                        {userData?.role === 'beneficiary' && (
                            <button
                                onClick={() => navigateToPage('/request')}
                                className="flex items-center justify-between w-full p-2 text-white hover:bg-[#038BD4] rounded-lg"
                            >
                                <div className="flex items-center gap-2">
                                    <HandCoins size={18} />
                                    <span className="font-roboto text-sm">Request</span>
                                </div>
                                <ChevronRight size={18} />
                            </button>
                        )}

                        {/* ADMIN: RESOURCE */}
                        {userData?.role === 'charity-admin' && (
                            <button 
                                onClick={() => navigateToPage('/resource')}
                                className="flex items-center justify-between w-full p-2 text-white hover:bg-[#038BD4] rounded-lg"
                            >
                                <div className="flex items-center gap-2">
                                    <Package size={18} />
                                    <span className="font-roboto text-sm">Resource</span>
                                </div>
                                <ChevronRight size={18} />
                            </button>
                        )}

                        {/* ADMIN: NOTIFICATION */}
                        {(userData?.role === 'donor' || userData?.role === 'beneficiary' || userData?.role === "charity-admin") && (
                            <button 
                                onClick={() => navigateToPage('/notification')}
                                className="flex items-center justify-between w-full p-2 text-white hover:bg-[#038BD4] rounded-lg"
                            >
                                <div className="flex items-center gap-2">
                                    <Bell size={18} />
                                    <span className="font-roboto text-sm">Notification</span>
                                </div>
                                <ChevronRight size={18} />
                            </button>
                        )}
                        {/* DONOR, REQUESTOR: EVENT */}
                        {(userData?.role === 'donor' || userData?.role === 'beneficiary' || userData?.role === "charity-admin") && (
                            <button 
                                onClick={() => navigateToPage('/event')}
                                className="flex items-center justify-between w-full p-2 text-white hover:bg-[#038BD4] rounded-lg"
                            >
                                <div className="flex items-center gap-2">
                                    <Calendar size={18} />
                                    <span className="font-roboto text-sm">Event</span>
                                </div>
                                <ChevronRight size={18} />
                            </button>
                        )}
                        {/* DONOR, REQUESTOR: EDUCATION */}
                        {(userData?.role === 'donor' || userData?.role === 'beneficiary') && (
                            <button 
                                onClick={() => {
                                    if (userData?.role === 'donor' || userData?.role === 'charity-admin') {
                                        navigateToPage('/education/donor');
                                    } else {
                                        navigateToPage('/education/learner');
                                    }
                                }}
                                className="flex items-center justify-between w-full p-2 text-white hover:bg-[#038BD4] rounded-lg"
                            >
                                <div className="flex items-center gap-2">
                                    <GraduationCap size={18} />
                                    <span className="font-roboto text-sm">Education</span>
                                </div>
                                <ChevronRight size={18} />
                            </button>
                        )}
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter className="bg-[#0077B6] p-4">
                    <button 
                        onClick={onLogout}
                        className="flex items-center gap-2 w-full p-2 text-white hover:bg-[#038BD4] rounded-lg"
                    >
                        <LogOut size={20} />
                        <span className="font-roboto text-sm">Logout</span>
                    </button>
                </SidebarFooter>
            </Sidebar>
        </SidebarProvider>
    );

}


export default SideBarComponent;