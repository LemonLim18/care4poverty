'use client';

import { useEffect, useState } from "react";
import SideBarComponent from "@/components/dashboard/sideBar";
import { User } from '@supabase/supabase-js'
import { useRouter } from "next/navigation";
import { UserType } from '@/datatypes/types';
import { getUser, signOut } from '@/lib/authFactory';
import { toast, ToastContainer } from 'react-toastify';
import { Breadcrumb, BreadcrumbSeparator, BreadcrumbLink, BreadcrumbItem, BreadcrumbList } from '@/components/ui/breadcrumb';
import { supabase } from '@/lib/supabaseClient';
import "react-toastify/dist/ReactToastify.css";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye } from 'lucide-react';
import { format } from 'date-fns';


interface Content {
  id: string;
  category: string;
  title: string;
  description: string;
  file_url: string;
  created_at: string;
  user_id: string;
}


const LearnerPage = () => {
    // States
    const [userData, setUserData] = useState<UserType | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [contents, setContents] = useState<Content[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [suggestedContents, setSuggestedContents] = useState<Content[]>([]);


    const router = useRouter();


    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserData = sessionStorage.getItem('user');
            if (storedUserData) {
                setUserData(JSON.parse(storedUserData));
            }
        }


        const fetchUser = async () => {
            const currentUser = await getUser();
            if (!currentUser) {
                toast.error('User not found! Redirecting to login...');
                router.push('/auth/login');
            } else {
                setUser(currentUser);
            }
        };


        fetchUser();
    }, [router]);


    useEffect(() => {
        fetchCategories();
        fetchContents();
    }, []);


    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('name')
                .order('name', { ascending: true });


            if (error) throw error;
            setCategories(data.map(cat => cat.name));
        } catch (error) {
            toast.error('Error fetching categories');
            console.error(error);
        }
    };


    const fetchContents = async () => {
        try {
            const { data, error } = await supabase
                .from('contents')
                .select('*')
                .order('created_at', { ascending: false });


            if (error) throw error;
            const contentData = data || [];
            setContents(contentData);
            // Set first 5 contents as suggested contents
            setSuggestedContents(contentData.slice(0, 5));
        } catch (error) {
            toast.error('Error fetching contents');
            console.error(error);
        }
    };


    const handleViewContent = async (content: Content) => {
        try {
            const { data, error } = await supabase.storage
                .from('donor-files')
                .createSignedUrl(content.file_url, 60);


            if (error) {
                const { data: { publicUrl } } = supabase.storage
                    .from('donor-files')
                    .getPublicUrl(content.file_url);
               
                window.open(publicUrl, '_blank');
                return;
            }


            window.open(data.signedUrl, '_blank');
        } catch (error) {
            console.error('View error:', error);
            toast.error('Error viewing content');
        }
    };


    // Update the filtering logic to be more robust
    const filteredContents = contents.filter(content => {
        const searchTerm = searchQuery.toLowerCase();
        const matchesSearch =
            !searchQuery || // if no search query, show all
            content.title.toLowerCase().includes(searchTerm) ||
            content.description.toLowerCase().includes(searchTerm);
       
        const matchesCategory =
            selectedCategory === "all" || // if "all" is selected, show all
            content.category === selectedCategory;


        return matchesSearch && matchesCategory;
    });


    const handleLogout = async () => {
        await signOut();
        toast.success('Successfully logged out!');
        setTimeout(() => {
            router.push('/auth/login');
        }, 1000);
    };


    return (
        <div className="h-screen flex overflow-hidden">
            <SideBarComponent userData={userData || undefined} onLogout={handleLogout} />


            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header Section - Fixed at top */}
                <div className="p-8 bg-white border-b">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="#">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>Education</BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <h1 className="font-giorgio font-bold text-4xl sm:text-5xl md:text-6xl mt-7">My Education</h1>
                </div>


                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {/* Search and Filter Section */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex gap-4">
                                <Input
                                    placeholder="Search contents..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1"
                                />
                                <Select
                                    value={selectedCategory}
                                    onValueChange={setSelectedCategory}
                                >
                                    <SelectTrigger className="w-[200px]">
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>


                    {/* Suggested Contents Section */}
                    {(searchQuery === "" && selectedCategory === "all") && (
                        <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
                            <CardContent className="p-6">
                                <CardTitle className="mb-4 text-2xl font-bold text-gray-800">Suggested Contents</CardTitle>
                                <div className="flex overflow-x-auto scrollbar-hidden space-x-4 py-4">
                                    {suggestedContents.map((content) => (
                                        <Card key={content.id} className="w-[250px] flex-shrink-0 hover:shadow-xl transition-shadow transform hover:scale-105 rounded-lg border border-gray-200">
                                            <CardContent className="p-4">
                                                <h3 className="font-semibold mb-2 text-lg text-gray-900 truncate">{content.title}</h3>
                                                <p className="text-sm text-gray-600 mb-2">{content.category}</p>
                                                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{content.description}</p>
                                                <button
                                                    onClick={() => handleViewContent(content)}
                                                    className="mt-2 w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                    <Eye className="h-4 w-4 inline-block mr-2" />
                                                    View Content
                                                </button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}


                    {/* All Contents Section */}
                    <Card>
                        <CardContent className="p-6">
                            <CardTitle className="mb-4">
                                {searchQuery || selectedCategory !== "all"
                                    ? 'Search Results'
                                    : 'All Contents'
                                }
                            </CardTitle>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-4 bg-white sticky top-0">Category</th>
                                            <th className="text-left p-4 bg-white sticky top-0">Title</th>
                                            <th className="text-left p-4 bg-white sticky top-0">Created At</th>
                                            <th className="text-left p-4 bg-white sticky top-0">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredContents.map((content) => (
                                            <tr key={content.id} className="border-b">
                                                <td className="p-4">{content.category}</td>
                                                <td className="p-4">{content.title}</td>
                                                <td className="p-4">{format(new Date(content.created_at), 'PPpp')}</td>
                                                <td className="p-4">
                                                    <button
                                                        onClick={() => handleViewContent(content)}
                                                        className="flex items-center text-blue-600 hover:text-blue-800"
                                                    >
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <ToastContainer />
        </div>
    );
};


export default LearnerPage;