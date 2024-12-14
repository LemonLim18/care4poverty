"use client";

import ResourceBar from '@/components/resource/resourceBar'; // Adjust the import path
import ResourceBarSkeleton from '@/components/resource/ResourceBarSkeleton'; // Import the skeleton
import { CloudCog, Package, Truck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import ResourceList from  './resourceList';
import ResourceInputBar from './ResourceInputBar';
import { updateRecord, deleteRecord } from '@/lib/supabaseAPI';
import { toast } from 'react-toastify'; // Import toast for notifications
import ConfirmationModal from './ConfirmationModal'; // Import the confirmation modal
import WarningModal from './WarningModal'; // Import the warning modal
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
    const [deletedResources, setDeletedResources] = useState<Set<number>>(new Set()); // State to store deleted resources
    const [resourceIDToDelete, setResourceIDToDelete] = useState<number | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [visibleResources, setVisibleResources] = useState(resources); // Track visible resources



    useEffect(() => {
        if (resources) {
            setLocalResourceAmounts(resources.map(resource => resource.resource_amount)); // Extract resource_amounts
        }
    }, [resources]); // Run this effect whenever resources change

    useEffect(() => {
        console.log("Resource List after add new items: ", resourceList);
    }, [resourceList]); // Run this effect whenever resourceList change

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

    return (
        <>
            {showList ? (
                <ResourceList loading={loading} resources={resourceList} />
            ) : ( 
                <>  
                    <div className="w-full flex justify-end mt-3">
                        <div>
                                <Button onClick={handleSave} className="bg-[#ffffff] outline outline-1 text-[#0077B6] hover:bg-[#038BD4] hover:text-white mr-6">
                                    Save Changes
                                </Button>
                        </div>
                        <div>
                                <Button onClick={handleShowList} className="bg-[#038BD4] hover:bg-[#0077B6] mr-6">
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
                            visibleResources.map((resource, index) => (
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