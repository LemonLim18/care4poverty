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
import { UserType } from  "@/datatypes/types";
import { useRouter } from 'next/navigation';

// type UserType = {
//     id: string;
//     created_at: string; // Use 'string' to represent timestamps in ISO format
//     updated_at: string; // Same as above
//     full_name: string;
//     ic_number: string;
//     telephone_number: string;
//     email: string;
//     role: string;
//     organization_name: string;
//     registration_number: string;
//     bank_account: string;
//     org_address: string;
//     website: string;
//     id_proof: string;
//     profile_picture: string,
//     registration_cert?: string;
//     home_address: string;
//     income_statement?: string;
//     medical_report?: string;
// };

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
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h2 className="font-giorgio text-2xl text-white font-bold tracking-wide">{userData?.organization_name}</h2>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup className='bg-[#0077B6]'>
                        <h4 className="font-roboto text-[#D2D2D2] text-xsm mx-2">Account</h4>
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
                        <button 
                            onClick={() => navigateToPage('/organization')}
                            className="flex items-center justify-between w-full p-2 text-white hover:bg-[#038BD4] rounded-lg"
                        >
                            <div className="flex items-center gap-2">
                                <Building size={18} />
                                <span className="font-roboto text-sm">Organization</span>
                            </div>
                            <ChevronRight size={18} />
                        </button>
                        <h4 className="font-roboto text-[#D2D2D2] text-xsm mt-5 mx-2">Home</h4>
                        <button
                            onClick={() => navigateToPage('/dashboard')}
                            className="flex items-center justify-between w-full p-2 text-white hover:bg-[#038BD4] rounded-lg"
                        >
                            <div className="flex items-center gap-2">
                                <BarChart size={18} />
                                <span className="font-roboto text-sm">Dashboard</span>
                            </div>
                            <ChevronRight size={18} />
                        </button>
                        <button 
                            onClick={() => navigateToPage('/request')}
                            className="flex items-center justify-between w-full p-2 text-white hover:bg-[#038BD4] rounded-lg"
                        >
                            <div className="flex items-center gap-2">
                                <Send size={18} />
                                <span className="font-roboto text-sm">Request</span>
                            </div>
                            <ChevronRight size={18} />
                        </button>
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
                        <button 
                            onClick={() => navigateToPage('/education')}
                            className="flex items-center justify-between w-full p-2 text-white hover:bg-[#038BD4] rounded-lg"
                        >
                            <div className="flex items-center gap-2">
                                <Calendar size={18} />
                                <span className="font-roboto text-sm">Education</span>
                            </div>
                            <ChevronRight size={18} />
                        </button>
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