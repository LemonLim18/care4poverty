"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserType } from '@/datatypes/types';
import { createRecord, getRecordById, getRecordsByField } from '@/lib/supabaseAPI';
import SideBarComponent from '@/components/dashboard/sideBar';
import { toast } from 'react-toastify';
import { getUser, signOut } from '@/lib/authFactory';
import { User } from '@supabase/supabase-js';
import { Breadcrumb, BreadcrumbLink, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { FaAppleAlt, FaTshirt } from 'react-icons/fa';
import { FaPlus } from "react-icons/fa6";
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Minus, CirclePlus, Trash, Trash2 } from "lucide-react";
import { NumberValueToken } from 'html2canvas/dist/types/css/syntax/tokenizer';

interface RequestResource {
    // organization_id: string;
    resource_name: string;
    resource_category: string;
    resource_amount: number;
    request_amount: number;
}

interface RequestResponseProps {
    items: RequestResource[];
    deliveryMethod: string;
    pickupLocation?: string;
    termsAgreed: boolean;
    remarks?: string;
}

const RequestPage = () => {
    const searchParams = useSearchParams();
    const charityId = searchParams.get('id');
    const [userData, setUserData] = useState<UserType | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [charityData, setCharityData] = useState<UserType | null>(null);
    const router = useRouter();

    // Local Use
    const [isTermsAgreed, setIsTermsAgreed] = useState(false);
    const [requestResources, setRequestResources] = useState<RequestResource[]>([]);
    const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<string | null>(null);
    const [pickupLocation, setPickupLocation] = useState('');
    const [isFooterShadowVisible, setIsFooterShadowVisible] = useState(false);
    // const [donationResponse, setDonationResponse] = useState<DonationResponseProps | null>(null);

    // Color arrays for cycling
    const foodBgColors = ['bg-red-500', 'bg-blue-500', 'bg-yellow-500'];
    const foodTxtColors = ['text-black', 'text-black', 'text-yellow-700'];
    const foodOutlines = ['outline-red-700', 'outline-blue-700', 'outline-yellow-700'];
    const wearableBgColors = ['bg-purple-500', 'bg-green-500', 'bg-orange-500'];
    const wearableTxtColors = ['outline-purple-700', 'outline-green-700', 'outline-orange-700'];
    const wearableOutlines = ['outline-purple-700', 'outline-green-700', 'outline-orange-700'];

    const colorIndex=0;

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            // Check if the user is near the bottom
            const isAtBottom = scrollTop + windowHeight >= documentHeight - 10;

            setIsFooterShadowVisible(!isAtBottom);
        };

        window.addEventListener('scroll', handleScroll);

        // Cleanup the event listener
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        // Fetch for the breadcrumb name
        const fetchCharityData = async () => {
            if (charityId) {
                const {data: charityFetchData, error} = await getRecordById('users', charityId);
                const {data: availableFetchResource, error: resourceError} = await getRecordsByField('resources', 'organization_id', charityId);
                if (error) {
                    console.error("Error fetching charity data:", error);
                    return; // Handle error appropriately
                }
                if (resourceError) {
                    console.error("Error fetching resource data:", resourceError);
                    return; // Handle error appropriately
                }
                // console.log("Charity Data: ", charityFetchData);
                console.log("Available Fetch Resources: ", availableFetchResource);
                setCharityData(charityFetchData);

                // const availableResources = availableFetchResource || [];
                const requestFetchResources = availableFetchResource?.map(resource => ({
                    // organization_id: resource.organization_id, // Spread the existing properties of the object
                    resource_name: resource.resource_name,
                    resource_category: resource.resource_category,
                    resource_amount: resource.resource_amount,
                    request_amount: 0, // Add the new key with a value of 0
                })) || [];
                console.log("Request Fetch Resources: ", requestFetchResources);
                setRequestResources(requestFetchResources); // Ensure it's not undefined
            }
        };
        fetchCharityData();
    }, [charityId]);

    useEffect(() => {
        console.log("Request Resources: ", requestResources);
    }, [requestResources]); 

    useEffect(() => {
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
            console.log("Current User: ", currentUser?.id);
            const storedUserData = sessionStorage.getItem('user');
            // console.log("Stored User Data: ", storedUserData);
            if (storedUserData && storedUserData !== "null" && storedUserData !== "undefined") {
                const parsedUserData = JSON.parse(storedUserData);
                setUserData(parsedUserData);
                // console.log("User Session Storage: ", parsedUserData);
            } else {
                try {
                    
                    const { data: userFetchData, error: fetchError } = await getRecordById('users', currentUser?.id || '');
                    if (fetchError) {
                        console.error('Error fetching user data:', fetchError.message);
                        return;
                    }
                    setUserData(userFetchData || null);
                    sessionStorage.setItem('user', JSON.stringify(userData));
                    console.log('User Data fetched from server:', userFetchData);
                } catch (error) {
                    console.error('Unexpected error fetching user data:', error);
                }
            }
        };

        fetchUser();
    },[]);

    const handleLogout = async () => {
        await signOut();
        toast.success('Successfully logged out!', {
            autoClose: 1250, // Toast will disappear after 1500s
        });
        setTimeout(() => {
            router.push('/auth/login'); // Redirect to login page after logout
        }, 1000);
    };

    // handleResourceChange function to update the resource amount
    const handleResourceChange = (index: number, field: keyof RequestResource, value: string | number) => {
        const updatedResources = [...requestResources];
        
        // Ensure the value is correctly typed based on the field
        if (field === 'request_amount' || field === 'resource_amount') {
            updatedResources[index][field] = value as number; // Cast to number for quantity
        } else {
            updatedResources[index][field] = value as string; // Cast to string for name and category
        }

        setRequestResources(updatedResources);
    };

    // const deleteResource = (index: number) => {
    //     if (index === 0) return; // Prevent deletion of the first resource
    //     const updatedResources = requestResources.filter((_, i) => i !== index);
    //     setRequestResources(updatedResources);
    // };

    const handleDeliveryMethodChange = (method: string) => {
        setSelectedDeliveryMethod(method === selectedDeliveryMethod ? null : method);
        if (method === 'dropOff') {
            setPickupLocation('');
        }
    };

    if (!charityId) {
        return <div>Charity ID not found in the URL!</div>;
    }

    const handleReturn = () => {
        router.push(`/centers?id=${charityId}`);
    }

    const handleSubmit = async() => {
        if(!isTermsAgreed) {
            toast.error('Please agree to the terms and conditions before submitting.', {autoClose: 1500});
            return;
        }
        if(requestResources.length === 0 || requestResources[0].request_amount === 0 || requestResources[0].resource_name === '' || requestResources[0].resource_category === '') {
            toast.error('Please add at least one item to request.', {autoClose: 1500});
            return;
        }

        const recipientName = charityData?.full_name;
        console.log("Recipient Name: ", recipientName);

        const requestData = {
            organization_id: charityId,
            beneficiary_name: recipientName,
            request_items: requestResources,
            delivery_method: selectedDeliveryMethod,
            pickup_location: pickupLocation,
            terms_agreed: isTermsAgreed,
            status: 'pending',
            request_date: new Date().toISOString().split('T')[0], // Extract only the date part
        };

        console.log("Request Data: ", requestData);

        // Insert the new donation into Supabase
        const { data: RequestResponse, error } = await createRecord('request', requestData);
        if(error) {
            console.error('Error inserting donation:', error);
            toast.error('Failed to request donation. Please try again.', {autoClose: 1500});
        } else {
            toast.success('Request submitted successfully!', {autoClose: 1500});
            console.log('Request submitted:', RequestResponse);
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
    }


    return (
        <div className="h-full flex">
            <SideBarComponent 
                userData={userData || undefined}
                onLogout={handleLogout}
            />

            <main className="w-screen h-screen flex flex-col pt-8 pb-16 mx-8 sm:mx-8 md:ml-16 md:mr-10">
                <div className="flex items-center gap-2">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/request">Request</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href={`/centers?id=${charityId}`}>{charityData?.organization_name}</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink className="font-bold text-black">Item</BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                
                <div className="mt-7 mb-7 h-full w-full">
                    <h1 className="font-giorgio font-bold text-4xl sm:text-5xl md:text-6xl">{charityData?.organization_name}</h1>
                    <section className="mt-6 flex flex-col lg:flex-row flex-6 ">
                        {/* Items to be requested + Quantity */}
                        <div className="flex gap-x-3 h-full w-full lg:w-[60%]">
                            
                            {/* First Column */}
                            <div className="flex flex-col w-full">
                                <p className="font-bold">Items to be Requested</p>
                                {requestResources.map((resource, index) => (
                                    <div key={index} className={`mt-2 flex w-full items-center justify-between p-4 bg-white border shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl`}>
                                        <div className="flex items-center space-x-4">
                                            <div className={`flex items-center justify-center w-12 h-12  rounded-full ${resource.resource_category === "Foods"? `${foodTxtColors[index % foodTxtColors.length]} ${foodBgColors[index % foodBgColors.length]} ${foodOutlines[index % foodOutlines.length]}` : resource.resource_category === "Wearable Items"? `${wearableTxtColors[index % wearableTxtColors.length]} ${wearableOutlines[index % wearableOutlines.length]} ${wearableBgColors[index % wearableBgColors.length] }` : 'bg-blue-100'}`}>
                                                {resource.resource_category === 'Foods' ? (
                                                    <FaAppleAlt className={` w-12 h-6`} />
                                                ) : resource.resource_category === 'Wearable Items' ? (
                                                    <FaTshirt className={` w-12 h-6`} />
                                                ) : (
                                                    <FaPlus className="text-blue-500 w-12 h-6" />
                                                )}
                                            </div>
                                            {/* Name and Category */}
                                            {/* Name and Category */}
                                            <div className="pr-6">
                                                <h3 className="text-md font-semibold text-gray-800">{resource.resource_name}</h3>
                                                <p className="text-sm text-gray-800">Category: {resource.resource_category}</p>
                                                <p className="text-xsm text-gray-500">Available No: {resource.resource_amount}</p>
                                            </div>
                                        </div>
                                        {/* Quantity Column */}
                                        <div className="flex items-center">
                                            <Plus className="text-gray-600 w-5 h-5 hover:scale-125 hover:cursor-pointer" 
                                                onClick={() => {
                                                    if (resource.request_amount < resource.resource_amount) { // Check if request_amount is less than resource_amount
                                                        handleResourceChange(index, 'request_amount', resource.request_amount + 1);
                                                    }
                                                }} 
                                            />
                                            <input
                                                type="number"
                                                value={resource.request_amount}
                                                onChange={(e) => handleResourceChange(index, 'request_amount', Number(e.target.value))}
                                                className="bg-white border border-1 border-gray-400 text-sm rounded-full w-[50px] h-[50px] mt-2 mx-3 pl-3 text-center"
                                                required
                                            />
                                            <Minus className="text-gray-600 w-5 h-5 hover:scale-125 hover:cursor-pointer" 
                                                onClick={() => {
                                                    if (resource.request_amount > 0) { // Prevent going below 0
                                                        handleResourceChange(index, 'request_amount', resource.request_amount - 1);
                                                    }
                                                }} 
                                            />
                                            {/* <Trash className="ml-6 w-5 text-[#da3636] hover:text-[#FF0303] hover:cursor-pointer"/>
                                            <p className="ml-1 hidden [@media(min-width:540px)]:block text-[#FF0303] font-roboto hover:underline hover:cursor-pointer" onClick={() => deleteResource(index)}>Remove</p> */}
                                        </div>
                                    </div>
                                ))}
                                
                            </div>
                            {/* End of First Column */}
                        </div>
                        {/* Third Column */}
                        <div className="mt-8 lg:mt-0 lg:ml-8 lg:w-[40%] h-full">
                            <div className="space-y-2">
                                <p className="font-bold font-small">Preferred Delivery Method</p>
                                <div className="flex space-x-10 lg:flex-col lg:space-x-0 lg:space-y-2">
                                    <label className="mt-1 flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedDeliveryMethod === 'dropOff'}
                                            onChange={() => handleDeliveryMethodChange('dropOff')}
                                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 accent-gray-900"
                                        />
                                        <span className="w-full ml-3 text-sm font-roboto font-light">
                                            Drop-off at the organization
                                        </span>
                                    </label>
                                    <label className="mt-1 flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedDeliveryMethod === 'pickUp'}
                                            onChange={() => handleDeliveryMethodChange('pickUp')}
                                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 accent-gray-900"
                                        />
                                        <span className="w-full ml-3 text-sm font-roboto font-light">
                                            Pick up by the organization
                                        </span>
                                    </label>
                                </div>
                                <Textarea 
                                    disabled={selectedDeliveryMethod === "dropOff"} 
                                    className="mt-2 h-28 rounded-xl" 
                                    placeholder="Please state the pickup location" 
                                    onChange={(e) => setPickupLocation(e.target.value)}  // Receive the user input, send to the useState variable, and display back using the pickupLocation useState variable
                                    value={pickupLocation}
                                />
                            </div>
                            <div className="mb-28">
                                <p className="mt-7 font-bold font-small">Remarks</p>
                                <Textarea className="h-44 rounded-xl" placeholder="Leave any remark" />
                            </div>
                            
                        </div>
                        <footer className={`bg-white fixed w-full md:w-[calc(100%-255px)] z-50 bottom-0 right-0 text-white py-4 pl-16 pr-10 flex justify-between rounded-t-3xl ${isFooterShadowVisible? 'shadow-[0_-2px_4px_rgba(0,0,0,0.1)]' : 'shadow-none' }`}>
                            <div className="w-full text-black">
                                <p className="font-roboto font-bold text-sm md:text-md">Terms & Conditions</p>
                                <label className="mt-1 flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={isTermsAgreed}
                                        onChange={(e) => setIsTermsAgreed(e.target.checked)}    // Capture the action of the user, send it to useState variable, and return back to the check input
                                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 accent-gray-900"
                                    />
                                    <span className="w-full ml-3 text-xsm md:text-sm font-roboto font-light">
                                        I hereby agree to the terms and conditions provided
                                    </span>
                                </label>
                            </div>
                            <button 
                                className="text-black hover:underline hover:border-gray-900
                                 text-xsm md:text-sm lg:text-base py-2 px-4 lg:px-8 lg:py-3 mr-4 md:mr-4 border border-gray-300 rounded-full"
                                onClick={handleReturn}
                            >
                                Back
                            </button>
                            <button 
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xsm md:text-sm lg:text-base py-2 px-4 lg:px-8 lh:py-3 rounded-full"
                                onClick={handleSubmit}
                            >
                                Request
                            </button>
                        </footer>
                    </section>
                </div>
                
            </main>
        </div>
    );
};

export default RequestPage