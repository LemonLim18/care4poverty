import ResourceBar from '@/components/resource/resourceBar'; // Adjust the import path
import ResourceBarSkeleton from '@/components/resource/ResourceBarSkeleton'; // Import the skeleton
import { Package, Truck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import ResourceModify from './resourceModify';
import { useRouter } from 'next/navigation';

interface ResourceListProps {
    loading: boolean;
    resources: any[];
}

const ResourceList: React.FC<ResourceListProps> = ({ loading, resources }) => {
    const [showModify, setShowModify] = useState(false);

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
                        <Button onClick={handleButtonClick} className="bg-[#0077B6] hover:bg-[#038BD4] mr-6">Modify Resource</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 p-6">
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
                                    number={resource.resource_amount}
                                    // Do not show the action when the resource bars are used for listing
                                    showActions={false}
                                />
                            ))
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default ResourceList;