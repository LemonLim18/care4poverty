"use client";

import ResourceBar from '@/components/resource/resourceBar'; // Adjust the import path
import ResourceBarSkeleton from '@/components/resource/ResourceBarSkeleton'; // Import the skeleton
import { Package, Truck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import ResourceList from  './resourceList';

interface ResourceListProps {
    loading: boolean;
    resources: any[];
}


const ResourceModify: React.FC<ResourceListProps> = ({ loading, resources }) => {
    const [showList, setShowList] = useState(false);
    const [resourceList, setResourceList] = useState(resources);


    const handleShowList = () => {
        setShowList(true);
    }

    const handleAdd = (index: number) => {
        setResourceList(prevResources => {
            const newResources = [...prevResources];
            // console.log('Before Add:', newResources[index].number); // Log before
            newResources[index].number += 0.5; // Increment the number by 1
            console.log('After Add:', resourceList); // Log after
            return newResources;
        });
    };

    const handleSubtract = (index: number) => {
        setResourceList(prevResources => {
            const newResources = [...prevResources];
            if (newResources[index].number > 0) {
                newResources[index].number -= 0.5; // Decrement the number by 1
            }
            console.log('After Subtract:', resourceList); // Log after
            return newResources;
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
                <ResourceList loading={loading} resources={resources} />
            ) : ( 
                <>  
                    <div className="w-full flex justify-end mt-6">
                        <div>
                                <Button onClick={handleShowList} className="bg-[#ffffff] outline outline-1 text-[#0077B6] hover:bg-[#038BD4] hover:text-white mr-6">
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
                                    name={resource.name}
                                    category={resource.category}
                                    number={resource.number}
                                    onAdd={()=>handleAdd(index)}
                                    onSubtract={()=>handleSubtract(index)}
                                    onDelete={()=>handleDelete(index)}
                                    showActions={true}
                                />
                            ))
                        )}
                    </div>
                </>
            )}
        </>
    );
}

export default ResourceModify;