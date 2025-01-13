"use client";

import { useEffect, useState } from 'react';
import SideBarComponent from "@/components/dashboard/sideBar"; // Adjust the import path
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { UserType } from '@/datatypes/types';
import { getUser, signOut, uploadEventPhoto } from '@/lib/authFactory';
import { toast } from 'react-toastify';
import { Breadcrumb, BreadcrumbSeparator, BreadcrumbLink, BreadcrumbItem, BreadcrumbList } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { createRecord, getAllRecords } from '@/lib/supabaseAPI';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import dynamic from 'next/dynamic';
import { MdEventBusy } from 'react-icons/md';
import { supabase } from '@/lib/supabaseClient'; // Ensure you have a Supabase client setup

const Map = dynamic(() => import('@/components/map/map'), { ssr: false });

const CreateEventPage = () => {
    const [userData, setUserData] = useState<UserType | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const [userId, setUserId] = useState('');

    const [sharedInfo, setSharedInfo] = useState({
        event_title: '',
        event_summary: '',
        event_description: '',
        event_date: '',
        event_type: '',
        event_photos: [] as string[],
        event_location: 'Penang',
        org_id: '',
        event_url: '',
    });

    const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
    const [mapLocation, setMapLocation] = useState(sharedInfo.event_location || 'Penang');

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
                setSharedInfo(prevInfo => ({
                    ...prevInfo,
                    org_id: currentUser.id // Set the org_id to the current user's ID
                }));
            }
        };

        fetchUser();
    }, []); // Only run once on mount

    useEffect(() => {
        if (userData) {
            setUserId(userData.id);
        }
    }, [userData]);

    const handleSharedInfoChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, files } = e.target as HTMLInputElement; // Type assertion for file handling
        
        if (type === 'file' && files) {
            const fileArray = Array.from(files).slice(0, 3); // Limit to 3 files
            let uploadedFileUrls: string[] = [...sharedInfo.event_photos]; // Start with existing URLs

            try {
                const uploadPromises = fileArray.map(file => uploadEventPhoto(file));
                const results = await Promise.all(uploadPromises);

                const newFileUrls = results.map(({ data, error }) => {
                    if (error) {
                        console.error('Error uploading file:', error);
                        toast.error('Failed to upload file. Please try again.');
                        throw new Error('File upload failed');
                    }
                    return data.file_url;
                });

                uploadedFileUrls = [...uploadedFileUrls, ...newFileUrls]; // Append new URLs

                setSharedInfo({
                    ...sharedInfo,
                    event_photos: uploadedFileUrls
                });

                // Create FileReaders to read the files and set the previews
                fileArray.forEach(file => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setPhotoPreviews(prev => [...prev, reader.result as string]);
                    };
                    reader.readAsDataURL(file);
                });
            } catch (error) {
                console.error('Error during file uploads:', error);
            }
        } else {
            setSharedInfo({
                ...sharedInfo,
                [name]: value
            });
        }
    };

    const handleLocationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission
            setMapLocation(sharedInfo.event_location);
        }
    };

    const handleLogout = async () => {
        await signOut();
        toast.success('Successfully logged out!', {
            autoClose: 1250, // Toast will disappear after 1500s
        });
        setTimeout(() => {
            router.push('/auth/login'); // Redirect to login page after logout
        }, 1000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const eventData = {
                ...sharedInfo
            };
            
            console.log("User ID: ", userId);

            if (sharedInfo.event_type === 'donation' || sharedInfo.event_type === 'galaeevent') {
                const users = await getAllRecords('users');
                const donors = users.data?.filter(user => user.role === 'donor');
                const donorIds = donors?.map(donor => donor.id);
                console.log("Donor ids:", donorIds);

                if (donorIds && donorIds.length > 0) {
                    for (const donor_id of donorIds) {
                        const notification = {
                            notis_title: `Surprise, my organization will be holding a new event!`,
                            notis_description: `'${sharedInfo.event_title}' will be held on ${sharedInfo.event_date} at ${sharedInfo.event_location}. Do come and join us!`,
                            other_id: userId,
                            user_id: donor_id,
                            notis_timestamp: new Date().toISOString().split('T')[0],
                            notis_status: 'unread',
                        };
            
                        const notificationResponse = await createRecord('notifications', notification);
                        if (notificationResponse.error) {
                            toast.error(notificationResponse.error.message || "Notification creation failed. Please try again.");
                        }
                    }
                }
            }

            if (sharedInfo.event_type === 'funrun' || sharedInfo.event_type === 'concert') {
                const users = await getAllRecords('users');
                const beneficiaries = users.data?.filter(user => user.role === 'beneficiary');
                const beneficiaryIds = beneficiaries?.map(beneficiary => beneficiary.id);
                console.log("Beneficiary ids:", beneficiaryIds);

                if (beneficiaryIds && beneficiaryIds.length > 0) {
                    for (const beneficiary_id of beneficiaryIds) {
                        const notification = {
                            notis_title: `Surprise, my organization will be holding a new event!`,
                            notis_description: `'${sharedInfo.event_title}' will be held on ${sharedInfo.event_date} at ${sharedInfo.event_location}. Do come and join us!`,
                            other_id: userId,
                            user_id: beneficiary_id,
                            notis_timestamp: new Date().toISOString().split('T')[0],
                            notis_status: 'unread',
                        };
            
                        const notificationResponse = await createRecord('notifications', notification);
                        if (notificationResponse.error) {
                            toast.error(notificationResponse.error.message || "Notification creation failed. Please try again.");
                        }
                    }
                }
            }

            const response = await createRecord('events', eventData);

            if (response.error) {
                toast.error(response.error.message || "Event creation failed. Please try again.");
            } else {
                toast.success("Event created successfully!");
                router.push('/event');
            }
            
        } catch (error) {
            toast.error("Event creation failed. Please try again.");
        }

        
    };

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
                            <BreadcrumbItem>Notification</BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>Create New Event</BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <div className="flex flex-col">
                    <div className="mt-7 mb-7">
                        <h1 className="font-giorgio font-bold text-4xl sm:text-5xl md:text-6xl">Create New Event</h1>
                    </div>

                    <div>
                        <h1 className="font-roboto text-xl sm:text-xl md:text-xl">Fill in the following information</h1>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="w-full max-w-6xl">
                        <Card className="w-full p-5 mb-5">
                            <div className="flex flex-col md:flex-row">
                            <div className="flex flex-col md:w-1/2 w-full p-2">
                                    <div className="mb-5">
                                        <Label htmlFor="event_title" className="text-base font-medium">
                                            Title
                                            <span className="ml-[2px] text-[#FF0000] font-bold"> *</span>
                                        </Label>
                                        <Input
                                            id="event_title"
                                            name="event_title"
                                            value={sharedInfo.event_title}
                                            onChange={handleSharedInfoChange}
                                            required
                                            className="text-sm px-2 py-1 border-2 border-custom-border-blue focus:border-[#0C8CE9] bg-[#F5F9FE] rounded-lg text-[#7D7D7D] focus:text-black hover:border-[#0C8CE9] transition-all duration-150 ease-in-out"
                                        />
                                    </div>

                                    <div className="mb-5">
                                        <Label htmlFor="event_summary" className="text-base font-medium">
                                            Summary
                                            <span className="ml-[2px] text-[#FF0000] font-bold"> *</span>
                                        </Label>
                                        <Input
                                            id="event_summary"
                                            name="event_summary"
                                            value={sharedInfo.event_summary}
                                            onChange={handleSharedInfoChange}
                                            required
                                            className="text-sm px-2 py-1 border-2 border-custom-border-blue focus:border-[#0C8CE9] bg-[#F5F9FE] rounded-lg text-[#7D7D7D] focus:text-black hover:border-[#0C8CE9] transition-all duration-150 ease-in-out"
                                        />
                                    </div>

                                    <div className="mb-5 flex flex-col">
                                        <Label htmlFor="event_description" className="text-base font-medium">
                                            Description
                                            <span className="ml-[2px] text-[#FF0000] font-bold"> *</span>
                                        </Label>
                                        <textarea
                                            id="event_description"
                                            name="event_description"
                                            value={sharedInfo.event_description}
                                            onChange={handleSharedInfoChange}
                                            required
                                            className="scrollbar-hidden text-sm px-2 py-1 border-2 border-custom-border-blue focus:border-[#0C8CE9] bg-[#F5F9FE] rounded-lg text-[#7D7D7D] focus:text-black hover:border-[#0C8CE9] transition-all duration-150 ease-in-out"
                                            rows={4} // Adjust the number of rows as needed
                                        />
                                    </div>

                                    <div className="mb-5">
                                        <Label htmlFor="event_date" className="text-base font-medium">
                                            Date
                                            <span className="ml-[2px] text-[#FF0000] font-bold"> *</span>
                                        </Label>
                                        <Input
                                            id="event_date"
                                            name="event_date"
                                            type="date"
                                            value={sharedInfo.event_date}
                                            onChange={handleSharedInfoChange}
                                            required
                                            className="text-sm px-2 py-1 border-2 border-custom-border-blue focus:border-[#0C8CE9] bg-[#F5F9FE] rounded-lg text-[#7D7D7D] focus:text-black hover:border-[#0C8CE9] transition-all duration-150 ease-in-out"
                                        />
                                    </div>

                                    <div className="mb-5 space-y-1 flex flex-col">
                                        <Label htmlFor="event_type" className="text-base font-medium">
                                            Type
                                            <span className="ml-[2px] text-[#FF0000] font-bold"> *</span>
                                        </Label>
                                        <select 
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                setSharedInfo({...sharedInfo, event_type: newValue});
                                                console.log("Updated sharedInfo:", { ...sharedInfo, event_type: newValue });
                                            }}
                                            required
                                            className="text-sm px-2 py-2 border-2 border-custom-border-blue focus:border-[#0C8CE9] bg-[#F5F9FE] rounded-lg text-[#7D7D7D] focus:text-black hover:border-[#0C8CE9] transition-all duration-150 ease-in-out"
                                        >
                                            <option value="">Select an event type</option>
                                            <option value="funrun">Fun Run</option>
                                            <option value="galaevent">Gala Event</option>
                                            <option value="concert">Concert</option>
                                            <option value="donation">Donation</option>
                                        </select>
                                    </div>

                                    <div className="mb-5">
                                        <Label htmlFor="event_url" className="text-base font-medium">
                                            URL
                                            <span className="ml-[2px] text-[#FF0000] font-bold"> *</span>
                                        </Label>
                                        <Input
                                            id="event_url"
                                            name="event_url"
                                            value={sharedInfo.event_url}
                                            onChange={handleSharedInfoChange}
                                            required
                                            className="text-sm px-2 py-1 border-2 border-custom-border-blue focus:border-[#0C8CE9] bg-[#F5F9FE] rounded-lg text-[#7D7D7D] focus:text-black hover:border-[#0C8CE9] transition-all duration-150 ease-in-out"
                                        />
                                    </div>
                                </div>
                                <div className="md:w-1/2 w-full p-2">
                                    <div className="mb-5">
                                        <Label htmlFor="event_photos" className="text-base font-medium">
                                            Photo (maximum of 3)
                                            <span className="ml-[2px] text-[#FF0000] font-bold"> *</span>
                                        </Label>
                                        <Input
                                            id="event_photos"
                                            name="event_photos"
                                            type="file"
                                            accept=".jpg,.jpeg,.png"
                                            onChange={handleSharedInfoChange}
                                            // required
                                            multiple
                                            className="text-sm px-2 border-2 border-custom-border-blue focus:border-[#0C8CE9] bg-[#F5F9FE] rounded-lg text-[#7D7D7D] focus:text-black hover:border-[#0C8CE9] transition-all duration-150 ease-in-out"
                                        />
                                        <div className="flex p-2 mt-3 space-x-2">
                                            {photoPreviews.map((preview, index) => (
                                                <img key={index} src={preview} alt={`Event Photo Preview ${index + 1}`} className="w-32 h-32 rounded-lg object-cover" />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mb-5">
                                        <Label htmlFor="event_location" className="text-base font-medium">
                                            Location
                                            <span className="ml-[2px] text-[#FF0000] font-bold"> *</span>
                                        </Label>
                                        <Input
                                            id="event_location"
                                            name="event_location"
                                            value={sharedInfo.event_location}
                                            onChange={handleSharedInfoChange}
                                            onKeyDown={handleLocationKeyDown}
                                            required
                                            className="text-sm px-2 py-1 border-2 border-custom-border-blue focus:border-[#0C8CE9] bg-[#F5F9FE] rounded-lg text-[#7D7D7D] focus:text-black hover:border-[#0C8CE9] transition-all duration-150 ease-in-out"
                                        />
                                    </div>
                                    <Map locationText={mapLocation} />
                                </div>
                            </div>
                            <div className="flex grid grid-cols-2">
                                <Button 
                                    onClick={() => window.history.back()}
                                    className="mx-auto mt-2 h-11 w-32 bg-gray-500 hover:bg-gray-600 rounded-lg text-base "
                                >
                                    Back
                                </Button>
                                <Button 
                                    type="submit"
                                    className="mx-auto mt-2 h-11 w-32 bg-[#0077B6] hover:bg-[#00689F] rounded-lg text-base"
                                >
                                    Create Event
                                </Button>
                            </div>
                        </Card> 
                    </form>
                </div>
            </main>
        </div>
    );
};

export default CreateEventPage; 