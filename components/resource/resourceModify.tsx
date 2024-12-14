"use client";

import ResourceBar from '@/components/resource/resourceBar'; // Adjust the import path
import ResourceBarSkeleton from '@/components/resource/ResourceBarSkeleton'; // Import the skeleton
import { CloudCog, Package, Truck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import ResourceList from  './resourceList';
import ResourceInputBar from './ResourceInputBar';
import { updateRecord } from '@/lib/supabaseAPI';
import { toast } from 'react-toastify'; // Import toast for notifications
import ConfirmationModal from './ConfirmationModal'; // Import the confirmation modal
import { useRouter } from 'next/navigation';

interface ResourceListProps {
    loading: boolean;
    resources: any[];
}

const ResourceModify: React.FC<ResourceListProps> = ({ loading, resources }) => {
    const [showList, setShowList] = useState(false);
    const [resourceList, setResourceList] = useState(resources);
    const [localResourceAmounts, setLocalResourceAmounts] = useState<number[]>([]); // Local state for resource amounts
    const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog 

    useEffect(() => {
        if (resources) {
            setLocalResourceAmounts(resources.map(resource => resource.resource_amount)); // Extract resource_amounts
        }
    }, [resources]); // Run this effect whenever resources change

    const handleShowList = () => {
        setShowList(true);
    }

    const handleAddResource = (name: string, category: string, number: number) => {
        const newResource = {
            icon: "Package", // You can set a default icon or modify this as needed
            name,
            category,
            number,
            actionLabel: "Manage" // Default action label
        };
        setResourceList(prevResources => [newResource, ...prevResources]); // Add new resource at the top
    };

    const handleSave = () => {
        setIsDialogOpen(true); // Open the confirmation dialog
    };

    const confirmSave = async () => {
        setIsDialogOpen(false); // Close the dialog
        try {
            const updatedResources = [...resources]; // Create a copy of the resources
            for (let i = 0; i < resources.length; i++) {
                // Update each resource in the database with the latest local amounts
                await updateRecord('resources', resources[i].id, { resource_amount: localResourceAmounts[i] });
                updatedResources[i].resource_amount = localResourceAmounts[i];
            }

            // Update the local state with the new resource list
            setResourceList(updatedResources);
            
            toast.success('Resources updated successfully!', {autoClose: 1500}); // Show success message
            console.log("LOCAL Updated resources:", resourceList);
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
            if (newAmounts[index] > 0) {
                newAmounts[index] -= 1; // Decrement the amount directly
            }
            return newAmounts; // Return the updated array
        });
    };

    const handleDelete = (index: number) => {
        setResourceList(prevResources => {
            return prevResources.filter((_, i) => i !== index); // Remove the resource at the specified index
        });
    };

    return (
        <>
            {showList ? (
                <ResourceList loading={loading} resources={resourceListnppm} />
            ) : ( 
                <>  
                    <div className="w-full flex justify-end mt-3">
                        <div>
                                <Button onClick={handleSave} className="bg-[#ffffff] outline outline-1 text-[#0077B6] hover:bg-[#038BD4] hover:text-white mr-6">
                                    Save
                                </Button>
                        </div>
                        <div>
                                <Button onClick={handleShowList} className="bg-[#0077B6] hover:bg-[#038BD4] mr-6">
                                    Show Resource
                                </Button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-x-4 gap-y-4 p-6">
                        <ResourceInputBar onAddResource={handleAddResource} /> {/* Add the input bar at the top */}
                        {loading ? (
                            // Show skeletons while loading
                            Array.from({ length: 10 }).map((_, index) => (
                                <ResourceBarSkeleton key={index} />
                            ))
                        ) : (
                            resources.map((resource, index) => (
                                <ResourceBar 
                                    key={index}
                                    icon={resource.icon === "Package" ? Package : resource.icon === "Truck" ? Truck : Users} // Map icon names to actual components
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
                </>
            )}
        </>
    );
}

export default ResourceModify;