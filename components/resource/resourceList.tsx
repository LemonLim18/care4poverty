import ResourceBar from '@/components/resource/resourceBar'; // Adjust the import path
import ResourceBarSkeleton from '@/components/resource/ResourceBarSkeleton'; // Import the skeleton
import { Apple, Croissant, Drumstick, Beef, Salad, Shirt, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; 
import { useEffect, useState } from 'react';
import ResourceModify from './resourceModify';
import { useRouter } from 'next/navigation';

interface ResourceListProps {
    loading: boolean;
    resources: any[];
}

const ResourceList: React.FC<ResourceListProps> = ({ loading, resources }) => {
    const [showModify, setShowModify] = useState(false);
    const [activeTab, setActiveTab] = useState('All'); // State to manage the active tab

    const filteredResources = resources.filter(resource => {
        if (activeTab === 'All') return true;
        if (activeTab === 'Foods') return resource.resource_category === 'Foods';
        if (activeTab === 'Wearable Items') return resource.resource_category !== 'Foods';
        return true;
    });

    const handleButtonClick = () => {
        setShowModify(true);
    }

    return (
        <>
            {showModify ? (
                <ResourceModify loading={loading} resources={resources} />
            ) : (
                <>
                    <div className="w-full flex justify-end mt-3">
                        <Button onClick={handleButtonClick} className="bg-[#0077B6] hover:bg-[#038BD4] mr-6">Update Resource</Button>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className={`bg-[#0077B6] text-white ml-6 mt-3`}>
                            <TabsTrigger className="font-bold" value="All">
                                All
                            </TabsTrigger>
                            <TabsTrigger className="font-bold" value="Foods">
                                Foods
                            </TabsTrigger>
                            <TabsTrigger className="font-bold" value="Wearable Items">
                                Wearable Items
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="All"> 
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 px-6 py-2">
                                {loading ? (
                                    // Show at most 10 skeletons while loading
                                    Array.from({ length: 10 }).map((_, index) => (
                                        <ResourceBarSkeleton key={index} />
                                    ))
                                ) : (
                                    resources.map((resource, index) => (
                                        <ResourceBar 
                                            key={index}
                                            index={index}
                                            icon={resource.resource_category === "Foods" ? Utensils : Shirt } // Map icon names to actual components
                                            name={resource.resource_name}
                                            category={resource.resource_category}
                                            number={resource.resource_amount}
                                            // Do not show the action when the resource bars are used for listing
                                            showActions={false}
                                        />
                                    ))
                                )}
                            </div>
                        </TabsContent>
                        <TabsContent value="Foods">
                            {/* ASK BOK: For other tabs like foods and wearable items, do I put one grid or two grids */}
                            <div className="grid grid-cols-1 gap-x-4 gap-y-4 px-6 py-2">
                            {
                                resources.filter(resource => resource.resource_category === "Foods").map((resource, index) => (
                                    <ResourceBar 
                                        key={index}
                                        index={index}
                                        icon={ Utensils } // Map icon names to actual components
                                        name={resource.resource_name}
                                        category={resource.resource_category}
                                        number={resource.resource_amount}
                                        // Do not show the action when the resource bars are used for listing
                                        showActions={false}
                                    />
                                ))
                            }  
                            </div>
                        </TabsContent>
                        <TabsContent value="Wearable Items">
                            <div className="grid grid-cols-1 gap-x-4 gap-y-4 px-6 py-2">
                            {
                                resources.filter(resource => resource.resource_category === "Wearable Items").map((resource, index) => (
                                    <ResourceBar 
                                        key={index}
                                        index={index}
                                        icon={ Shirt } // Map icon names to actual components
                                        name={resource.resource_name}
                                        category={resource.resource_category}
                                        number={resource.resource_amount}
                                        // Do not show the action when the resource bars are used for listing
                                        showActions={false}
                                    />
                                ))
                            }
                            </div>  
                        </TabsContent>
                    </Tabs>
                </>
            )}
        </>
    );
};

export default ResourceList;