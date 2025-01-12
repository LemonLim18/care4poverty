"use client";

import ResourceBar from '@/components/resource/resourceBar'; // Adjust the import path
import ResourceBarSkeleton from '@/components/resource/ResourceBarSkeleton'; // Import the skeleton
import { Apple, Croissant, Drumstick, Beef, Salad, Shirt, Utensils, ScanQrCode, ScanSearch, Unplug, ChartNoAxesColumnIncreasing, Coffee, Cross } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import ResourceList from  './resourceList';
import ResourceInputBar from './ResourceInputBar';
import { updateRecord, deleteRecord } from '@/lib/supabaseAPI';
import { toast } from 'react-toastify'; // Import toast for notifications
import ConfirmationModal from './ConfirmationModal'; // Import the confirmation modal
import router from 'next/router';
import WarningModal from './WarningModal'; // Import the warning modal
import { useRouter } from 'next/navigation';
import { ClipLoader } from 'react-spinners'; 
import axios from 'axios';

interface ResourceListProps {
    loading: boolean;
    resources: any[];
    userID: string;
}

const ResourceModify: React.FC<ResourceListProps> = ({ loading, resources, userID }) => {
    const [showList, setShowList] = useState(false);
    const [resourceList, setResourceList] = useState(resources);
    const [localResourceAmounts, setLocalResourceAmounts] = useState<number[]>([]); // Local state for resource amounts
    const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog 
    const [deletedResources, setDeletedResources] = useState<Set<number>>(new Set()); // State to store deleted resources
    const [resourceIDToDelete, setResourceIDToDelete] = useState<number | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [visibleResources, setVisibleResources] = useState(resources); // Track visible resources
    const router = useRouter();

    // Scanner section
    const [scannedData, setScannedData] = useState<any>(null);
    const [scanLoading, setScanLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(false);


    useEffect(() => {
        if (resources) {
            setLocalResourceAmounts(resources.map(resource => resource.resource_amount)); // Extract resource_amounts
        }
    }, [resources]); // Run this effect whenever resources change

    useEffect(() => {
        console.log("Resource List after add new items: ", resourceList);
    }, [resourceList]); // Run this effect whenever resourceList change

    useEffect(() => {
        console.log("Newly Added Visible Resources: ", visibleResources);
    }, [visibleResources]);

    useEffect(() => {
        if(scannedData) {
            console.log("Scanned Data: ", scannedData);
        }
    }, [scannedData]);

    const handleShowList = () => {
        setShowList(true);
    }

    const handleAddResource = (resource_name: string, resource_category: string, resource_number: number) => {
        const newResource = {
            icon: "Package", // You can set a default icon or modify this as needed
            resource_name,
            resource_category,
            resource_number,
            actionLabel: "Manage" // Default action label
        };
        setResourceList(prevResources => [newResource, ...prevResources]); // Add new resource at the top
        setVisibleResources(prevResources => [newResource, ...prevResources]); // Add new resource at the top
    };

    const handleSave = () => {
        setIsDialogOpen(true); // Open the confirmation dialog
    };

    const confirmSave = async () => {
        setIsDialogOpen(false); // Close the dialog
        try {
            const updatedResources = [...resources]; // Create a copy of the resources
            for (let i = 0; i < resources.length; i++) {
                if (!deletedResources.has(resources[i].id)) { // Only update if not marked for deletion
                    await updateRecord('resources', resources[i].id, { resource_amount: localResourceAmounts[i] });
                    // Update the local copy with the new amount
                    updatedResources[i].resource_amount = localResourceAmounts[i];
                } else {
                    // If marked for deletion, delete from the database
                    await deleteRecord('resources', resources[i].id);
                }
            }

            // Update the local state with the new resource list
            setResourceList(updatedResources);
            toast.success('Resources updated successfully!', {autoClose: 1300}); // Show success message
            console.log("LOCAL Updated resources:", resourceList);
            setTimeout(() => {
                window.location.reload();
            }, 1500)
        } catch (error) {
            console.error('Error saving resources:', error);
            toast.error('Error updating resources. Please try again.'); // Show error message
        }
    };

    const handleAdd = (index: number) => {
        setLocalResourceAmounts(prevAmounts => {
            const newAmounts = [...prevAmounts]; // Create a new array
            newAmounts[index] += 1; // Increment the amount directly
            return newAmounts; // Return the updated array
        });
    };

    const handleSubtract = (index: number) => {
        setLocalResourceAmounts(prevAmounts => {
            const newAmounts = [...prevAmounts]; // Create a new array
            if (newAmounts[index] > 1) {
                newAmounts[index] -= 1; // Decrement the amount directly
            }
            return newAmounts; // Return the updated array
        });
    };

    const handleDelete = (index: number) => {
        // Delete visually
        // setResourceList(prevResources => {
        //     return prevResources.filter((_, i) => i !== index); // Remove the resource at the specified index
        // });
        
        const resourceIdToBeDeleted = resources[index].id;
        setDeletedResources(prev => new Set(prev).add(resourceIdToBeDeleted)); // Mark the resource for deletion
        console.log("Deleted Resources: ", deletedResources);

        // Save the deleted resources ID
        // const resourceId = resources[index].id;
        setResourceIDToDelete(resourceIdToBeDeleted);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (resourceIDToDelete !== null) {
            setDeletedResources(prev => new Set(prev).add(resourceIDToDelete));
            setVisibleResources(prev => prev.filter(resource => resource.id !== resourceIDToDelete)); // Temporarily remove from visible list
            setIsDeleteDialogOpen(false);
            setResourceIDToDelete(null);
        }
    };

    const cancelDelete = () => {
        setIsDeleteDialogOpen(false);
        setResourceIDToDelete(null);
    };

    const handleScan = async() => {
        if(isConnected) {
            setIsConnected(false)
            const disconnect = await axios.get('http://127.0.0.1:5000/disconnect')
            console.log("Disconnect response: ", disconnect);
            toast.success("Scanner disconnected", {autoClose: 1200});
        } else {
            setScanLoading(true);
            try {
                const connectCheck = await axios.get('http://127.0.0.1:5000/check-connection');
                console.log("Connection check: ", connectCheck);
                if(connectCheck.data.status_code === "200") {
                    setIsConnected(true);
                    setScanLoading(false);
                    toast.success("Scanner connected!", {autoClose: 1200});
                    setTimeout(() => {
                        toast.info("Loading in 5 seconds...", {autoClose: 5000});
                    }, 1000);

                    const eventSource = new EventSource('http://127.0.0.1:5000/scan-barcode');

                    eventSource.onmessage = (event) => {
                        const scannedResult = JSON.parse(event.data);
                        console.log("Scanned result: ", scannedResult);
                        setScannedData(scannedResult);
                    };
                    eventSource.onerror = (err) => {
                        console.log("Error in SSE connection: ", err);
                        eventSource.close();
                    };
                }else{
                    toast.error("Failed to connect scanner. Please try again.", {autoClose: 1200});
                }

                // const response = await axios.get('http://127.0.0.1:5000/scan-barcode');
                // console.log("Scanned response: ", response);
                // setScannedData(response.data);
                
            } catch (error) {
                console.log("Error scanning barcode: ", error);
            }
            setScanLoading(false);
        }
    };

    return (
        <>
            {showList ? (
                <ResourceList loading={loading} resources={resourceList} userID={userID} />
            ) : ( 
                <>  
                    <div className="w-full flex justify-between mt-8">
                        <div className="ml-6">
                            <Button onClick={handleScan} className={`${isConnected? "bg-red-600 hover:bg-red-700" : "bg-[#038BD4] hover:bg-[#0077B6]"} outline outline-1 w-40 mr-6`}>
                                
                                {/* {!scanLoading && <ScanSearch/>} */}
                                {scanLoading ? 
                                    <ClipLoader size={17} color="#ffffff" loading={scanLoading}  /> 
                                    : (
                                        <>
                                            {isConnected ? 
                                                <>
                                                    <Unplug className="inline-block" />
                                                    Disconnect Scanner
                                                </>
                                                : (
                                                <>
                                                    <ScanSearch className="inline-block mr-2" />
                                                    Connect Scanner
                                                </>
                                            )}
                                        </>
                                    )}
                            </Button>
                        </div>
                        <div>
                                <Button onClick={handleSave} className="bg-[#ffffff] outline outline-1 text-[#0077B6] hover:bg-[#038BD4] hover:text-white mr-6">
                                    Save Changes
                                </Button>
                                <Button onClick={handleShowList} className="bg-[#038BD4] hover:bg-[#0077B6] mr-6">
                                    Back
                                </Button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-x-4 gap-y-4 p-6">
                        {/* Add the input bar at the top */}
                        <ResourceInputBar scannedInput={scannedData} onAddResource={handleAddResource} userID={userID}/> 
                        {loading ? (
                            // Show skeletons while loading
                            Array.from({ length: 10 }).map((_, index) => (
                                <ResourceBarSkeleton key={index} />
                            ))
                        ) : (
                            visibleResources.map((resource, index) => (
                                <ResourceBar 
                                    key={index}
                                    index={index}
                                    icon={resource.resource_category === "Foods" ? Utensils : resource.resource_category === "Drinks" ? Coffee : resource.resource_category === "Health Supplies" ? Cross : Shirt } // Map icon names to actual components
                                    name={resource.resource_name}
                                    category={resource.resource_category}
                                    number={localResourceAmounts[index]}
                                    onAdd={()=>handleAdd(index)}
                                    onSubtract={()=>handleSubtract(index)}
                                    onDelete={()=>handleDelete(index)}
                                    showActions={true}
                                />
                            ))
                        )}
                    </div>
                    <ConfirmationModal 
                        open={isDialogOpen} 
                        onClose={() => setIsDialogOpen(false)} 
                        onConfirm={confirmSave} 
                    />
                    <WarningModal 
                        isOpen={isDeleteDialogOpen} 
                        onClose={cancelDelete} 
                        onConfirm={confirmDelete} 
                        resourceName={resourceIDToDelete !== null ? resources.find(r => r.id === resourceIDToDelete)?.resource_name : ''} 
                    />
                    
                </>
            )}
        </>
    );
}

export default ResourceModify;