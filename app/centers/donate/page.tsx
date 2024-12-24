"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserType } from '@/datatypes/types';
import { createRecord, getRecordById } from '@/lib/supabaseAPI';
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface Resource {
    name: string;
    category: string;
    quantity: number;
}

interface DonationResponseProps {
    items: Resource[];
    deliveryMethod: string;
    pickupLocation?: string;
    termsAgreed: boolean;
    remarks?: string;
}

const DonationPage = () => {
    const searchParams = useSearchParams();
    const charityId = searchParams.get('id');
    const [userData, setUserData] = useState<UserType | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [charityData, setCharityData] = useState<UserType | null>(null);
    const router = useRouter();

    // Local Use
    const [isTermsAgreed, setIsTermsAgreed] = useState(false);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [number, setNumber] = useState(1);
    const [resources, setResources] = useState([{ name: '', category: '', quantity: 1 }]);
    const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<string | null>(null);
    const [pickupLocation, setPickupLocation] = useState('');
    const [isFooterShadowVisible, setIsFooterShadowVisible] = useState(false);
    // const [donationResponse, setDonationResponse] = useState<DonationResponseProps | null>(null);


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
        const fetchCharityData = async () => {
            if (charityId) {
                const {data, error} = await getRecordById('users', charityId);
                if (error) {
                    console.error("Error fetching charity data:", error);
                    return; // Handle error appropriately
                }
                console.log("Charity Data: ", data);
                setCharityData(data);
            }
        };
        fetchCharityData();
    }, [charityId]);

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
            console.log("Stored User Data: ", storedUserData);
            if (storedUserData && storedUserData !== "null" && storedUserData !== "undefined") {
                const parsedUserData = JSON.parse(storedUserData);
                setUserData(parsedUserData);
                console.log("User Session Storage: ", parsedUserData);
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

    const splitIntoSentences = (text: string) => {
        return text.split('.').map((sentence) => {
            const trimmedSentence = sentence.trim();
            return trimmedSentence ? trimmedSentence + '.' : ''; // Add a period only if the sentence is not empty
        }).filter(sentence => sentence !== ''); // Filter out any empty sentences
    };

    const sentences = splitIntoSentences(charityData?.organization_description || '');
    const groupSentences = [];

    for (let i=0; i < sentences.length; i++) {
        groupSentences.push(sentences.slice(i, i+5).join(' '));
    }

    const addResource = () => {
        setResources([...resources, { name: '', category: '', quantity: 1 }]);
    };

    const handleResourceChange = (index: number, field: keyof Resource, value: string | number) => {
        const updatedResources = [...resources];
        
        // Ensure the value is correctly typed based on the field
        if (field === 'quantity') {
            updatedResources[index][field] = value as number; // Cast to number for quantity
        } else {
            updatedResources[index][field] = value as string; // Cast to string for name and category
        }

        setResources(updatedResources);
    };

    const deleteResource = (index: number) => {
        if (index === 0) return; // Prevent deletion of the first resource
        const updatedResources = resources.filter((_, i) => i !== index);
        setResources(updatedResources);
    };

    const handleDeliveryMethodChange = (method: string) => {
        setSelectedDeliveryMethod(method === selectedDeliveryMethod ? null : method);
        if (method === 'dropOff') {
            setPickupLocation('');
        }
    };

    if (!charityId) {
        return <div>Charity ID not found in the URL!</div>;
    }

    const handleSubmit = async() => {
        if(!isTermsAgreed) {
            toast.error('Please agree to the terms and conditions before submitting.', {autoClose: 1500});
            return;
        }
        if(resources.length === 0 || resources[0].quantity === 0 || resources[0].name === '' || resources[0].category === '') {
            toast.error('Please add at least one item to donate.', {autoClose: 1500});
            return;
        }

        const donationData = {
            org_id: charityId,
            donation_items: resources,
            delivery_method: selectedDeliveryMethod,
            pickup_location: pickupLocation,
            terms_agreed: isTermsAgreed,
            donation_created: new Date().toISOString().split('T')[0], // Extract only the date part
        };

        // Insert the new donation into Supabase
        const { data: DonationResponse, error } = await createRecord('donation', donationData);
        if(error) {
            console.error('Error inserting donation:', error);
            toast.error('Failed to submit donation. Please try again.', {autoClose: 1500});
        } else {
            toast.success('Donation submitted successfully!', {autoClose: 1500});
            console.log('Donation submitted:', DonationResponse);
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
                                <BreadcrumbLink href="/donate">Donate</BreadcrumbLink>
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
                
                <div className="mt-7 mb-7 h-full">
                    <h1 className="font-giorgio font-bold text-4xl sm:text-5xl md:text-6xl">{charityData?.organization_name}</h1>
                    <section className="mt-6 flex flex-col lg:flex-row flex-6 ">
                        {/* Items to be donated + Quantity */}
                        <div className="flex gap-x-3 h-full">
                            
                            {/* First Column */}
                            <div className="flex flex-col">
                                <p className="font-bold">Items to be donated</p>
                                {resources.map((resource, index) => (
                                    <div key={index} className={`mt-2 flex items-center justify-between p-4 bg-white border shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl`}>
                                        <div className="flex items-center space-x-4">
                                            <div className={`flex items-center justify-center w-12 h-12 rounded-full ${resource.category === "Foods"? 'bg-green-500' : resource.category === "Wearable Items"? 'bg-orange-500' : 'bg-blue-100'}`}>
                                                {resource.category === 'Foods' ? (
                                                    <FaAppleAlt className="text-green-800 w-12 h-6" />
                                                ) : resource.category === 'Wearable Items' ? (
                                                    <FaTshirt className="text-orange-800 w-12 h-6" />
                                                ) : (
                                                    <FaPlus className="text-blue-500 w-12 h-6" />
                                                )}
                                            </div>
                                            {/* Name and Category */}
                                            <div className="pr-6">
                                                <input
                                                    type="text"
                                                    placeholder="Enter the item name"
                                                    value={resource.name}
                                                    onChange={(e) => handleResourceChange(index, 'name', e.target.value)}
                                                    className="bg-[#F3F3F3] text-sm border px-3 py-1 rounded-lg w-[30vw] md:w-full"
                                                    required
                                                />
                                                <select
                                                    value={resource.category}
                                                    onChange={(e) => handleResourceChange(index, 'category', e.target.value)}
                                                    className={`bg-[#F3F3F3] text-sm border px-2 py-1 rounded-lg w-[30vw] md:w-full mt-2 ${resource.category === '' ? 'text-gray-500' : 'text-black'}`}
                                                    required
                                                >
                                                    <option value="" className="text-gray-500">Select a category</option>
                                                    <option value="Foods">Foods</option>
                                                    <option value="Wearable Items">Wearable Items</option>
                                                </select>
                                            </div>
                                        </div>
                                        {/* Quantity Column */}
                                        <div className="flex items-center">
                                            <Plus className="text-gray-600 w-5 h-5 hover:scale-125 hover:cursor-pointer" onClick={() => handleResourceChange(index, 'quantity', resource.quantity + 1)} />
                                            <input
                                                type="number"
                                                value={resource.quantity}
                                                onChange={(e) => handleResourceChange(index, 'quantity', Number(e.target.value))}
                                                className="bg-white border border-1 border-gray-400 text-sm rounded-full w-[50px] h-[50px] mt-2 mx-3 pl-3 text-center"
                                                required
                                            />
                                            <Minus className="text-gray-600 w-5 h-5 hover:scale-125 hover:cursor-pointer" onClick={() => handleResourceChange(index, 'quantity', Math.max(1, resource.quantity - 1))} />
                                            <Trash className="ml-6 w-5 text-[#da3636] hover:text-[#FF0303] hover:cursor-pointer"/>
                                            <p className="ml-1 hidden [@media(min-width:540px)]:block text-[#FF0303] font-roboto hover:underline hover:cursor-pointer" onClick={() => deleteResource(index)}>Remove</p>
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-4 mb-5 lg:mb-28 flex justify-center w-full">
                                    <CirclePlus className="fill-gray-900 text-white w-8 h-10 hover:scale-105 cursor-pointer" onClick={addResource} />
                                </div>
                                
                            </div>
                            {/* End of First Column */}
                        </div>
                        {/* Third Column */}
                        <div className="lg:ml-8 lg:w-[40%] h-full">
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
                                <p className="font-roboto font-bold">Terms & Conditions</p>
                                <label className="mt-1 flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={isTermsAgreed}
                                        onChange={(e) => setIsTermsAgreed(e.target.checked)}    // Capture the action of the user, send it to useState variable, and return back to the check input
                                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 accent-gray-900"
                                    />
                                    <span className="w-full ml-3 text-sm font-roboto font-light">
                                        I hereby agree to the terms and conditions provided
                                    </span>
                                </label>
                            </div>
                            <button 
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                                onClick={handleSubmit}
                            >
                                Donate
                            </button>
                        </footer>
                    </section>
                </div>
                
            </main>
        </div>
    );
};

export default DonationPage