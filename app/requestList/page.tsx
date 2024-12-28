"use client"; // Ensure this is a client component

import { useEffect, useState } from 'react';
import SideBarComponent from "@/components/dashboard/sideBar"; // Adjust the import path
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation'; // For redirection
import { UserType } from  "@/datatypes/types";
import { getUser, signOut } from '../../lib/authFactory'; // Adjust the import path
import { toast } from 'react-toastify'; // For notifications
import { getRecordById, getRecordsByField } from '@/lib/supabaseAPI';
import { Pencil, Printer, Download } from "lucide-react";
import { FaRegFilePdf } from "react-icons/fa6";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import "app/globals.css"
import html2canvas from "html2canvas";
import jsPDF from "jspdf";


type RequestType = {
    request_id: string;
    organization_id?: string;
    beneficiary_name: string;
    item_name: string;
    item_category: string;
    item_no: number;
    request_date: string;
    status: string;
}

  
const RequestPage = () => {
    const [userData, setUserData] = useState<UserType | null>(null);
    const [availableInventory, setAvailableInventory] = useState<Record<string, number>>({});
    const [requestData, setRequestData] = useState<RequestType[] | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    
    // Used for storing the search input
    const [searchQuery, setSearchQuery] = useState('');

    // Function to handle search input change
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    // Filtered request data based on search query
    const filteredRequestData = requestData?.filter((request) => {
        return (
            request.request_date.toLowerCase().includes(searchQuery.toLowerCase()) ||
            request.beneficiary_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            request.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            request.item_category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            request.item_no.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
            request.status.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }) || []; // Return an empty array if requestData is null

    // Function to compute statistics
    const computeStatistics = (requestData: RequestType[], availableInventory: Record<string, number>) => {
        // Check if requestData is valid
        if (!Array.isArray(requestData) || requestData.length === 0) {
            return {
                mostPreferredItem: null,
                mostPreferredItemCount: 0,
                leastPreferredItem: null,
                leastPreferredItemCount: 0,
                lackingItems: [],
                mostFrequentUser: null,
                mostFrequentUserCount: 0,
                leastFrequentUser: null,
                leastFrequentUserCount: 0,
            };
        }

        // 1. Count occurrences of each item
        const itemCounts = requestData.reduce((acc, request) => {
            if (request.item_name) {
                acc[request.item_name] = (acc[request.item_name] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

        // 2. Most preferred item
        const mostPreferredItem = Object.keys(itemCounts).length > 0 
            ? Object.keys(itemCounts).reduce((a, b) => itemCounts[a] > itemCounts[b] ? a : b) 
            : null;
        const mostPreferredItemCount = mostPreferredItem ? itemCounts[mostPreferredItem] : 0;

        // 3. Least preferred item
        const leastPreferredItem = Object.keys(itemCounts).length > 0 
            ? Object.keys(itemCounts).reduce((a, b) => itemCounts[a] < itemCounts[b] ? a : b) 
            : null;
        const leastPreferredItemCount = leastPreferredItem ? itemCounts[leastPreferredItem] : 0;

        // 4. Lacking items
        const lackingItems = Object.keys(itemCounts).map(item => {
            const requestedCount = itemCounts[item];
            const availableCount = availableInventory[item] || 0; // Get available count from inventory
            const lackingCount = requestedCount > availableCount ? requestedCount - availableCount : 0;
    
            return {
                name: item,
                available: `${availableCount}/${requestedCount}`, // Format as x/y
                lacking: lackingCount > 0 ? lackingCount : null // Only include if lacking
            };
        }).filter(item => item.lacking !== null); // Filter out items that are not lacking

        // 5. Count occurrences of each user
        const userRequests = requestData.reduce((acc, request) => {
            if (request.beneficiary_name) {
                acc[request.beneficiary_name] = (acc[request.beneficiary_name] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

        // 6. Most frequently requested user
        const mostFrequentUser = Object.keys(userRequests).length > 0 
            ? Object.keys(userRequests).reduce((a, b) => userRequests[a] > userRequests[b] ? a : b) 
            : null;
        const mostFrequentUserCount = mostFrequentUser ? userRequests[mostFrequentUser] : 0;

        // 7. Least frequently requested user
        const leastFrequentUser = Object.keys(userRequests).length > 0 
            ? Object.keys(userRequests).reduce((a, b) => userRequests[a] < userRequests[b] ? a : b) 
            : null;
        const leastFrequentUserCount = leastFrequentUser ? userRequests[leastFrequentUser] : 0;

        return {
            mostPreferredItem,
            mostPreferredItemCount,
            leastPreferredItem,
            leastPreferredItemCount,
            lackingItems,
            mostFrequentUser,
            mostFrequentUserCount,
            leastFrequentUser,
            leastFrequentUserCount,
        };
    };
    // Compute statistics once data is fetched
    const statistics = computeStatistics(requestData || [], availableInventory);

    // Function to export the table to PDF
    const exportToPDF = async () => {
        const tableElement = document.querySelector(".requestScrollBar");
        if (tableElement) {
          const canvas = await html2canvas(tableElement as HTMLElement, {
              useCORS: true, // Enable CORS to load external images
          });
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4");
          const pageWidth = pdf.internal.pageSize.getWidth();
        //   const pageHeight = pdf.internal.pageSize.getHeight();
          const imgWidth = pageWidth;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
          pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
          pdf.save("table.pdf");
        } else {
          console.error("Table element not found.");
        }
      };
    
      // Function to trigger print
      const printTable = () => {
          const printContent = document.querySelector(".requestScrollBar");
          if (printContent) {
            const printWindow = window.open("", "_blank");
            if (printWindow) {
              printWindow.document.write(`
                <html>
                  <head>
                    <title>Print Table</title>
                    <link rel="stylesheet" type="text/css" href="app/globals.css">
                    <style>
                      /* General Reset for Printing */
                      body, html {
                        margin: 0;
                        padding: 0;
                        font-family: Arial, sans-serif;
                        color: #000;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                      }
                      table {
                        border-collapse: collapse;
                        width: 100%;
                        margin: 0 auto;
                        font-size: 14px;
                      }
                      th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                      }
                      th {
                        background-color: #f4f4f4;
                        font-weight: bold;
                      }
                      .hidden-on-print {
                        display: none !important;
                      }
                      @media print {
                        .no-break {
                          page-break-inside: avoid;
                        }
                        .page-break {
                          page-break-before: always;
                        }
                      }
                    </style>
                  </head>
                  <body>
                    ${printContent.outerHTML}
                  </body>
                </html>
              `);
              printWindow.document.close();
              printWindow.print();
            }
          } else {
            console.error("Print content not found.");
          }
        };
  
    
      // Function to download the table as CSV
      const downloadCSV = () => {
        const rows = document.querySelectorAll(".requestScrollBar table tr");
        if (rows) {
          const csvContent = Array.from(rows)
            .map((row) => {
              const cells = row.querySelectorAll("th, td");
              return Array.from(cells)
                .map((cell) => `"${cell.textContent?.trim() || ""}"`)
                .join(",");
            })
            .join("\n");
    
          const blob = new Blob([csvContent], { type: "text/csv" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "table.csv";
          link.click();
        } else {
          console.error("Table rows not found.");
        }
      };

    useEffect(() => {        
        const fetchUser = async () => {
            const currentUser: User | null = await getUser();
            // console.log("Current User: ", currentUser);
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
                fetchRequestResourceData(currentUser.id);
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

        const fetchRequestResourceData = async(userId: string) => {
            setLoading(true);
            if (!userId) return;
            const { data: requestData, error: fetchError } = await getRecordsByField('request','organization_id', userId);
            const { data: resourceData, error: fetchResourceError } = await getRecordsByField('resources','organization_id', userId);
            console.log("Request Data: ", requestData);
            if (fetchError) {
                console.error('Error fetching request data:', fetchError.message);
                return;
            } else if (fetchResourceError) {
                console.error('Error fetching resource data:', fetchResourceError.message);
                return;
            }
            if (requestData) {
                sessionStorage.setItem('request', JSON.stringify(requestData)); // Store request data
                // sessionStorage.setItem('resource', JSON.stringify(resourceData)); // Store resource data
                setRequestData(requestData); // Set request data in state
                console.log('Request data stored in session storage:', requestData);
            } else {
                console.error("Request data is undefined.");
            } 
            if (resourceData) {
                const formattedInventory = resourceData.reduce((acc, item) => {
                    acc[item.name] = item.availableCount; // Adjust 'availableCount' to the correct property name
                    return acc;
                }, {} as Record<string, number>);

                setAvailableInventory(formattedInventory); // Set resource data in state
                console.log('Resource data in useState variable: ', formattedInventory);
            }
            setLoading(false)
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
            <SideBarComponent 
                userData={userData || undefined}
                onLogout={handleLogout}
            />

            {/* Main Content */}
            {/* bg-blue-200 */}
            <main className="w-screen flex flex-col mt-8 mx-8 sm:mx-8 md:ml-16 md:mr-10">
                <div className="flex items-center gap-2">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem className="font-bold text-black">Request</BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                {/* Title */}
                <div className="mt-7 mb-7">
                    <h1 className="font-giorgio font-bold text-4xl sm:text-5xl md:text-6xl">My Request</h1>
                   
                    {/* For listing the request */}
                    {/* <ResourceList loading={loading} resources={resources} />*/}
                    {/* <Tabs defaultValue="account" className="mt-12 w-[400px]"> */}
                    <Tabs defaultValue="request-list" className="mt-12 w-full">
                      
                      {/* Tab Header */}
                      <div className="flex w-full">
                        {/* TabList */}
                        <TabsList className="p-0 grid grid-cols-2 w-full max-w-[260px] rounded-b-none rounded-r-none bg-[#0077B6]">
                          <TabsTrigger className="h-full data-[state=active]:bg-[#038BD4] rounded-b-none rounded-r-none data-[state=active]:font-medium data-[state=active]:text-white data-[state=active]:rounded-tl-lg font-roboto font-normal text-white" 
                                       value="request-list">Request List</TabsTrigger>
                          <TabsTrigger className="h-full data-[state=active]:bg-[#038BD4] rounded-r-none rounded-l-none data-[state=active]:font-medium data-[state=active]:text-white font-roboto font-normal text-white" 
                                       value="analysis">Analysis</TabsTrigger>
                        </TabsList>
                        {/* Search Bar */}
                        <div className="flex w-full">
                          <Input
                            autoComplete="off"
                            placeholder="Search"
                            className="rounded-none text-[#7D7D7D] placeholder:hover:text-[#0C8CE9] placeholder:focus:text-[#F5F9FE] text-sm mr-[0px] ml-[0px] bg-[#F5F9FE] border-2 border-custom-border-blue  transition-all duration-150 ease-in-out px-4 bg-[#F5F9FE] focus:text-black hover:border-[#0C8CE9]"
                            value={searchQuery}
                            onChange={handleSearchChange} // Update state on input change
                          />
                          <div className="flex">
                              <Button 
                                className="w-[10px] bg-[#F5F9FE] hover:bg-[#038BD4] border rounded-none border-custom-border-blue border-2 mr-[-2px] group border-l-0" 
                                onClick={() => {
                                        console.log('Save as PDF')
                                        exportToPDF();
                                        }}>
                                    <div className="text-[#5D7EAE] hover:text-[#F5F9FE] group-hover:text-[#F5F9FE]"><FaRegFilePdf/></div>      
                                    
                              </Button>
                              <Button className="w-[10px] bg-[#F5F9FE] hover:bg-[#038BD4] border rounded-none border-custom-border-blue border-2 mr-[-2px] group" 
                                onClick={() => {
                                        console.log('Print')
                                        printTable();
                                        }}>
                                    <div className="text-[#5D7EAE] hover:text-[#F5F9FE] group-hover:text-[#F5F9FE]"><Printer/></div>      
                              </Button>
                              <Button className="w-[10px] bg-[#F5F9FE] hover:bg-[#038BD4] border rounded-l-none rounded-br-none border-custom-border-blue border-2 group" 
                                onClick={() => {
                                        console.log('Download')
                                        downloadCSV();
                                        }}>
                                    <div className="text-[#5D7EAE] hover:text-[#F5F9FE] group-hover:text-[#F5F9FE]"><Download/></div>      
                              </Button>
                          </div>
                        </div>
                      </div>

                    <TabsContent className="mt-0 w-full" value="request-list">
                        <Card className="rounded-none border-t-custom-border-blue mt-[-1px] bg-white">
                            <CardContent className="space-y-4">

                                {/* Table */}
                                <div className="max-h-[600px] requestScrollBar">
                                <table className="min-w-full bg-white border-2 border-custom-border-blue border-t-0 border-r-0 mt-[0px]">
                                    <thead className="sticky top-0">
                                        <tr className="text-sm text-[#5D7EAE] bg-[#E9F4FF] border-b border-slate-200">
                                            <th className="py-3 w-[125px] border-r">Date</th>
                                            <th className="py-3 w-[124px] border-r">Beneficiary</th>
                                            <th className="py-3 w-[200px] border-r">Item Name</th>
                                            <th className="py-3 w-[200px] border-r">Item Category</th>
                                            <th className="py-3 w-[200px] border-r">Item No</th>
                                            <th className="py-3 w-[200px] border-r">Status</th>
                                            {/* This is the edit column */}
                                            <th className="py-3 w-[32px] border-r"></th>
                                            {/* <th className="py-3 border-r"> </th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                      {loading ? (
                                        // Skeleton loader when data is being fetched
                                        Array.from({ length: 5 }).map((_, index) => (
                                          <tr
                                            key={index}
                                            className="animate-pulse text-sm text-center border-b border-slate-200g"
                                          >
                                            <td className="py-3 border-r">
                                              <div className="h-4 bg-slate-200 rounded w-[96px] mx-auto"></div>
                                            </td>
                                            <td className="py-3 border-r">
                                              <div className="h-4 bg-slate-200 rounded w-[107px] mx-auto"></div>
                                            </td>
                                            <td className="py-3 px-3 border-r">
                                              <div className="h-4 bg-slate-200 rounded w-[80px] mx-auto"></div>
                                            </td>
                                            <td className="py-3 px-4 border-r">
                                              <div className="h-4 bg-slate-200 rounded w-[98px] mx-auto"></div>
                                            </td>
                                            <td className="py-3 px-3 border-r">
                                              <div className="h-4 bg-slate-200 rounded w-[62px] mx-auto"></div>
                                            </td>
                                            <td className="py-3 px-4 border-r">
                                              <div className="h-6 bg-slate-200 rounded w-[92px] mx-auto"></div>
                                            </td>
                                            <th className="py-3">
                                              <div className="h-6 bg-slate-200 rounded w-8 mx-auto"></div>
                                            </th>
                                          </tr>
                                        ))
                                      ) : filteredRequestData.length > 0 ? (
                                        // Render filtered data rows when available
                                        filteredRequestData.map((request, index) => (
                                          <tr
                                            key={index}
                                            className="text-sm text-center border-b border-slate-200 hover:bg-slate-50"
                                          >
                                            <td className="py-3 px-3 border-r">
                                              {new Date(request.request_date).toISOString().split("T")[0]}
                                            </td>
                                            <td className="py-3 px-1 border-r">{request.beneficiary_name}</td>
                                            <td className="py-3 px-4 border-r">{request.item_name}</td>
                                            <td className="py-3 px-4 border-r">{request.item_category}</td>
                                            <td className="py-3 px-4 border-r">{request.item_no}</td>
                                            <td className="py-3 px-4 border-r">
                                              <Button
                                                className={`px-5 ${
                                                  request.status === "Pending"
                                                    ? "bg-[#E4C463] hover:bg-[#f4cf62]"
                                                    : "bg-[#4EA79C] hover:bg-[#5bbbb0]"
                                                }`}
                                              >
                                                {request.status}
                                              </Button>
                                            </td>
                                            {/* EDIT BUTTON */}
                                            <th className="py-3">
                                              <Button className="w-1 p-4 bg-[#0077B6] hover:bg-[#038BD4]">
                                                <Pencil />
                                              </Button>
                                            </th>
                                          </tr>
                                        ))
                                      ) : (
                                        // Fallback for no data available
                                        <tr>
                                          <td colSpan={7} className="text-center py-3">
                                            No requests available.
                                          </td>
                                        </tr>
                                      )}
                                    </tbody>
                                </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent className="mt-0 w-full" value="analysis">
                        <Card className="rounded-t-none rounded-b-lg border-2 border-custom-border-blue border-t-0">
                            {/* <CardHeader>
                                <CardTitle className=" font-semibold">Request Analysis Summary</CardTitle>
                            </CardHeader> */}
                            <CardContent className="space-y-4">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white border-t-0 border-r-0 mt-[0px]">
                                        <thead className="sticky top-0">
                                            <tr className="text-sm text-[#5D7EAE] bg-[#E9F4FF] border-b border-slate-200">
                                                <th className="py-3 px-4 text-left border-r font-roboto">Metric</th>
                                                <th className="py-3 px-4 text-left border-r font-roboto">Description</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm font-roboto">
                                            <tr className="hover:bg-gray-50 border-b">
                                                <td className="py-3 px-4 border-r ">Most Preferred Item</td>
                                                <td className="py-3 px-4 border-r">{statistics.mostPreferredItem || "None"} (Requests: {statistics.mostPreferredItemCount || 0})</td>
                                            </tr>
                                            <tr className="hover:bg-gray-50  border-b">
                                                <td className="py-3 px-4 border-r">Least Preferred Item</td>
                                                <td className="py-3 px-4 border-r">{statistics.leastPreferredItem || "None"} (Requests: {statistics.leastPreferredItemCount || 0})</td>
                                            </tr>
                                            <tr className="hover:bg-gray-50 border-b">
                                                <td className="py-3 px-4 border-r">Lacking Items</td>
                                                <td className="py-3 px-4 border-r">{statistics.lackingItems.length > 0 ? statistics.lackingItems.map(item => `${item.name} (Available: ${item.available})`).join(", ") : "None"}</td>
                                            </tr>
                                            <tr className="hover:bg-gray-50 border-b">
                                                <td className="py-3 px-4 border-r">Most Frequently Requested User</td>
                                                <td className="py-3 px-4 border-r">{statistics.mostFrequentUser || "None"} (Requests: {statistics.mostFrequentUserCount || 0})</td>
                                            </tr>
                                            <tr className="hover:bg-gray-50 border-b">
                                                <td className="py-3 px-4 border-r">Least Frequently Requested User</td>
                                                <td className="py-3 px-4 border-r">{statistics.leastFrequentUser || "None"} (Requests: {statistics.leastFrequentUserCount || 0})</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
}

export default RequestPage;
